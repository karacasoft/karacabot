import * as Discord from "discord.js";
import { processMessage } from './protocol';

const client = new Discord.Client();

client.on("ready", () => {
    console.log(`${client.user?.tag} göreve hazır!`);
    client.user?.setPresence({
        status: "online",
        activity: {
            name: "Merhaba, evrenin karbon çocukları",
            type: "PLAYING",
        }
    })
    .then(console.log)
    .catch(console.error);
    
});

client.on("message", msg => {
    processMessage(msg);
});

client.login(process.env["CLIENT_TOKEN"]);
