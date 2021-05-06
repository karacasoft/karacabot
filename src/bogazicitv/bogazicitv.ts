import { Message } from "discord.js";
import { containsAll, findKaracaSoft, sleep, workdaysDiff } from "../util";


function bogaziciTVFilter(msg: Message) {
    console.log(msg.guild?.id);
    if(msg.guild?.id === "808639581703503872") {
        return true;
    }
    return false;
}

function bogaziciTVAction(msg: Message) {
    if(containsAll(msg.content, [ "nöbet", "kaçıncı", "gün" ]) || containsAll(msg.content, [ "direniş", "kaçıncı", "gün" ])) {
        const oneDay = 24 * 60 * 60 * 1000;
        const today = new Date(new Date().getTime() + (3 * 60 * 60 * 1000)); // convert to GMT+3 (add 3 hours)
        const nobetBaslama = new Date(2021, 0, 4);
        const diffDays = Math.round(Math.abs((today.getTime() - nobetBaslama.getTime()) / oneDay));
        
        const nobetDays = workdaysDiff(nobetBaslama, today) - 1;

        (async () => {
            await msg.reply(`Bugün direnişin ${diffDays}, nöbetin ${nobetDays}. günü. ^^`);
            if(Math.random() < 0.05) {
                msg.channel.startTyping();
                await sleep(2000);
                await msg.channel.stopTyping();
                const karacasoft = findKaracaSoft(msg.client);
                if(karacasoft) {
                    await msg.channel.send(`Nöbet günlerini yanlış saymış olabilirim. Yanlış olduğunu düşünürseniz lütfen ${karacasoft.toString()}'u bilgilendirin.`);
                }
            }
        })();
        
    }
}

export default {
    filter: bogaziciTVFilter,
    action: bogaziciTVAction,
};