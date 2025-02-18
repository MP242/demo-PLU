'use server'

import { Error as MongooseError } from 'mongoose';
import connect from '@/database/Mongoose';
import Users from '@/models/modelUsers';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';
import { UsersItem, UsersItemADD } from '@/type';

connect();

export async function getUsers() {
    const data = await Users.find();
    return JSON.parse(JSON.stringify(data));
}

export async function getUser(value: any) {
    const data = await Users.findOne(value);
    return JSON.parse(JSON.stringify(data));
}

export async function getUserbyEmail(email: string): Promise<UsersItem> {
    return await getUser({email: email });
}

export async function getUserbyLink(link: string | null): Promise<UsersItem> {
    return await getUser({link: link });
}

export async function getUserbyId(id: string | null): Promise<UsersItem> {
    const users = await Users.findById(id);
    return JSON.parse(JSON.stringify(users));
}

export async function createUsers(data: UsersItemADD) {
    try {
        const prospect = new Users(data);
        await prospect.save();
        revalidatePath("/");
        revalidatePath("/utilisateur");
    } catch (error: any) {
        const errorMessage = (error as MongooseError)?.message || "An error occurred while creating the prospect.";
        return JSON.stringify(errorMessage);
    }
}

export async function deleteUser(id: string) {
    await Users.findByIdAndDelete(id);
}

export async function LoginUsers(credientials: { email: string; password: string }) {
    const user = await Users.findOne({ email: credientials.email });
    if (user) {
        const res = await user.comparePassword(credientials.password);
        if (res) {
            return user;
        } else {
            return "Wrong password";
        }
    } else {
        return "User not found";
    }
}

export async function updatePassword(id: string | undefined, password: string) {
    const User = await Users.findById(id);
    if (!User) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    const Newpassword = await bcrypt.hash(password, salt);
    User.password = Newpassword;
    User.createdAt = Date.now();
    await User.save();
    revalidatePath("/");
}

export async function updateUsers(id: string | undefined, data: UsersItem) {
    await Users.findByIdAndUpdate(id, data);
    revalidatePath("/");
}
