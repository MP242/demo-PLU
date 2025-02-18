"use client"

import { getUserbyLink } from "@/action/ManageUsers";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from 'react-hook-form'
import { updatePassword } from "@/action/ManageUsers";

interface UsersItem {
    _id: string;
    email: string;
    password: string;
    role: string;
    link: string;
    createdAt: Date;
}

export default function ConfirmationPage() {
    const { register, handleSubmit } = useForm();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<UsersItem | null>(null);
    const [isWaiting, setIsWaiting] = useState<boolean>(true);

    useEffect(() => {
        async function checkUser() {
            const params = new URLSearchParams(searchParams?.toString());
            const link = params.get("link");
            const user = await getUserbyLink(link);
            if (!user) {
                return router.push("/auth/signin");
            }
            const now = Date.now();
            const createdAt = new Date(user.createdAt).getTime();
            const diff = createdAt - now;
            if (diff < 0) {
                return router.push("/auth/signin");
            }
            setIsWaiting(false);
            setUser(user);
        }
        checkUser();
    }, [searchParams]);

    if (isWaiting) {
        return (
            <main>
                <h1>Waiting for confirmation</h1>
            </main>
        )
    }

    async function onSubmit(data: any) {
        if (data.password !== data.confirmation) {
            return;
        }
        await updatePassword(user?._id, data.password);
        router.push("/auth/signin");
    }

    return (
        <div className="hero min-h-screen bg-base-200 flex flex-col justify-center">
            <h1 className="text-xl font-bold text-black">Confirmer votre mot de passe</h1>
            <div className="hero-content flex-row-reverse">
                <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Mot de passe</span>
                            </label>
                            <input
                                data-cy="password"
                                {...register('password', { required: true })}
                                type="password" placeholder="password" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">confirmation</span>
                            </label>
                            <input
                                data-cy="confirmation"
                                {...register('confirmation', { required: true })}
                                type="password" placeholder="password" className="input input-bordered" required />
                        </div>
                        <div className="form-control mt-6">
                            <button
                                data-cy="submitLogin"
                                type="submit"
                                className="btn btn-primary">Valider</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
