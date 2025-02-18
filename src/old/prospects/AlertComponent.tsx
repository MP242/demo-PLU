import { getAlertByProspectId } from "@/action/ManageProspect";
import { ProspectsItem } from "@/type";
import { useEffect, useState } from "react";

interface AlertComponentProps {
    prospect: ProspectsItem | null;
}

interface LogsProps {
    message: string | null;

}

const CODE_ERROR = [
    {code : "000", message : "Impossible de modifier le prospect !"}, // Erreur de modification CallCenter
    {code : "001", message : "Le prospect n'a pas de téléphone saisie!"}, // Prospect Sans téléphone
    {code : "002", message : "Prospect en doublon dans l'ERP"}, // Doublons dans l'ERP
    {code : "003", message : "Téléphones du prospect différents entre l'ERP et le CallCenter"} // Différences de téléphone Call Center / ERP
];


const AlertComponent = ({prospect} : AlertComponentProps)=>{

    const [logs, setLogs] = useState<any[]>([]);

    useEffect(()=>{
        const fetchData = async ()=>{
            const data = await getAlertByProspectId(prospect?._id);
            setLogs(data);
        }
        fetchData();
    },[]);


    const filterAlert = (log : any)=>{
        const index = CODE_ERROR.findIndex(error => log.code === error.code);
        return index !== -1;
    }

    const renderAlert = (log : any)=>{
        const index = CODE_ERROR.findIndex(error => log.code === error.code);
        const formatedLog = CODE_ERROR[index];

        return (
            <div role="alert" className="alert alert-warning w-full max-w-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span>{formatedLog.message}</span>
            </div>
        )
    }

    return(
        <div className="flex justify-center">
            {
                logs?.filter(filterAlert).map(renderAlert)
            }
        </div>
    )
}

export default AlertComponent;