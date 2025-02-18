'use server'

import { openai } from './Openai';
import fs from 'fs';

export async function AudioToText(filePath: string) {
    return await new Promise(async (resolve, reject) => {
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: "whisper-1",
        });
        resolve(transcription);
    });
}

