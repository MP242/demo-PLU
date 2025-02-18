'use server'

import fs from 'fs';

export async function downloadFileAudio(base64String: string, name: string) {
    try {
        const buffer = Buffer.from(base64String, 'base64');
        const filePath = `./public/voice/${name}`;
        fs.writeFileSync(filePath, buffer);
    } catch (error) {
        console.error('Error writing file:', error);
    }
}

export async function removeFile(pathFile: string) {
    fs.unlink(pathFile, (err) => {
        if (err) {
            console.error(`Error deleting file: ${err}`);
        } else {
            console.log('File deleted successfully');
        }
    });
}

