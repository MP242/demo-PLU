'use client'

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
}

const PaginationRDV = ({ }: PaginationProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [date, setDate] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(searchParams?.toString());
        const date = params.get("date");
        if (date) {
            setDate(date);
        }
    }, [searchParams]);

    function handleChange(nbr: number) {
        const params = new URLSearchParams(searchParams?.toString());
        const date = params.get("date");
        if (date) {
            const [year, month, day] = date.split("-");
            const newDate = new Date(+year, +month - 1, +day + nbr);
            const newDay = newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate();
            const newMonth = newDate.getMonth() + 1 < 10 ? `0${newDate.getMonth() + 1}` : newDate.getMonth() + 1;
            const newYear = newDate.getFullYear();
            params.set("date", `${newYear}-${newMonth}-${newDay}`);
            setDate(`${newYear}-${newMonth}-${newDay}`);
            router.replace(`?${params.toString()}`);
        }

    }

    return (
        <div className="my-2 space-x-4 join">
            <button
                onClick={() => handleChange(-1)}
                className="btn join-item disabled:opacity-50 rounded-lg disabled:text-black w-32"
            >
                Précédent
            </button>
            <input
                onChange={(e) => {
                    const params = new URLSearchParams(searchParams?.toString());
                    params.set("date", e.target.value);
                    router.replace(`?${params.toString()}`);
                }}
                value={date ?? ''} className="input input-md w-36 text-center" type="date" />
            <button
                onClick={() => handleChange(1)}
                className="btn join-item disabled:opacity-50 disabled:text-black rounded-lg w-32"
            >
                Suivant
            </button>
        </div>
    )
}

export default PaginationRDV;
