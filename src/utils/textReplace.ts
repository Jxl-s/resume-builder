import { v4 as uuidv4 } from "uuid";

// Replaces text in a string with another text
export function textReplace(str: string, replacing: string[][]) {
    let newStr = str;

    // To prevent injection, generate a random UUID for each
    const uuids = replacing.map(() => uuidv4());
    const originals = replacing.map((r) => r[0]);
    const news = replacing.map((r) => r[1]);

    // 1. Replace the original text with the UUID
    for (let i = 0; i < originals.length; i++) {
        newStr = newStr.replace(originals[i], uuids[i]);
    }

    // 2. Replace the UUID with the new text
    for (let i = 0; i < news.length; i++) {
        newStr = newStr.replace(uuids[i], news[i]);
    }

    return newStr;
}
