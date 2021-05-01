import { Message } from "discord.js";
import { containsAll } from "../util";

function karacasoftFilter(msg: Message): boolean {
    if(msg.guild?.name === "KaracaSoft") {
        return true;
    }
    return false;
}

function karacasoftAction(msg: Message) {
    if(containsAll(msg.content, ["yayın", "duyuru", "yap"])) {
        console.log(msg.guild?.channels);
    }
}

export default {
    filter: karacasoftFilter,
    action: karacasoftAction,
}