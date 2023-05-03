import { Client, Collection, Events, Interaction, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";

interface Command {
    slashCommand: RESTPostAPIChatInputApplicationCommandsJSONBody;
    execute: (interaction: Interaction) => Promise<void>;
}

export async function registerSlashCommands(discord: Client, commands: Command[]) {
    const jsonCommands = commands.map(c => c.slashCommand);
    const executionMap = new Collection<string, Command>();
    commands.forEach(c => {
        executionMap.set(c.slashCommand.name, c);
    });

    discord.on(Events.InteractionCreate, async interaction => {
        if(!interaction.isChatInputCommand()) return;

        const command = executionMap.get(interaction.commandName);

        if(command) {
            try {
                await command.execute(interaction);
            } catch(err) {
                console.error(err);
            }
        }
    });
    
    const rest = discord.rest;

    try {
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID ?? ''),
            { body: jsonCommands, }
        );
    } catch(err) {
        console.error(err);
    }

}