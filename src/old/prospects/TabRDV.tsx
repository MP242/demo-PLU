'use client'

import FormCallsRDV from "./FormCallsRDV";
import { pushRDVToErp, updateProspectRDV } from "@/action/ManageProspect";
import { useEffect, useState } from "react";
import { ProspectsItem } from "@/type";
import { PiUserCircleBold, PiCalendarBold, PiClockBold } from "react-icons/pi";
import AlertComponent from "./AlertComponent";
import { useRefreshStore } from "@/stores/refreshStore";



interface TabRDVProps {
    prospect: ProspectsItem | null;
}

const TabRDV = ({ prospect }: TabRDVProps) => {
    const [rdv, setRDV] = useState<Array<{ date: string, status: string }>>([]);
    const { setRefresh } = useRefreshStore();


    useEffect(() => {
        const sortRDV = prospect?.rdv?.toSorted((a : any, b: any) => {
            const [datePartA, timePartA] = a.date.split(" ");
            const [dayA, monthA, yearA] = datePartA.split("-");
            const [hourA, minuteA] = timePartA.split(":");

            const [datePartB, timePartB] = b.date.split(" ");
            const [dayB, monthB, yearB] = datePartB.split("-");
            const [hourB, minuteB] = timePartB.split(":");

            const dateA = new Date(Number(yearA), Number(monthA) - 1, Number(dayA), Number(hourA), Number(minuteA));
            const dateB = new Date(Number(yearB), Number(monthB) - 1, Number(dayB), Number(hourB), Number(minuteB));

            return dateB.getTime() - dateA.getTime();
        });
        setRDV(sortRDV ? sortRDV : []);
    }, [prospect]);

    async function handleAjouter(data: any) {
        setRefresh(new Date().getTime());
        data.status = "";
        const phones = [prospect?.phone1, prospect?.phone2, prospect?.mobile1, prospect?.mobile2];
        await updateProspectRDV(prospect?._id, data);
        await pushRDVToErp(phones, prospect ,data);
    }

    return (
        <div
            data-cy="tab-rdv"
            className="flex flex-col p-4 gap-4">
            <AlertComponent prospect={prospect}/>
            <div className="flex flex-col rounded-xl bg-base-200 pb-2">
            <header className="p-4 font-bold text-lg text-neutral self-center">Ajouter RDV</header>
            <FormCallsRDV Submit={handleAjouter} erpReference={prospect?.erpReference} context="RDV"/>
            </div>


            
            <div className="overflow-y-auto max-h-[500px] p-2 rounded-xl bg-base-200">
            <h1 className="p-4 font-bold text-lg text-center text-neutral self-center">Historique des RDV</h1>
                <div className="flex flex-col gap-4">
                {
                    rdv?.map((item, index) => (
                        <div key={index} className="flex flex-col gap-1 border-2 items-start bg-base-100 rounded-xl p-8">
                            <span className="flex gap-2 items-center">
                            <PiUserCircleBold className="text-neutral text-xl"/>
                            </span>
                            <span className="flex gap-2 items-center">
                                <PiCalendarBold className="text-neutral text-xl"/>
                            {
                            new Date(item.date).toLocaleDateString("fr-FR", {
                                year: "numeric",
                                month: "numeric",
                                day: "numeric"
                            })
                            }
                            </span>
                            <span className="flex gap-2 items-center">
                                <PiClockBold className="text-neutral text-xl"/>
                            {
                            new Date(item.date).toLocaleTimeString("fr-FR", {
                                hour: "numeric",
                                minute: "numeric"
                            })
                            }
                            </span>
                            {item.status === "Fait" &&
                                <div>
                                    <span className="badge badge-success">Fait</span>
                                </div>
                            }
                            {item.status === "Annulé" &&
                                <div>
                                    <span className="badge badge-error">Annulé</span>
                                </div>
                            }
                            {item.status === "Reporté" &&
                                <div>
                                    <span className="badge badge-warning">Reporté</span>
                                </div>
                            }
                            {item.status === "Signé" &&
                                <div>
                                    <span className="badge badge-info">Signé</span>
                                </div>
                            }
                        </div>
                    ))
                }
                </div>

            </div>
        </div>

    )
}

export default TabRDV
