import { Message } from "discord.js";
import bogazicitv from "./bogazicitv/bogazicitv";
import Greetings from "./greetings/greetings";
import Karacasoft from "./karacasoft/karacasoft";

const protocolCategories = [
    Greetings,
    Karacasoft,
    bogazicitv,
];

const keyword = "KaracaBot ";

export function processMessage(msg: Message) {
    const text = msg.content;
    if(text.startsWith(keyword)) {

        for(const protId in protocolCategories) {
            const prot = protocolCategories[protId];
            if(prot.filter(msg)) {
                prot.action(msg);
                break;
            }
        }
    }
}