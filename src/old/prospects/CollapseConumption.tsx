'use client'

import { ProspectsItem } from "@/type";
import Collapse from "@/components/Collapse";
import { useState, useEffect } from "react";
import { MdPool } from "react-icons/md";
import { FaTemperatureHigh } from "react-icons/fa";
import { FaCar } from "react-icons/fa";
import { FaSprayCanSparkles } from "react-icons/fa6";


interface CollapseConumptionProps {
    prospect: ProspectsItem | null;
    watchConsumption: any;
    setValue: any;
}

const CollapseConumption = ({ prospect, watchConsumption, setValue }: CollapseConumptionProps) => {
    const [Consommation, setConsommation] = useState<{ validate: Array<{ label: string, icon: React.ReactNode | null }>, waiting: Array<{ label: string, icon: React.ReactNode | null }> }>({ validate: [], waiting: [] });

    useEffect(() => {
        const Consommation = [
            { label: "spa", icon: <FaSprayCanSparkles/> },
            { label: "piscine", icon: <MdPool /> },
            { label: "voiture électrique", icon: <FaCar/> },
            { label: "chauffage électrique", icon: <FaTemperatureHigh/> },
        ];
        var validate: Array<{ label: string, icon: React.ReactNode | null }> = [];
        var waiting: Array<{ label: string, icon: React.ReactNode | null }> = [];

        Consommation.forEach(item => {
            if (watchConsumption?.includes(item.label)) {
                validate.push(item);
            } else {
                waiting.push(item);
            }
        })

        validate.sort((a, b) => {
            if (a.label < b.label) {
                return -1;
            }
            if (a.label > b.label) {
                return 1;
            }
            return 0;
        })

        waiting.sort((a, b) => {
            if (a.label < b.label) {
                return -1;
            }
            if (a.label > b.label) {
                return 1;
            }
            return 0;
        })

        setConsommation({ validate, waiting });
    }, [watchConsumption])

    function addValue(value: string) {
        const values = watchConsumption;
        values.push(value);
        setValue("consumption", values);
    }

    function removeValue(value: string) {
        const values = watchConsumption;
        const index = values.indexOf(value);
        values.splice(index, 1);
        setValue("consumption", values);
    }

    return (
        <Collapse title="Consommation">
            <div className="grid grid-cols-2 w-full gap-4">
                {Consommation.waiting.map(({ label, icon }: { label: string; icon: React.ReactNode }, index: number) => (
                    <div key={index} className="card bg-primary-focus w-full p-2">
                        <div className="flex justify-start gap-2 items-center text-white">
                            <input
                                onChange={() => addValue(label)}
                                type="checkbox" checked={false} className="checkbox checkbox-primary" />
                            <label className="font-bold text-neutral text-sm">{label}</label>
                            <span className="font-bold text-neutral text-sm">{icon}</span>
                        </div>
                    </div>
                ))}
                {Consommation.validate.map(({ label, icon }: { label: string; icon: React.ReactNode }, index: number) => (
                    <div key={index} className="card bg-primary-focus w-full p-2">
                        <div className="flex justify-between items-center text-white">
                            <input
                                onChange={() => removeValue(label)}
                                type="checkbox" checked={true} className="checkbox checkbox-primary" />
                            <label className="font-bold text-neutral text-sm">{label}</label>
                            <span className="font-bold text-neutral text-sm">{icon}</span>
                        </div>
                    </div>
                ))}
            </div>
        </Collapse>
    );
}

export default CollapseConumption;
