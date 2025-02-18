'use client'

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { getAdvisors } from "@/action/ManageAdvisors";

interface FormCallsRDVProps {
    Submit: (data: any) => void;
    erpReference?: String,
    context?: String
}

const FormCallsRDV = ({ Submit, erpReference, context }: FormCallsRDVProps) => {
    const { data: session } = useSession();
    const { register, handleSubmit, reset, setValue } = useForm();
    const [advisors, setAdvisors] = useState<any[]>([]);
    const [isFetchingAdvisors, setFetchAdvisors] = useState<boolean|undefined>(false);

    useEffect(() => {
        const date = new Date();
        const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
        const year = date.getFullYear();
        const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
        const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

        setValue(`date`, `${year}-${month}-${day}`);
        setValue(`time`, `${hour}:${minute}`);
    }, []);

    useEffect(()=>{

        const fetchAdvisors = async ()=>{
            setFetchAdvisors(true);
            const advisors = await getAdvisors(erpReference);
            setAdvisors(advisors);
            setFetchAdvisors(false);
        }

        fetchAdvisors();
    },[]);

    const OnhandleSubmit = (data: any) => {
        data.idUser = session?.user?.id;
        Submit(data);
        reset();
    }

    return (
        <form onSubmit={handleSubmit(OnhandleSubmit)} className="flex flex-col space-y-2 p-2">
            <div className="flex justify-center items-center space-x-3 p-2">
                <input
                    data-cy="date"
                    {...register(`date`, { required: true })}
                    type="date" className="input border-2 input-bordered input-sm w-full max-w-xs" />
                <span>:</span>
                <input
                    data-cy="time"
                    {...register(`time`, { required: true })}
                    type="time" className="input border-2 input-bordered input-sm w-full max-w-xs" />
            </div>
            {context === "RDV" && <div className="form-control w-full p-2">
                <label className="label">
                    <span className="label-text text-neutral text-sm font-bold">Conseiller</span>
                </label>
                <select className="select select-sm select-bordered border-2 w-full" {...register('idAdvisor')} disabled={isFetchingAdvisors}>
                    <option value="" >Sans Conseiller</option>
                    {advisors.map((advisor,index) => (<option key={index} value={advisor.id}>{advisor.firstName} {advisor.lastName}</option>))}
                </select>
            </div>}
            <button
                data-cy="submit"
                type="submit" className="btn text-sm btn-md min-w-[147px] self-center btn-primary">Ajouter</button>
        </form>
    )
}

export default FormCallsRDV;
