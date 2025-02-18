'use client'

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Tab from "./Tab";
import TabCalls from "./TabCalls";
import TabInformation from "./TabInformation";
import TabRDV from "./TabRDV";
import { ProspectsItem } from "@/type";
import TabAnalyse from "./TabAnalyse";


interface DrawerProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    prospect: ProspectsItem | null;
}

const Drawer = ({ isOpen, setIsOpen, prospect }: DrawerProps) => {
    const searchParams = useSearchParams();
    const [tab, setTab] = useState<string>("");

    useEffect(() => {
        setTab(searchParams?.get("conf") || "");
    }, [searchParams?.get("conf")]);

    return (
        <main
            key={prospect?._id}
            className={
                " fixed overflow-hidden z-10 bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out " +
                (isOpen
                    ? " transition-opacity opacity-100 duration-500 translate-x-0  "
                    : " transition-all delay-500 opacity-0 translate-x-full  ")
            }
        >
            <section
                className={
                    " w-screen right-0 absolute bg-white h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform  " +
                    (isOpen ? " translate-x-0 " : " translate-x-full ") +
                    (searchParams?.get("conf") === "Analyse" ? "max-w-4xl" : "max-w-xl")
                }>
                <article
                    data-cy="drawerComponent"
                    className={"relative w-screen flex flex-col space-y-6 h-full justify-start pb-16 " + (searchParams?.get("conf") === "Analyse" ? "max-w-4xl" : "max-w-xl")}>
                    <div className="p-2 self-center">
                        <Tab NbrCall={prospect?.calling} NrbRdv={prospect?.rdv?.length} />
                    </div>
                    {tab === "Calls" &&
                        <TabCalls prospect={prospect} />
                    }
                    {tab === "Information" &&
                        <TabInformation prospect={prospect} />
                    }
                    {tab === "RDV" &&
                        <TabRDV prospect={prospect} />
                    }
                    {tab === "Analyse" &&
                        <TabAnalyse prospect={prospect} />
                    }
                </article>
            </section>
            <section
                className="w-screen h-full cursor-pointer"
                onClick={() => {
                    setIsOpen(false);
                }}
            ></section>
        </main>
    )
}

export default Drawer
