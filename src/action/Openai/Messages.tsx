'use server'

import { openai } from "./Openai";

export async function createMessage(thread: string, message: string) {
    return await new Promise(async (resolve, reject) => {
        const myMessage = await openai.beta.threads.messages.create(
            thread,
            { role: "user", content: message },
        );
        resolve(myMessage);
    });
}

export async function listMessages(thread: string) {
    const res = await new Promise(async (resolve, reject) => {
        const threadMessages = await openai.beta.threads.messages.list(
            thread,
            { order: "desc", limit: 20 },
        );
        resolve(threadMessages);
    });
    return JSON.parse(JSON.stringify(res));
}

export async function retrieveMessage(thread: string, messageid: string) {
    const message = await openai.beta.threads.messages.retrieve(
        thread,
        messageid,
    );
    return message;
}


