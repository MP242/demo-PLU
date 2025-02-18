'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

interface ITabProps {
}

const Tab = ({ }: ITabProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    function handlerFilter(tab: string) {
        const params = new URLSearchParams(searchParams?.toString())
        params.set("conf", tab)
        router.push(pathname + "?" + params.toString())
    }

    return (
        <div
            data-cy="tabComponent"
            className="tabs space-x-5 ">
            <a
                key="AddUtilisateur"
                data-cy="Information"
                className={`tab tab-xl text-xl tab-bordered ${searchParams?.get("conf") === "AddUtilisateur" ? "tab-active" : ""}`}
                onClick={() => handlerFilter("AddUtilisateur")}>{"Ajouter Utilisateur"}</a>
            <a
                key="users"
                data-cy="users"
                className={`tab tab-xl text-xl tab-bordered ${searchParams?.get("conf") === "users" ? "tab-active" : ""}`}
                onClick={() => handlerFilter("users")}>{"Liste Utilisateur"}
            </a>
        </div>
    )
}

export default Tab
