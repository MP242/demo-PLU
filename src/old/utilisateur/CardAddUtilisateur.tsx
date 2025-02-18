'use client'

import { useForm } from "react-hook-form"
import { getUserbyEmail, createUsers } from "@/action/ManageUsers";
import { generateRandomCharacters } from "@/lib/GenerateLink";
import { sendMail } from "@/action/SendMail";

interface CardAddUtilisateurProps {
}

const CardAddUtilisateur = ({ }: CardAddUtilisateurProps) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    async function onSubmit(data: any) {
        const exist = await getUserbyEmail(data.email);
        if (exist) {
            return alert("Cet utilisateur existe déjà");
        }
        data.link = generateRandomCharacters(50);
        await sendMail(data.email, data.link, data.role);
        await createUsers({
            email: data?.email,
            role: data?.role,
            link: data?.link,
            password: "waiting"
        });
        reset();
    }

    return (
        <div className="card bg-primary text-white p-5">
            <p className="text-lg font-semibold">Ajouter un utilisateur</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <label htmlFor="email" className="text-sm">Email</label>
                    <input
                        className="input input-sm text-black"
                        type="email"
                        id="email"
                        {...register("email", { required: true })}
                    />
                    {errors.email && <span className="text-red-500">Ce champ est requis</span>}
                </div>
                <div className="flex flex-col space-y-2">
                    <label htmlFor="role" className="text-sm">Rôle</label>
                    <select
                        className="input input-sm text-black"
                        id="role"
                        {...register("role", { required: true })}
                    >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                    {errors.role && <span className="text-red-500">Ce champ est requis</span>}
                </div>
                <div className="card-actions justify-end">
                    <button type="submit" className="btn btn-sm" >Ajouter</button>
                </div>
            </form>
        </div>
    )
}

export default CardAddUtilisateur
