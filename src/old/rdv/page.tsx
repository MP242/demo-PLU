'use client'

import TableRDV from "./TableRDV"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getProspects } from "@/action/ManageProspect"
import PaginationRDV from "./PaginationRDV"

interface BodyItem {
    _id: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    zipCode: string;
    district: string;
    phone1: string;
    phone2: string;
    calling: number;
    calls: string[];
    rdv: Array<{ date: string, statut: string }>;
}

export default function rdvPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [prospectsRDV, setProspectsRdv] = useState(null);
    const [date, setDate] = useState<string | null>(null);

    useEffect(() => {
        async function fecthRDV() {
            const date = searchParams?.get("date");
            if (date) {
                const Prospects = await getProspects();
                const data = Prospects.filter((prospect: BodyItem) => prospect.rdv.find((rdv) => rdv.date.split(" ")[0] === date));
                setProspectsRdv(data);
                setDate(date);
            } else {
                const params = new URLSearchParams(searchParams?.toString());
                const today = new Date();
                const day = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
                const month = today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1;
                const year = today.getFullYear();
                const date = `${year}-${month}-${day}`;
                params.set("date", date);
                router.replace(`?${params.toString()}`);
            }
        }
        fecthRDV();
    }, [])

    useEffect(() => {
        async function fecthRDV() {
            const date = searchParams?.get("date");
            if (date) {
                const Prospects = await getProspects();
                const data = Prospects.filter((prospect: BodyItem) => prospect.rdv.find((rdv) => rdv.date.split(" ")[0] === date));
                setProspectsRdv(data);
                setDate(date);
            }
        }
        fecthRDV();
    }, [searchParams])

    return (
        <div className="flex flex-col w-full p-5">
            <h1 className="text-2xl font-bold pb-5 self-center">Rendez-vous du {date ? date : "..."}</h1>
            <TableRDV prospectsRDV={prospectsRDV} />
            <div className="self-center">
                <PaginationRDV />
            </div>
        </div>
    )
}

