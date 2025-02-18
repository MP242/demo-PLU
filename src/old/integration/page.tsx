'use client'

import { useEffect, useState } from 'react';
import FileUpload from "./FileUpload";
import { createProspect } from "@/action/ManageProspect";
import TableError from './TableError';
import { createFiles } from '@/action/ManageFiles';
import { ProspectsItemADD } from '@/type';
import { getDepartementByzipCode, getRegionbyDepartement } from '@/action/ManageLocalisation';
import TableFile from './TableFIle';

export default function IntegrationPage() {
    const [DataCSV, setDataCSV] = useState<{ data: Record<string, any>[], name: string } | null>(null);
    const [DataError, setDataError] = useState<any[] | null>(null);
    const [progress, setProgress] = useState(0);
    const [MaxProgress, setMaxProgress] = useState(0);
    const [InfoEnd, setInfoEnd] = useState<{ sucess: number, error: number, isEnd: boolean }>({ sucess: 0, error: 0, isEnd: false });

    async function uploadData() {
        if (!DataCSV) return;
        var Success = 0;
        var Error = 0;
        setInfoEnd({ sucess: 0, error: 0, isEnd: false });
        setProgress(0);
        setDataError(null);
        setMaxProgress(DataCSV.data.length);
        for (let index = 0; index < DataCSV.data.length; index++) {
            const prospect = DataCSV.data[index];
            const departement: any = await getDepartementByzipCode(prospect['Postal code']);
            const region: any = await getRegionbyDepartement(departement?.name);
            const formatedProspect: ProspectsItemADD = {
                lastName: prospect['Last name'],
                firstName: prospect['First name'],
                gender: prospect.Gender,
                age: prospect['Age range'],
                region: region?.name ?? "",
                departement: departement?.name ?? "",
                address: prospect.Address,
                arrondissement: prospect.Arrondissement ?? "",
                city: prospect.City,
                zipCode: prospect['Postal code'],
                district: prospect.District,
                housing: prospect.Housing ?? "House",
                phone1: prospect.Phone,
                phone2: prospect.Phone2,
                mobile1: prospect.Mobile,
                mobile2: prospect.Mobile2,
                erpReference: region?.erpRef ?? "",
                domaine: "",
                thread: "",
                calling: 0,
                iris: "",
                proprietaire: "",
                profession: "",
                houseAge: "",
                consumption: "",
                roof: "",
                facture: { price: 0, frequency: "" },
                calls: [],
                rdv: [],
            };
            const error = await createProspect(formatedProspect);
            setProgress(index);
            if (error) {
                Error++;
                setInfoEnd((prev) => ({ ...prev, error: prev.error + 1 }));
                setDataError((prev) => [...(prev || []), { message: error, row: index + 1, data: prospect }]);
            } else {
                Success++;
                setInfoEnd((prev) => ({ ...prev, sucess: prev.sucess + 1 }));
            }
        }
        setMaxProgress(0);
        await createFiles({
            name: DataCSV.name,
            date: new Date().toISOString(),
            success: Success,
            error: Error,
        });
        setInfoEnd((prev) => ({ ...prev, isEnd: true }));
    }

    return (
        <div
            data-cy="intergration"
            className='flex flex-col space-y-5 p-5 w-full h-full'>
            <FileUpload setData={setDataCSV} />
            <button
                disabled={MaxProgress > 0}
                type='button'
                className='btn btn-primary'
                onClick={() => uploadData()}>
                upload
            </button>
            <progress className="progress progress-info w-full" value={progress.toString()} max={MaxProgress.toString()}></progress>
            <div className='self-center'>
                {InfoEnd.isEnd &&
                    <div className="card w-96 bg-primary-content shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title self-center">Success</h2>
                            <div className='flex justify-between'>
                                <span>Success: {InfoEnd.sucess}</span>
                                <span>Error: {InfoEnd.error}</span>
                            </div>
                        </div>
                    </div>
                }
            </div>
            {DataError &&
                <TableError data={DataError} />
            }
            <TableFile isEnd={InfoEnd.isEnd}/>
        </div>
    );
}
