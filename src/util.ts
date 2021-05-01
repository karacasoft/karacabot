export function textContains(text: string, needle: string) {
    return text.indexOf(needle) !== -1;
}

export function textCaseInsensitiveContains(text: string, needle: string) {
    return text.toLocaleLowerCase("tr").indexOf(needle.toLocaleLowerCase("tr")) !== -1;
}

export function keywords(text: string, arrayOfKeywords: string[], func: () => void) {
    
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