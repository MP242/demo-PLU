'use client'

import { useEffect, useState } from "react";
import Collapse from "@/components/Collapse"
import { ProspectsItem } from "@/type"
import Select from 'react-select';
import { getRegions, getDepartementByName, getQuartierByName, getArrondissementByName } from "@/action/ManageLocalisation";

interface CollapsAddresseProps {
    prospect: ProspectsItem | null;
    register: any;
    getValues: any;
    setValue: any;
}

const CollapsAddresse = ({ prospect, register, getValues, setValue }: CollapsAddresseProps) => {
    const [OptionRegion, setOptionRegion] = useState<any>([]);
    const [OptionDepartement, setOptionDepartement] = useState<any>([]);
    const [OptionArrondissement, setOptionArrondissement] = useState<any>([]);
    const [OptionCommune, setOptionCommune] = useState<any>([]);
    const [OptionQuartier, setOptionQuartier] = useState<any>([]);
    const [CommuneActive, setCommuneActive] = useState<boolean>(false);

    useEffect(() => {
        async function getRegion() {
            const region = await getRegions();
            const option = region.map((item: any) => {
                return {
                    option: item.departements,
                    value: item.name,
                    label: item.name,
                }
            })
            setOptionRegion(option);
        }
        getRegion();
    }, [])



    async function handleRegion(e: any) {
        setValue("region", e.value);
        setValue("departement", "");
        setValue("arrondissement", "");
        setValue("address", "");

        if (e.value === "La Réunion") {
            setCommuneActive(true);
        } else {
            setCommuneActive(false);
        }
        setOptionCommune([]);
        setOptionArrondissement([]);
        setOptionQuartier([]);
        setOptionDepartement([]);
        setOptionDepartement(e?.option.map((item: any) => {
            return {
                value: item,
                label: item,
            }
        }));
    }

    async function handleDepartement(e: any) {
        setValue("departement", e.value);
        setValue("arrondissement", "");
        setValue("address", "");
        setOptionArrondissement([]);
        setOptionCommune([]);
        setOptionQuartier([]);
        const departement: any = await getDepartementByName(e.value);
        setOptionArrondissement(departement?.arrondissement?.map((item: any) => {
            return {
                value: item,
                label: item,
            }
        }));
    }

    async function handleArrondissement(e: any) {
        setValue("arrondissement", e.value);
        setValue("address", "");
        setOptionCommune([]);
        setOptionQuartier([]);
        if (CommuneActive) {
            const arrondissement: any = await getArrondissementByName(e.value);
            setOptionCommune(arrondissement?.commune?.map((item: any) => {
                return {
                    value: item,
                    label: item,
                }
            }));
        } else {
            const quartier = await getQuartierByName(e.value);
            setOptionQuartier(quartier?.map((item: any) => {
                return {
                    iris_code: item.iris_code,
                    value: item.quartier,
                    label: item.quartier,
                }
            }));
        }
    }

    async function handleCommune(e: any) {
        setValue("city", e.value);
        setValue("district", "");
        setOptionQuartier([]);
        const quartier = await getQuartierByName(e.value);
        setOptionQuartier(quartier?.map((item: any) => {
            return {
                iris_code: item.iris_code,
                value: item.quartier,
                label: item.quartier,
            }
        }));
    }

    function handleQuartier(e: any) {
        setValue("district", e.value);
        setValue("iris", e.iris_code);
    }

    return (
        <Collapse title="Adresse">
            {prospect?.iris === undefined || prospect?.iris === "" ?
                <div className="badge badge-warning gap-2">Non Valider</div> :
                <div className="badge badge-success gap-2">Valider</div>
            }
            <label className="label">
                <span className="label-text w-full font-bold text-neutral text-sm">Region</span>
            </label>
            <Select
                instanceId={"region"}
                defaultInputValue={getValues("region")}
                data-cy="region"
                options={OptionRegion}
                onChange={handleRegion}
                placeholder="Region"
                className="w-full text-sm"
            />
            <label className="label">
                <span className="label-text w-full font-bold text-neutral text-sm">Departement</span>
            </label>
            <Select
                instanceId={"departement"}
                defaultInputValue={getValues("departement")}
                data-cy="departement"
                onChange={handleDepartement}
                isDisabled={OptionDepartement.length === 0}
                options={OptionDepartement}
                placeholder="Departement"
                className="w-full text-sm"
            />
            <label className="label">
                <span className="label-text w-full font-bold text-neutral text-sm">Arrondissement</span>
            </label>
            <Select
                instanceId={"arrondissement"}
                defaultInputValue={getValues("arrondissement")}
                data-cy="arrondissement"
                onChange={handleArrondissement}
                isDisabled={OptionArrondissement?.length === 0}
                options={OptionArrondissement}
                placeholder="Arrondissement"
                className="w-full text-sm"
            />
            {CommuneActive &&
                <>
                    <label className="label">
                        <span className="label-text w-full font-bold text-neutral text-sm">Commune</span>
                    </label>
                    <Select
                        instanceId={"commune"}
                        defaultInputValue={getValues("city")}
                        data-cy="commune"
                        onChange={handleCommune}
                        isDisabled={OptionCommune.length === 0}
                        options={OptionCommune}
                        placeholder="Commune"
                        className="w-full text-sm"
                    />
                </>
            }
            <label className="label">
                <span className="label-text w-full font-bold text-neutral text-sm">Quartier</span>
            </label>
            <Select
                instanceId={"quartier"}
                defaultInputValue={getValues("district")}
                data-cy="quartier"
                onChange={handleQuartier}
                isDisabled={OptionQuartier.length === 0}
                options={OptionQuartier}
                placeholder="Quartier"
                className="w-full text-sm"
            />
            <label className="label">
                <span className="label-text w-full font-bold text-neutral text-sm">Code Postal</span>
            </label>
            <input
                data-cy="zipCode"
                {...register("zipCode")}
                type="text" placeholder="Code Postal" className="input border-2 input-bordered input-sm w-full" />
            <label className="label">
                <span className="label-text w-full font-bold text-neutral text-sm">Complement d'address</span>
            </label>
            <input
                data-cy="address"
                {...register("address")}
                type="text" placeholder="Complement d'address" className="input border-2 input-bordered input-sm w-full" />
        </Collapse>
    )
}

export default CollapsAddresse;
