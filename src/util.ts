import { Client } from "discord.js";

export function textContains(text: string, needle: string) {
    return text.indexOf(needle) !== -1;
}

export function textCaseInsensitiveContains(text: string, needle: string) {
    return text.toLocaleLowerCase("tr").indexOf(needle.toLocaleLowerCase("tr")) !== -1;
}

export function containsAnyOf(text: string, arrayOfKeywords: string[]): boolean {
    return arrayOfKeywords
            .map(keyword => textCaseInsensitiveContains(text, keyword))
            .reduce((prev, curr) => prev || curr, false);
}

export function containsAll(text: string, arrayOfKeywords: string[]): boolean {
    return arrayOfKeywords
            .map(keyword => textCaseInsensitiveContains(text, keyword))
            .reduce((prev, curr) => prev && curr, true);
}

export function workdaysDiff(startDate: Date, endDate: Date) {
    let workingdays = 0;
    while (startDate <= endDate) 
    {
        let day = startDate.getDay();
        if(day != 0 && day != 6) 
        {
            workingdays++; 
        }
        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1); 
    }
    return workingdays;
}

export function sleep(ms: number) {
    return new Promise<void>((res, _) => {
        setTimeout(() => res(), ms);
    })
}

export function findKaracaSoft(client: Client) {
    return client.users.resolve("205073309325328384");
}

export function pickOneFrom<T>(list: T[]) {
    return list[Math.floor(Math.random() * list.length)];
}