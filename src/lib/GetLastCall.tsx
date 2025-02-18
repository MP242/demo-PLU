export function GetLastCall(calls: Array<{ date: string, texte: { value: string, updateAt: string }, idUsers: string, answer: { value: string, updateAt: string } }>): string {
    if (calls.length === 0) {
        return "";
    }
    const dateArray = calls.map(call => {
        const [datePart, timePart] = call?.date.split(" ");
        const [year, month, day] = datePart?.split("-");
        const [hour, minute] = timePart?.split(":");

        return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
    });
    const sortedDates = dateArray.sort((a, b) => b.getTime() - a.getTime());

    return sortedDates[0].toLocaleDateString();
}
