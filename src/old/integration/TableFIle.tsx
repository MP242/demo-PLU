'use client'

import { useEffect, useState } from "react";
import { getFiles } from "@/action/ManageFiles";
import { FilesItem } from "@/type";

interface TableFileProps {
    isEnd: boolean;
}

const TableFile = ({ isEnd }: TableFileProps) => {
    const [Files, setFiles] = useState<FilesItem[] | null>(null);

    useEffect(() => {
        async function getData() {
            if (!isEnd) return;
            const files = await getFiles();
            setFiles(files);
        }
        getData();
    }, [isEnd]);

    return (
        <div className=" p-2">
            {Files &&
                <table className="table table-zebra">
                    <thead>
                        <tr className="text-xl">
                            <td>File</td>
                            <td>Nombre d'ajouts</td>
                            <td>Nombre d'erreurs</td>
                            <td>Date</td>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {Files?.map((file, index) => (
                            <tr key={index}>
                                <td>
                                    {file.name}
                                </td>
                                <td>
                                    {file.success}
                                </td>
                                <td>
                                    {file.error}
                                </td>
                                <td>
                                    {file.date}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </div >
    )
}

export default TableFile;
