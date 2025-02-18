'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'


interface ITabProps {
    NbrCall?: number;
    NrbRdv?: number;
}

const Tab = ({ NbrCall, NrbRdv }: ITabProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();


    function handlerFilter(tab: string) {
        const params = new URLSearchParams(searchParams?.toString());
        params.set("conf", tab);
        router.replace(`?${params.toString()}`)
    }

    return (
        <div
            data-cy="tabComponent"
            className="tabs space-x-5">
            <a
                key="Calls"
                data-cy="Calls"
                className={`tab tab-xl tab-bordered text-lg ${searchParams?.get("conf") === "Calls" ? "tab-active font-bold text-primary" : ""}`}
                onClick={() => handlerFilter("Calls")}>{"Calls"}
                {NbrCall !== 0 &&
                    <div className="rounded-full bg-primary w-6 h-6 text-base-100 text-sm flex items-center justify-center font-semibold ml-2">{NbrCall}</div>
                }
            </a>
            <a
                key="Information"
                data-cy="Information"
                className={`tab tab-xl tab-bordered text-lg ${searchParams?.get("conf") === "Information" ? "tab-active font-bold text-primary" : ""}`}
                onClick={() => handlerFilter("Information")}>{"Information"}
            </a>
            <a
                key="RDV"
                data-cy="RDV"
                className={`tab tab-xl tab-bordered text-lg ${searchParams?.get("conf") === "RDV" ? "tab-active font-bold text-primary" : ""}`}
                onClick={() => handlerFilter("RDV")}>{"RDV"}
                {NrbRdv !== 0 &&
                    <div className="rounded-full bg-primary w-6 h-6 text-base-100 text-sm flex items-center justify-center font-semibold ml-2">{NrbRdv}</div>
                }
            </a>
            <a
                key="Analyse"
                data-cy="Analyse"
                className={`tab tab-xl tab-bordered text-lg ${searchParams?.get("conf") === "Analyse" ? "tab-active font-bold text-primary" : ""}`}
                onClick={() => handlerFilter("Analyse")}>{"Analyse"}
            </a>
        </div>
    )
}

export default Tab
