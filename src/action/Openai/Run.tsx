'use server'

import { openai } from "./Openai";

export async function createRun(thread: string, assistant: string) {
    return await new Promise(async (resolve, reject) => {
        const run = await openai.beta.threads.runs.create(
            thread,
            { assistant_id: assistant }
        );
        resolve(run);
    });
}

export async function listRuns(thread: string) {
    const runs = await openai.beta.threads.runs.list(
        thread,
        { order: "asc", limit: 20 },
    );
    return runs;
}
export async function retrieveRun(thread: string, runid: string) {
    const run = await openai.beta.threads.runs.retrieve(
        thread,
        runid,
    );
    return run;
}

export async function waitRun(thread: string, runid: string) {
    return await new Promise(async (resolve, reject) => {
        let run: any = await retrieveRun(thread, runid);
        while (run.status === "in_progress") {
            run = await retrieveRun(thread, runid);
        }
        resolve(run);
    });
}
