'use client'

import AlertError from '@/components/AlertError';
import { useForm } from 'react-hook-form'
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation'

export default function SignIn() {
    const router = useRouter();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        try {
            const res = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });
            if (!res?.ok) {
                reset();
            } else {
                router.push("/prospects");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="hero bg-base-200 self-center h-full">
            <div className="hero-content w-full">
                <div className="card flex-shrink-0 shadow-2xl bg-base-100 w-6/12">
                    <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                data-cy="email"
                                {...register('email', { required: true })}
                                type="email" placeholder="email" className="input input-bordered" />
                                {errors.email && <p className="text-red-500 pt-2 test-sm">L'email est obligatoire</p>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                data-cy="password"
                                {...register('password', { required: true })}
                                type="password" placeholder="password" className="input input-bordered" />
                                {errors.password && <p className="text-red-500 pt-2 test-sm">Le mot de passe est obligatoire</p>}
                        </div>
                        <div className="form-control mt-6">
                            <button
                                data-cy="submitLogin"
                                type="submit"
                                className="btn btn-primary">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

