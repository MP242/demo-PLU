'use client'

import { useState, useEffect } from "react";
import { getUsers, updateUsers } from "@/action/ManageUsers";
import MySelect from "@/components/Select";
import { generateRandomCharacters } from "@/lib/GenerateLink";
import { sendMail } from "@/action/SendMail";
import { UsersItem } from "@/type";

interface CardUsersProps {
}

const CardUsers = ({ }: CardUsersProps) => {
    const [users, setUsers] = useState<UsersItem[]>([]);

    useEffect(() => {
        async function fetchUsers() {
            const data = await getUsers();
            setUsers(data);
        }
        fetchUsers();
    }, []);

    async function handleRecoveyPassword(User: UsersItem) {
        User.link = generateRandomCharacters(50);
        User.createdAt = new Date(Date.now() + 30 * 60 * 1000);
        await sendMail(User.email, User.link, User.role);
        await updateUsers(User._id, User);
    }

    async function handleSelect(value: string, index: number) {
        const user = users[index];
        user.role = value;
        await updateUsers(user._id, user);
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {users?.map((user, index) => (
                <div key={user._id} className="card shadow-2xl bg-primary text-white p-5 space-y-4">
                    <p className="text-lg font-semibold">{user.email}</p>
                    <p className="text-sm">
                        <span className="pr-2 font-bold">Role :</span>
                        <MySelect
                            size="sm"
                            Description="Role"
                            DefaultValue={user.role}
                            options={["Operator", "admin"]}
                            onChange={(value: string) => handleSelect(value, index)}
                        />
                    </p>
                    <div className="card-actions justify-end">
                        <button
                            onClick={() => handleRecoveyPassword(user)}
                            className="btn btn-sm">Reset</button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CardUsers
