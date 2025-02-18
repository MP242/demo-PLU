'use client'

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { getCallbyidUser } from "@/action/ManageProspect"

export default function dashboardPae() {
    const { data: session, status } = useSession()

    useEffect(() => {
        async function fetchData() {
            if (session) {
                const data = await getCallbyidUser(session.user.id);

                const currentWeek = getWeek(new Date());
                const lastWeek = currentWeek - 1;

                const lastWeekCalls = data.reduce((count, prospect) => {
                    prospect.calls.forEach((call) => {
                        const callWeek = getWeek(new Date(call.date));
                        if (callWeek === lastWeek) {
                            count++;
                        }
                    });
                    return count;
                }, 0);

                console.log(lastWeekCalls);

                const weeklyCalls = data.reduce((count, prospect) => {
                    prospect.calls.forEach((call) => {
                        const callWeek = getWeek(new Date(call.date));
                        if (callWeek === currentWeek) {
                            count++;
                        }
                    });
                    return count;
                }, 0);

                console.log(weeklyCalls);
            }
        }
        fetchData()
    }, [session])

    function getWeek(date: Date): number {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNumber = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
        return weekNumber;
    }

    return (
        <div className="p-2">
            <h1 className="text-2xl font-bold">{session?.user?.email}</h1>
            <div className="stats bg-primary shadow text-white">

                <div className="stat">
                    <div className="stat-title text-white">Nombre d'appelle cette semaine</div>
                    <div className="stat-value">1</div>
                </div>

            </div>
        </div>
    )
}
