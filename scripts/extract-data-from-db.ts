import { ChatMessage, PrismaClient } from "@prisma/client";
import { appendFile, closeSync, openSync, writeSync } from "fs";


const prisma = new PrismaClient();

async function main() {
    const f = openSync('data.csv', 'w');
    const messages = await prisma.chatMessage.findMany();
    for(let i = 0; i < messages.length; i++) {
        const message = messages[i];
        let nextMessage: ChatMessage | undefined;
        if(i + 1 < messages.length) nextMessage = messages[i + 1];
        const structuredMessage = {
            conversation_id: message.contextId,
            message: message.content,
            username: message.username,
            botShouldAnswer: nextMessage?.isAI ?? false,
        };
        writeSync(f, JSON.stringify(structuredMessage) + "\n");
    }

    closeSync(f);
}

main();