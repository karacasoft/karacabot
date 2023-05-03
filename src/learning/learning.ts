import { ApplicationCommandOptionType, Interaction, Message, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { chatDb } from "../chat-db";
import { KaracaBotContext } from "../karacabot-context/karacabot-context";

let currentContext = new KaracaBotContext();

export async function processMessage(message: Message) {
    if(message.channelId === process.env.LEARNING_ALLOWED_CHANNEL) {
        if(message.member?.id === process.env.CLIENT_ID) return;
        if(message.guildId) {
            const guildId = await chatDb.findGuildInternalId(message.guildId);
            currentContext.messages.push({
                username: message.member?.nickname ?? '<unnamed>',
                textContent: message.content,
                channelId: message.channelId,
                guildId: guildId,
                isAI: false,
                shouldAnswer: false,
                discordMessageId: message.id,
            });
            await chatDb.saveChatMessage(currentContext, message, false, guildId);
        } else {
            await chatDb.saveChatMessage(currentContext, message, false, -1);
        }
    }
}

export const markEndOfConversationCommand = new SlashCommandBuilder()
    .setName('mark-end-of-conversation')
    .setDescription('Resets the context for learning purposes');

export async function executeMarkEndOfConversationCommand(interaction: Interaction) {
    if(interaction.isChatInputCommand()) {
        currentContext = new KaracaBotContext();
        interaction.reply('Context refreshed');
    }
}


export const generateSystemMessage = new SlashCommandBuilder()
    .setName('generate-system-message')
    .setDescription('Add a message to the context from the system for training dataset')
    .addStringOption(option => option.setName('message')
                                     .setDescription('Sistemden gelen mesaj')
                                     .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function executeGenerateSystemMessage(interaction: Interaction) {
    if(interaction.isChatInputCommand()) {
        const message = (interaction.options.get('message')!.value as string).replace(/\\n/, '\n');
        if(interaction.guildId) {
            const guildId = await chatDb.findGuildInternalId(interaction.guildId);
            const reply = await interaction.reply("Done");
            currentContext.messages.push({
                channelId: reply.interaction.channelId ?? '',
                discordMessageId: reply.interaction.id,
                guildId: guildId,
                isAI: false,
                shouldAnswer: false,
                textContent: message,
                isSystemMessage: true,
                username: 'system'
            });
            await chatDb.saveArbitraryChatMessage(currentContext, {
                channelId: interaction.channelId ?? '',
                discordMessageId: '<artificial>',
                guildId: guildId,
                isAI: false,
                shouldAnswer: false,
                textContent: message,
                username: 'system',
                isSystemMessage: true,
            });
        }
    }
}



export const generateFakeMessage = new SlashCommandBuilder()
    .setName('generate-fake-message')
    .setDescription('Add a message to the context from a non-existing user for training dataset')
    .addStringOption(option => option.setName('username')
                                     .setDescription('Mesajı atan kullanıcı')
                                     .setRequired(true))
    .addStringOption(option => option.setName('message')
                                     .setDescription('Yazılmış olan mesaj')
                                     .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);;

export async function executeGenerateFakeMessage(interaction: Interaction) {
    if(interaction.isChatInputCommand()) {
        const username = interaction.options.get('username')!;
        const message = (interaction.options.get('message')!.value as string).replace(/\\n/, '\n');
        if(interaction.guildId) {
            const guildId = await chatDb.findGuildInternalId(interaction.guildId);
            const reply = await interaction.reply("Done");
            currentContext.messages.push({
                channelId: reply.interaction.channelId ?? '',
                discordMessageId: reply.interaction.id,
                guildId: guildId,
                isAI: false,
                shouldAnswer: false,
                textContent: message,
                username: username.value as string,
            });
            await chatDb.saveArbitraryChatMessage(currentContext, {
                channelId: interaction.channelId ?? '',
                discordMessageId: '<artificial>',
                guildId: guildId,
                isAI: false,
                shouldAnswer: false,
                textContent: message,
                username: username.value as string,
            });
        }
    }
}

export const replyAsBot = new SlashCommandBuilder()
    .setName('reply-as-bot')
    .setDescription('Make the bot reply to the current conversation')
    .addStringOption(option => option.setName('response')
                                     .setDescription('Bot\'un vermesini istediğin cevabı yaz')
                                     .setRequired(true)
                                     )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function executeReplyAsBot(interaction: Interaction) {
    if(interaction.isChatInputCommand()) {
        const response = interaction.options.get('response');
        const responseClean = (response!.value as string).replace(/\\n/g, '\n');
        if(response?.type === ApplicationCommandOptionType.String) {
            if(interaction.guildId) {
                const guildId = await chatDb.findGuildInternalId(interaction.guildId);
                const reply = await interaction.reply(responseClean);
                currentContext.messages.push({
                    channelId: reply.interaction.channelId ?? '',
                    discordMessageId: reply.interaction.id,
                    guildId: guildId,
                    isAI: true,
                    shouldAnswer: false,
                    textContent: responseClean,
                    username: 'KaracaBot',
                });
                const message = await reply.fetch();
                await chatDb.saveChatMessage(currentContext, message, true, guildId);
            }
        }
    }
}