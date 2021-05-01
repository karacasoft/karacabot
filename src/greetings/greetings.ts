import { Message } from 'discord.js';
import { containsAnyOf, textCaseInsensitiveContains } from '../util';

function greetingsFilter(msg: Message) {
    if(containsAnyOf(msg.content, ["merhaba", "selam", "nasılsın"])) {
        return true;
    }
    return false;
}

const greetingResponses = [
    "Merhaba ^^",
    "Selam ^^",
    "Merhabalar",
    "Selamlar",
];

const nasilsinResponses = [
    "İyiyim siz nasılsınız?",
    "İyilik, teşekkür ediyorum. Sizler nasılsınız?",
]

function greetingsAction(msg: Message) {
    if(containsAnyOf(msg.content, ["nasılsın"])) {
        const response = nasilsinResponses[Math.floor(Math.random() * nasilsinResponses.length)];
        msg.reply(response);
    } else if(containsAnyOf(msg.content, ["merhaba", "selam"])) {
        const response = greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
        msg.reply(response);
    }
}

export default {
    filter: greetingsFilter,
    action: greetingsAction,
}
