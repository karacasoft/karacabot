import * as Discord from "discord.js";
import { config } from "dotenv";
import { registerSlashCommands } from "./register-slash-commands";
import { executeGenerateFakeMessage, executeGenerateSystemMessage, executeMarkEndOfConversationCommand, executeReplyAsBot, generateFakeMessage, generateSystemMessage, markEndOfConversationCommand, processMessage, replyAsBot } from "./learning/learning";
import { chatDb } from "./chat-db";

config();

const client = new Discord.Client({
    intents: [
        "Guilds",
        "GuildMessages",
        "GuildMessageReactions",
        "GuildMessageTyping",
        "MessageContent",
        "DirectMessages",
        "DirectMessageTyping",
        "DirectMessageReactions",
    ],
    partials: [
        Discord.Partials.Message,
        Discord.Partials.Channel,
        Discord.Partials.GuildMember,
        Discord.Partials.Reaction,
    ]
});

client.on("ready", async () => {
    console.log(`${client.user?.tag} göreve hazır!`);
    client.user?.setPresence({
        status: "online",
    });

    const guilds = await client.guilds.fetch();
    guilds.forEach(g => {
        chatDb.saveGuildIfNotExists(g);
    });
});

client.on("messageCreate", msg => {
    processMessage(msg);
});

client.login(process.env["CLIENT_TOKEN"])
    .then(_ => {
        const commands = [{
            slashCommand: replyAsBot.toJSON(),
            execute: executeReplyAsBot,
        }, {
            slashCommand: markEndOfConversationCommand.toJSON(),
            execute: executeMarkEndOfConversationCommand,
        }, {
            slashCommand: generateFakeMessage.toJSON(),
            execute: executeGenerateFakeMessage,
        }, {
            slashCommand: generateSystemMessage.toJSON(),
            execute: executeGenerateSystemMessage,
        }];
        registerSlashCommands(client, commands);
    });

