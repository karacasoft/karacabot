import { Message, MessageEmbed } from 'discord.js';
import { containsAll, containsAnyOf, findKaracaSoft, pickOneFrom, textCaseInsensitiveContains } from '../util';

function greetingsFilter(msg: Message) {
    return true;
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

const musicSuggestionList = [
    "https://open.spotify.com/track/20lE8ClzeICQq60RuEoqoJ?si=85cbbbea9b67496e",
    //"https://open.spotify.com/track/7KcF1F3B5hKi8I3ZEq187g?si=0ba8d0078803472b",
    "https://open.spotify.com/track/1iNeZGJsoC0D7ZyJTdIbDS?si=61f0ea00e95b4864",
    "https://open.spotify.com/track/5Tiwx9djuj5N4pB0cK3NGx?si=e1186e859bdd4c76",
    "https://open.spotify.com/track/5ZmP9MIok5ZJESp5sKgMTO?si=3027003a49f14d59",
    "https://open.spotify.com/track/1fZvEmAmWtsDSUjAgDhddU?si=c2a0d1a8b32843b5",
    "https://open.spotify.com/track/1pKYYY0dkg23sQQXi0Q5zN?si=c983ee20ecdf44ba",
    "https://open.spotify.com/track/7LL40F6YdZgeiQ6en1c7Lk?si=79e9d1c7d3864cf4",
    "https://www.youtube.com/watch?v=9gMX_hR-RoM",
    "https://open.spotify.com/track/7FuyeSPssuLmWG4fNNTiNa?si=771cde6f06e44fcd",


]

function greetingsAction(msg: Message) {
    if(containsAnyOf(msg.content, ["nasılsın"])) {
        const response = nasilsinResponses[Math.floor(Math.random() * nasilsinResponses.length)];
        msg.reply(response);
    } else if(containsAnyOf(msg.content, ["merhaba", "selam"])) {
        const response = greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
        msg.reply(response);
    } else if(containsAll(msg.content, [ "seni", "kim" ]) &&
            containsAnyOf(msg.content, [ "yazdı", "yaptı", "yarattı", "oluşturdu", "üretti", "meydana getirdi", "dünyaya getirdi" ])) {
        const karacasoft = findKaracaSoft(msg.client);
        if(msg.member?.id === karacasoft?.id) {
            const thinkingEmoji = msg.guild?.emojis.resolve("840003429731401799");
            msg.reply(`Sen yazdın? Değil mi? :thinking:`);
        } else {
            msg.reply(`Beni ${karacasoft?.toString()} yaptı. ^^`);
        }
    } else if(containsAnyOf(msg.content, [ "müzik", "müziğ" ]) && containsAnyOf(msg.content, [ "öner", "sevdiğin" ])) {
        if(containsAnyOf(msg.content, [ "en sevdiğin" ])) {
            msg.reply("https://open.spotify.com/track/20lE8ClzeICQq60RuEoqoJ?si=85cbbbea9b67496e");
        } else {
            msg.reply(pickOneFrom(musicSuggestionList));
        }
    }
}

export default {
    filter: greetingsFilter,
    action: greetingsAction,
}
