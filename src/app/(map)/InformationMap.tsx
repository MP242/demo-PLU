'use client'

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProspects } from "@/action/ManageProspect";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link"
import { ProspectsItem } from "@/type";

interface InformationMapProps {
}

const InformationMap = ({ }: InformationMapProps) => {
    const searchParams = useSearchParams();
    const [prospects, setProspects] = useState<ProspectsItem[] | null>(null);

    useEffect(() => {
        async function fetchGeo() {
            var prospects: ProspectsItem[] = await getProspects();
            const codeIris = searchParams?.get("iris");
            prospects = prospects.filter((prospect) => prospect.iris === codeIris)
            setProspects(prospects)
        }
        fetchGeo()
    }, [searchParams])
    return (
        <div className="flex flex-col justify-between">
            <Link href={{ pathname: "/map", query: { drawer: "false" } }} className="pb-10">
                <IoMdArrowRoundBack color="white" size={40} className="hover:bg-primary-focus rounded" />
            </Link>
            <div className="space-y-5">
                {prospects &&
                    prospects.map((prospect) => (
                        <div key={prospect._id} className="card bg-white p-5">
                                {prospect.lastName}
                                <br />
                                {prospect.firstName}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default InformationMap;
