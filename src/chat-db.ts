import { PrismaClient } from "@prisma/client";
import { KaracaBotContext, KaracaBotMessage } from "./karacabot-context/karacabot-context";
import { Message, OAuth2Guild } from "discord.js";

class ChatDB {
    prisma: PrismaClient;
    guildCache: { [key: string]: number } = {};
    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async findGuildInternalId(guildId: string) {
        return (await this.prisma.guild.findUnique({
            where: { discordId: guildId, }
        }))!.id;
    }

    async saveGuildIfNotExists(g: OAuth2Guild) {
        await this.prisma.guild.upsert({
            where: {
                discordId: g.id,
            },
            create: {
                discordId: g.id,
                options: {
                    create: {},
                }
            },
            update: {},
        });
    }

    async getMessagesOfGuild(guildId: number): Promise<KaracaBotContext> {
        const messages = await this.prisma.chatMessage.findMany({
            where: {
                guildId,
            }
        });
        const context = new KaracaBotContext();
        for(const message of messages) {
            context.messages.push({
                username: message.username,
                channelId: message.discordChannelId,
                guildId: message.guildId,
                isAI: message.isAI,
                shouldAnswer: message.botShouldAnswer,
                textContent: message.content,
                discordMessageId: message.externalMessageId,
            });
        }
        return context;
    }

    async saveArbitraryChatMessage(karacaBotContext: KaracaBotContext, message: KaracaBotMessage) {
        if(karacaBotContext.contextId === -1) {
            const maxContextId = await this.prisma.chatMessage.aggregate({
                _max: {
                    contextId: true,
                }
            });
            karacaBotContext.contextId = (maxContextId._max.contextId ?? 0) + 1;
        }
        await this.prisma.chatMessage.create({
            data: {
                content: message.textContent,
                contextId: karacaBotContext.contextId,
                discordChannelId: message.channelId,
                externalMessageId: message.discordMessageId,
                isAI: message.isAI,
                username: message.username,
                isSystemMessage: message.isSystemMessage,
                guildId: message.guildId,
            }
        });
    }

    async saveChatMessage(karacaBotContext: KaracaBotContext, message: Message, isAI: boolean, guildId: number) {
        if(karacaBotContext.contextId === -1) {
            const maxContextId = await this.prisma.chatMessage.aggregate({
                _max: {
                    contextId: true,
                }
            });
            karacaBotContext.contextId = (maxContextId._max.contextId ?? 0) + 1;
        }
        await this.prisma.chatMessage.create({
            data: {
                contextId: karacaBotContext.contextId,
                username: message.member?.displayName ?? '',
                externalMessageId: message.id,
                content: message.content,
                isAI: isAI,
                discordChannelId: message.channel.id,
                guildId: guildId,
            }
        });
    }

}

export const chatDb = new ChatDB(new PrismaClient());