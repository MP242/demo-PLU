'use client'

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Select from 'react-select';
import { getRegions, getDepartementByName, getQuartierByName, getRegionbyName, getArrondissementByName } from "@/action/ManageLocalisation";
import { updateURLMap } from "@/lib/UpdateURLMap";
import dynamic from "next/dynamic";

const AsyncSelect = dynamic(() => import("react-select/async"), { ssr: false });

interface BrowserLocalisationProps {
    label?: boolean;
}

function sortArray(array: any) {
    array.sort((a: any, b: any) => {
        if (a.label < b.label) {
            return -1;
        }
        if (a.label > b.label) {
            return 1;
        }
        return 0;
    })
    return array;
}

const BrowserLocalisation = ({ label = false }: BrowserLocalisationProps) => {
    const [OptionRegion, setOptionRegion] = useState<any>([]);
    const [OptionDepartement, setOptionDepartement] = useState<any>([]);
    const [OptionArrondissement, setOptionArrondissement] = useState<any>([]);
    const [OptionCommune, setOptionCommune] = useState<any>([]);
    const [OptionQuartier, setOptionQuartier] = useState<any>([]);
    const [CommuneActive, setCommuneActive] = useState<boolean | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        async function getRegion() {
            const value = searchParams?.get("region") || "";
            var option;
            const region = await getRegions();
            option = region.map((item: any) => {
                return {
                    value: item.name,
                    label: item.name,
                }
            })
            option = [{ value: "Tout", label: "Tout" }, ...option];
            option = sortArray(option);
            setOptionRegion(option);
            if (value !== "" && value !== "Tout") {
                if (value === "La Réunion") {
                    setCommuneActive(true);
                } else {
                    setCommuneActive(false);
                }
                const departement: any = await getRegionbyName(value);
                var departementOption = departement?.departements?.map((item: any) => {
                    return {
                        value: item,
                        label: item,
                    }
                })
                departementOption = [{ value: "Tout", label: "Tout" }, ...departementOption];
                departementOption = sortArray(departementOption);
                setOptionDepartement(departementOption);
            } else {
                setOptionDepartement([]);
                setOptionArrondissement([]);
                setOptionQuartier([]);
            }
        }
        getRegion();
    }, [searchParams])

    useEffect(() => {
        async function getDepartement() {
            const value = searchParams?.get("departement") || "";
            var option;
            if (value !== "" && value !== "Tout") {
                const departement: any = await getDepartementByName(value);

                option = departement?.arrondissement?.map((item: any) => {
                    return {
                        value: item,
                        label: item,
                    }
                })
                option = [{ value: "Tout", label: "Tout" }, ...option];
                option = sortArray(option);
                setOptionArrondissement(option);
            } else {
                setOptionArrondissement([]);
                setOptionQuartier([]);
            }
        }
        getDepartement();
    }, [searchParams])

    useEffect(() => {
        async function getQuartierbyCity() {
            const value = searchParams?.get("city") || "";
            var option;
            if (value !== "" && value !== "Tout") {
                const quartier: any = await getQuartierByName(value);
                option = quartier.map((item: any) => {
                    return {
                        iris_code: item.iris_code,
                        value: item.quartier,
                        label: item.quartier,
                    }
                })
                option = [{ value: "Tout", label: "Tout" }, ...option];
                option = sortArray(option);
                setOptionQuartier(option);
            } else {
                setOptionQuartier([]);
            }
        }
        getQuartierbyCity();
    }, [searchParams])

    useEffect(() => {
        async function getQuartier() {
            const value = searchParams?.get("arrondissement") || "";
            var option;
            if (value !== "" && CommuneActive !== null) {
                if (CommuneActive) {
                    const arrondissement: any = await getArrondissementByName(value);
                    option = arrondissement?.commune?.map((item: any) => {
                        return {
                            value: item,
                            label: item,
                        }
                    })
                } else {
                    const quartier: any = await getQuartierByName(value);
                    option = quartier.map((item: any) => {
                        return {
                            iris_code: item.iris_code,
                            value: item.quartier,
                            label: item.quartier,
                        }
                    })
                }
                option = [{ value: "Tout", label: "Tout" }, ...(option || [])];
                option = sortArray(option);
                if (CommuneActive) {
                    setOptionCommune(option);
                } else {
                    setOptionQuartier(option);
                }
            } else {
                setOptionQuartier([]);
            }
        }
        getQuartier();
    }, [searchParams, CommuneActive])

    return (
        <>
            <>
                {label &&
                    <label className="label">
                        <span className="label-text w-full border-gray-600 text-white">Region :</span>
                    </label>
                }
                <AsyncSelect
                    defaultInputValue={searchParams?.get("region") || ""}
                    instanceId={"region"}
                    onChange={(selectedOption: any) => updateURLMap("region", selectedOption?.value as string, router, searchParams)}
                    className="text-sm"
                    isDisabled={OptionRegion.length === 0}
                    options={OptionRegion}
                />
                {label &&
                    <label className="label">
                        <span className="label-text w-full border-gray-600 text-white">Departement</span>
                    </label>
                }
                <AsyncSelect
                    defaultInputValue={searchParams?.get("departement") || ""}
                    instanceId={"Departements"}
                    onChange={(selectedOption: any) => updateURLMap("departement", selectedOption?.value as string, router, searchParams)}
                    className="text-sm"
                    isDisabled={OptionDepartement.length === 0}
                    options={OptionDepartement}
                />
                {label &&
                    <label className="label">
                        <span className="label-text w-full border-gray-600 text-white">Arrondissement</span>
                    </label>
                }
                <AsyncSelect
                    instanceId={"Arrondissement"}
                    defaultValue={searchParams?.get("arrondissement") || ""}
                    className="text-sm"
                    onChange={(selectedOption: any) => updateURLMap("arrondissement", selectedOption?.value as string, router, searchParams)}
                    isDisabled={OptionArrondissement.length === 0}
                    options={OptionArrondissement}
                />
                {CommuneActive &&
                    <>
                        {label &&
                            <label className="label">
                                <span className="label-text w-full border-gray-600 text-white">Commune</span>
                            </label>
                        }
                        <Select
                            instanceId={"Commune"}
                            defaultValue={searchParams?.get("city") || ""}
                            className="text-sm"
                            onChange={(selectedOption: any) => updateURLMap("city", selectedOption?.value as string, router, searchParams)}
                            isDisabled={OptionCommune.length === 0}
                            options={OptionCommune}
                        />
                    </>
                }
                {label &&

                    <label className="label">
                        <span className="label-text w-full border-gray-600 text-white">Quartier</span>
                    </label>
                }
                <AsyncSelect
                    instanceId={"Quartier"}
                    defaultValue={searchParams?.get("iris_code") || ""}
                    className="text-sm"
                    onChange={(selectedOption: any) => {
                        const params = new URLSearchParams(searchParams?.toString());
                        if (selectedOption?.value === "Tout") {
                            params.delete("iris_code");
                            router.replace(`?${params.toString()}`);
                            return;
                        }
                        params.set("iris_code", selectedOption?.iris_code as string);
                        router.replace(`?${params.toString()}`);
                    }}
                    isDisabled={OptionQuartier.length === 0}
                    options={OptionQuartier}
                />
            </>
        </>
    )
}

export default BrowserLocalisation
