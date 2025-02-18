'use server'

import { createProspect, deleteProspect, getProspects, getProspectsWithPagination, getProspectsbyCity } from "@/action/ManageProspect";
import { ProspectsItem } from "@/type";
import ManagePage from "./ManagePage";



const header = [
    {
        title: "Nom",
        sort: true,
        value: "lastName"
    },
    {
        title: "Prénom",
        sort: true,
        value: "firstName"
    },
    {
        title: "Adresse",
        sort: true,
        value: "address"
    },
    {
        title: "Téléphones",
        sort: false,
        value: ""
    },
    {
        title: "Calling",
        sort: true,
        value: "calling"
    },
    {
        title: "Last Call",
        sort: false,
        value: "calls"
    }
];


export default async function ProspectsPage() {
    // let {data, totalPage} : {data: ProspectsItem[], totalPage: number} = await getProspectsWithPagination();
    return (
        <div className="p-5 w-full flex flex-col overflow-auto space-y-5">
            {/* {data && */}
                <ManagePage Header={header} />
                {/* <ManagePage totalPage={totalPage} Prospects={data} Header={header} /> */}
            {/* } */}
        </div>
    );
}

