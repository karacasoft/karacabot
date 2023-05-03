export interface KaracaBotMessage {
    guildId: number;
    channelId: string;
    username: string;
    textContent: string;
    isAI: boolean;
    isSystemMessage?: boolean;
    shouldAnswer: boolean;
    discordMessageId: string;
}

export class KaracaBotContext {
    messages: KaracaBotMessage[] = [];
    contextId: number = -1;
}