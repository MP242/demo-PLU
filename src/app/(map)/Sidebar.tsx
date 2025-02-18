'use client'

import Link from "next/link";
import BrowserLocalisation from "@/components/BrowserLocalisation";

interface SideBarProps {
}

const SideBar = ({ }: SideBarProps) => {

    return (
        <div className="flex flex-col justify-between w-1/6 bg-primary p-5">
            <div>
                <BrowserLocalisation label/>
            </div>
            <Link href="/prospects" className="btn btn-ghost text-white">
                Retour
            </Link>
    </div >
    )
}

export default SideBar;
