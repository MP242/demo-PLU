export function GetLastRDV(rdv: Array<{ date: string, status: string }>): { date: string, status: string } | null {
    if (rdv.length === 0) return null;
    let lastRDV = rdv[0];
    rdv.forEach(item => {
        if (new Date(item.date) > new Date(lastRDV.date)) {
            lastRDV = item;
        }
    });

    return lastRDV;
}
