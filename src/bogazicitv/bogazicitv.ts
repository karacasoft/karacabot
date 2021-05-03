import { Message } from "discord.js";
import { containsAll } from "../util";


function bogaziciTVFilter(msg: Message) {
    if(msg.guild?.id === "808639581703503872") {
        return true;
    }
    return true;
}

function bogaziciTVAction(msg: Message) {
    if(containsAll(msg.content, [ "nöbet", "kaçıncı", "gün" ])) {
        const oneDay = 24 * 60 * 60 * 1000;
        const today = new Date();
        const nobetBaslama = new Date(2021, 0, 4);
        const diffDays = Math.round(Math.abs((today.getTime() - nobetBaslama.getTime()) / oneDay));
        msg.reply(`Bugün nöbetin ${diffDays}. günü ^^`);
    }
}

export default {
    filter: bogaziciTVFilter,
    action: bogaziciTVAction,
};