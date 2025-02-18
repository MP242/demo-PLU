'use server'

import { openai } from "./Openai";

export async function createThread() {
    return await new Promise(async (resolve, reject) => {
        const emptyThread = await openai.beta.threads.create();
        resolve(emptyThread);
    });
}

export async function retrieveThread(thread: string) {
    const threadMessages = await openai.beta.threads.retrieve(thread);
    return threadMessages;
}

export async function deletethread(thread: string) {
    const threadMessages = await openai.beta.threads.del(thread);
    return threadMessages;
}
