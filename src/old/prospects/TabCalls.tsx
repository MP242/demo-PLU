'use client'

import FormCallsRDV from "./FormCallsRDV";
import { updateProspectCall, updateStatusCall } from "@/action/ManageProspect";
import { useEffect, useState } from "react";
import { ProspectsItem } from "@/type";
import AlertComponent from "./AlertComponent";
import { getUserbyId } from "@/action/ManageUsers";
import { useRefreshStore } from "@/stores/refreshStore";


interface TabCallsProps {
    prospect: ProspectsItem | null;
}

const TabCalls = ({ prospect }: TabCallsProps) => {

    const [calls, setCalls] = useState<Array<{ date: string, NameUser: string, status: string }>>([]);
    const [lastcall, setLastcall] = useState<string | null>(null);
    const { setRefresh } = useRefreshStore();

    useEffect(() => {
        const sortCalls = prospect?.calls?.sort((a, b) => {
            const [datePartA, timePartA] = a?.date.split(" ");
            const [yearA, monthA, dayA] = datePartA.split("-");
            const [hourA, minuteA] = timePartA.split(":");

            const [datePartB, timePartB] = b?.date.split(" ");
            const [yearB, monthB, dayB] = datePartB.split("-");
            const [hourB, minuteB] = timePartB.split(":");

            const dateA = new Date(Number(yearA), Number(monthA) - 1, Number(dayA), Number(hourA), Number(minuteA));
            const dateB = new Date(Number(yearB), Number(monthB) - 1, Number(dayB), Number(hourB), Number(minuteB));

            return dateB.getTime() - dateA.getTime();
        });
        if (sortCalls?.length !== 0 && sortCalls !== undefined) {
            const [datePartA, timePartA] = sortCalls[0]?.date.split(" ");
            const [yearA, monthA, dayA] = datePartA.split("-");

            const firstCallDate = new Date(Number(yearA), Number(monthA) - 1, Number(dayA));
            const currentDate = new Date();
            const timeDifference = currentDate.getTime() - firstCallDate.getTime();

            const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

            setLastcall(`${daysDifference === 0 ? "d'aujourd'hui" : daysDifference === 1 ? "d'hier" : "de " + daysDifference + " jours"}`);
        }
        Promise.all(
            sortCalls?.map(async (item: any) => {
                const user: any = await getUserbyId(item.idUser);
                return { date: item.date, NameUser: user?.email, status: item.status };
            }) ?? []
        ).then((resolvedCalls) => setCalls(resolvedCalls));

    }, [prospect]);

    async function handleAjouter(data: any) {
        setRefresh(new Date().getTime());
        await updateProspectCall(prospect?._id, data);
    }

    return (
        <div
            data-cy="tab-calls"
            className="flex flex-col h-full p-4 gap-6">
            <AlertComponent prospect={prospect}/>
            <div className="flex flex-col rounded-xl bg-base-200 pb-2">
            <header className="p-4 font-bold text-lg text-neutral self-center">Ajouter Call</header>
            <FormCallsRDV Submit={handleAjouter} />
            </div>

            {/* <div className="py-5 border-b border-gray-500">
            </div> */}
            
            <div className="overflow-y-auto h-full flex flex-col p-3 bg-base-200 rounded-xl">
            <h1 className="p-4 font-bold text-lg text-neutral self-center">Historique</h1>
                <div role="alert" className="alert bg-neutral text-base-100 rounded-xl font-bold mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {lastcall ? <span>Last call {lastcall}</span>
                        :
                        <span>Pas d'appel enregistré.</span>
                    }
                </div>
                {
                    calls?.map((item, index) => (
                        <div key={index} className="card text-neutral border-2 rounded-lg p-2 bg-base-100 my-2">
                            <div className="flex justify-center items-center space-x-3 p-2">
                                <input
                                    data-cy={`tab-date-${index}`}
                                    readOnly
                                    value={item.date.split(" ")[0]}
                                    type="text" placeholder="Type here" className="input border-2 input-bordered input-sm text-md w-full max-w-xs" />
                                <span className="text-neutral">:</span>
                                <input
                                    data-cy={`tab-time-${index}`}
                                    readOnly
                                    value={item.date.split(" ")[1].split(":").slice(0, 2).join(":")}
                                    type="text" placeholder="Type here" className="input border-2 input-bordered input-sm text-md w-full max-w-xs" />
                            </div>
                            <h1 className="text-neutral text-center">Répondu</h1>
                            <div className="flex self-center space-x-4">
                                <input
                                    onChange={async (e) => await updateStatusCall(prospect?._id ?? "", item.date, "Oui")}
                                    type="checkbox" checked={item.status === "Oui"} className="checkbox checkbox-md checkbox-info" />
                                <span className="text-neutral">Oui</span>
                                <input
                                    onChange={async (e) => await updateStatusCall(prospect?._id ?? "", item.date, "Non")}
                                    type="checkbox" checked={item.status === "Non"} className="checkbox checkbox-md checkbox-info" />
                                <span className="text-neutral">Non</span>
                                <input
                                    onChange={async (e) => await updateStatusCall(prospect?._id ?? "", item.date, "Mort")}
                                    type="checkbox" checked={item.status === "Mort"} className="checkbox checkbox-md checkbox-info" />
                                <span className="text-neutral">Mort</span>
                            </div>
                            <span className="text-neutral">{item.NameUser ? item.NameUser.split('@')[0] : ""}</span>
                        </div>
                    ))
                }
            </div>
        </div >
    )
}

export default TabCalls
