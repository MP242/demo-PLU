'use client'

import { GetLastCall } from "@/lib/GetLastCall";
import { AiOutlinePhone } from "react-icons/ai";
import { ProspectsItem } from "@/type";
import { GetLastRDV } from "@/lib/GetLastRDV";

interface TableRowsProps {
    data: ProspectsItem[] | null;
    setIsOpen: (value: boolean, id: string) => void;
}

const TableRow = ({ data, setIsOpen }: TableRowsProps) => {
    function handleOpenDrawer(item: ProspectsItem | null) {
        setIsOpen(true, item?._id ?? "");
    }

    function handleChoseColor(item: ProspectsItem, index: number) {
        const dateNow = new Date();
        const lastRDV = GetLastRDV(item.rdv);
        if (new Date(lastRDV?.date ?? "") < dateNow && (lastRDV?.status === "Signé" || lastRDV?.status === "Fait")) {
            return "bg-green-200";
        }
        if (new Date(lastRDV?.date ?? "") > dateNow) {
            return "bg-blue-200";
        }
        return index % 2 === 0 ? "" : "bg-gray-100";
    }

    return (
        <tbody>
            {data?.map((item, index) => (
                <tr
                    data-cy={`table-row-${index}`}
                    onClick={() => handleOpenDrawer(item)}
                    key={index}
                    className={`hover:bg-gray-200 text-[#646B79] text-sm w-full ${handleChoseColor(item, index)}`}
                >
                    <td className="w-1/12">
                        {item.lastName}
                    </td>
                    <td className="w-1/12">
                        {item.firstName}
                    </td>
                    <td className="w-1/12">
                        {item.address}
                    </td>
                    <td className="w-1/12">
                        <div className="flex flex-col space-y-2">
                            {item.phone1 &&
                                <div className="flex items-center">
                                    <a href={`tel:${item.phone1}`} className="mr-1">
                                        <AiOutlinePhone size={20} />
                                    </a>
                                    {item.phone1}
                                </div>
                            }
                            {item.phone2 &&
                                <div className="flex items-center">
                                    <a href={`tel:${item.phone2}`} className="mr-1">
                                        <AiOutlinePhone size={20} />
                                    </a>
                                    {item.phone2}
                                </div>
                            }
                            {item.mobile1 &&
                                <div className="flex items-center">
                                    <a href={`tel:${item.mobile1}`} className="mr-1">
                                        <AiOutlinePhone size={20} />
                                    </a>
                                    {item.mobile1}
                                </div>
                            }
                            {item.mobile2 &&
                                <div className="flex items-center">
                                    <a href={`tel:${item.mobile2}`} className="mr-1">
                                        <AiOutlinePhone size={20} />
                                    </a>
                                    {item.mobile2}
                                </div>
                            }
                        </div>
                    </td>
                    <td className="w-1/12 max-w-xs">
                        {item.calling}
                    </td>
                    <td className="w-1/12">
                        {GetLastCall(item.calls)}
                    </td>
                </tr>
            ))}
        </tbody>
    );
}

export default TableRow;
