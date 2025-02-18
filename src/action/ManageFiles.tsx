'use server'

import { Error as MongooseError } from 'mongoose';
import connect from '@/database/Mongoose';
import Files from "@/models/modelFiles";
import { FilesItemADD } from '@/type';

connect();

export async function getFiles() {
    const data = await Files.find();
    return JSON.parse(JSON.stringify(data));
}

export async function createFiles(data: FilesItemADD) {
    try {
        const file = await Files.findOne({ name: data.name });
        if (file) {
            await Files.updateOne({ name: data.name }, { date: data.date, success: data.success, error: data.error });
            return;
        }
        const files = new Files(data);
        await files.save();
    } catch (error: any) {
        const errorMessage = (error as MongooseError)?.message || "An error occurred while creating the files.";
        return JSON.stringify(errorMessage);
    }
}

