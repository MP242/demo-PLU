'use client'

import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { updateProspect } from "@/action/ManageProspect";
import { ProspectsItem } from "@/type";
import CollapseAddresse from "./CollapseAddress";
import { useTransition } from "react";
import Select from "react-select";
import CollapseConumption from "./CollapseConumption";
import Collapse from "@/components/Collapse";
import AlertComponent from "./AlertComponent";
import { useRefreshStore } from "@/stores/refreshStore";


interface TabInformationProps {
    prospect: ProspectsItem | null;
}

const TabInformation = ({ prospect }: TabInformationProps) => {
    const [isPending, startTransition] = useTransition();
    const [isProprietaire, setIsProprietaire] = useState<string>("");
    const { setRefresh } = useRefreshStore();
    const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm({
        defaultValues: async () => {
            setIsProprietaire(prospect?.proprietaire ?? "");
            return {
                region: prospect?.region ?? "",
                departement: prospect?.departement ?? "",
                arrondissement: prospect?.arrondissement,
                lastName: prospect?.lastName ?? "",
                age: prospect?.age ?? "",
                firstName: prospect?.firstName ?? "",
                address: prospect?.address ?? "",
                city: prospect?.city ?? "",
                zipCode: prospect?.zipCode ?? "",
                district: prospect?.district ?? "",
                phone1: prospect?.phone1 ?? "",
                phone2: prospect?.phone2 ?? "",
                mobile1: prospect?.mobile1 ?? "",
                mobile2: prospect?.mobile2 ?? "",
                iris: prospect?.iris ?? "",
                proprietaire: prospect?.proprietaire ?? "",
                profession: prospect?.profession ?? "",
                houseAge: prospect?.houseAge ?? "",
                consumption: prospect?.consumption ?? [],
                roof: prospect?.roof ?? "",
                facture: prospect?.facture ?? { price: 0, frequency: "" },
                domaine: prospect?.domaine ?? "",
            };
        }
    });

    const watchConsumption = watch("consumption");

    async function onSubmit(data: any) {
        setRefresh(new Date().getTime());
        await updateProspect(prospect?._id, data);
    }

    const StartTransitionSubmit = (data: any) => {
        startTransition(() => onSubmit(data));
    }

    return (
        <div
            data-cy="tab-information"
            className="flex flex-col text-lg h-full">
            <AlertComponent prospect={prospect}/>
            <h1 className="p-4 font-bold self-center">Information Prospect</h1>
            <form onSubmit={handleSubmit(StartTransitionSubmit)} className="container justify-start p-4 gap-2 flex flex-col h-full overflow-y-auto">
                <div className="flex flex-col gap-4">
                <Collapse title="Identité" DefautlOpen={true}>
                    {/* Prenom / Nom Mr */}
                    <div className="flex w-full">
                        <div className="w-1/2">
                            <label className="label">
                                <span className="label-text font-bold text-neutral text-sm">{prospect?.gender === "Mr" || prospect?.gender === "Mrs/Mr" ? "Nom Mr" : "Nom Mme"}</span>
                            </label>
                            <input
                                data-cy="lastName"
                                {...register("lastName")}
                                type="text" placeholder="Nom" className="input border-2 input-bordered input-sm w-11/12" />
                        </div>
                        <div className="w-1/2">
                            <label className="label">
                                <span className="label-text font-bold text-neutral text-sm">{prospect?.gender === "Mr" || prospect?.gender === "Mrs/Mr" ? "Prénom Mr" : "Prénom Mme"}</span>
                            </label>
                            <input
                                data-cy="firstName"
                                {...register("firstName")}
                                type="text" placeholder="Prenom" className="input border-2 input-bordered input-sm w-full" />
                        </div>
                    </div>
                </Collapse>
                <Collapse title="Contact" DefautlOpen={true}>
                    {/* Telephone */}
                    <div className="flex w-full">
                        <div className="w-1/2">
                            <label className="label">
                                <span className="label-text w-full font-bold text-neutral text-sm">Téléphone 1</span>
                            </label>
                            <input
                                data-cy="phone1"
                                {...register("phone1")}
                                type="text" placeholder="Telephone 1" className="input input-bordered border-2 input-sm w-11/12" />
                        </div>
                        <div className="w-1/2">
                            <label className="label">
                                <span className="label-text w-full font-bold text-neutral text-sm">Téléphone 2</span>
                            </label>
                            <input
                                data-cy="phone2"
                                {...register("phone2")}
                                type="text" placeholder="Telephone 2" className="input input-bordered border-2 input-sm w-full" />
                        </div>
                    </div>
                    {/* Mobile */}
                    <div className="flex w-full">
                        <div className="w-1/2">
                            <label className="label">
                                <span className="label-text w-full font-bold text-neutral text-sm">Mobile 1</span>
                            </label>
                            <input
                                data-cy="mobile1"
                                {...register("mobile1")}
                                type="text" placeholder="Mobile 1" className="input input-bordered border-2 input-sm w-11/12" />
                        </div>
                        <div className="w-1/2">
                            <label className="label">
                                <span className="label-text w-full font-bold text-neutral text-sm">Mobile 2</span>
                            </label>
                            <input
                                data-cy="mobile2"
                                {...register("mobile2")}
                                type="text" placeholder="Mobile 2" className="input input-bordered border-2 input-sm w-full" />
                        </div>
                    </div>
                </Collapse>
                <Collapse title="Projet" DefautlOpen={true}>
                    {/* Propriétaire */}
                    <div className="flex flex-col w-full">
                        <label className="label">
                            <span className="label-text font-bold text-neutral text-sm">Propriétaire</span>
                        </label>
                        <div className="flex gap-4 items-center">
                            <input
                                value={"Oui"}
                                data-cy="proprietaire"
                                {...register("proprietaire")}
                                type="radio" className="radio checked:bg-primary" aria-label="Oui" checked={isProprietaire === "Oui"} onChange={() => setIsProprietaire("Oui")} />
                                <span className="text-neutral">Oui</span>
                            <input
                                value={"Non"}
                                data-cy="proprietaire"
                                {...register("proprietaire")}
                                type="radio" className="radio checked:bg-primary" aria-label="Non" checked={isProprietaire === "Non"} onChange={() => setIsProprietaire("Non")} />
                                <span className="text-neutral">Non</span>
                        </div>
                        <div className="w-full">
                            <label className="label">
                                <span className="label-text w-full font-bold text-neutral text-sm">Domaine</span>
                            </label>
                            {getValues("domaine") !== undefined &&
                                <Select
                                    defaultInputValue={getValues("domaine") ?? "Choisir"}
                                    onChange={(e) => setValue("domaine", e?.value ?? "")}
                                    className="text-sm w-full"
                                    options={[
                                        { value: "ISO", label: "Iso" },
                                        { value: "SOLAR", label: "Solar" },
                                    ]}
                                />
                            }
                        </div>
                    </div>
                </Collapse>
                {/* Complément */}
                <Collapse title="Complément" DefautlOpen={true}>
                    <div className="flex w-full items-center">
                        <div className="w-1/2">
                            <label className="label">
                                <span className="label-text font-bold text-neutral text-sm">Profession MR</span>
                            </label>
                            <input
                                data-cy="profession"
                                {...register("profession")}
                                type="text" placeholder="Profession" className="input input-bordered border-2 input-sm w-11/12" />
                        </div>
                        <div className="w-1/2">
                            <label className="label">
                                <span className="label-text font-bold text-neutral text-sm">Age Mr</span>
                            </label>
                            {getValues("age") !== undefined &&
                                <Select
                                    defaultInputValue={getValues("age")}
                                    onChange={(e) => setValue("age", e?.value ?? "")}
                                    className="text-sm"
                                    options={[
                                        { value: "18-25", label: "18-25" },
                                        { value: "25-35", label: "25-35" },
                                        { value: "35-45", label: "35-45" },
                                        { value: "45-55", label: "45-55" },
                                        { value: "55-65", label: "55-65" },
                                        { value: "65+", label: "65+" },
                                    ]}
                                />
                            }
                        </div>
                    </div>
                    <div className="flex w-full items-center">
                        <div className="w-1/2">
                            <label className="label">
                                <span className="label-text font-bold text-neutral text-sm">Profession Mme</span>
                            </label>
                            <input
                                data-cy="profession"
                                {...register("profession")}
                                type="text" placeholder="Profession" className="input input-bordered border-2 input-sm w-11/12" />
                        </div>
                        <div className="w-1/2">
                            <label className="label">
                                <span className="label-text font-bold text-neutral text-sm">Age Mme</span>
                            </label>
                            {getValues("age") !== undefined &&
                                <Select
                                    defaultInputValue={getValues("age")}
                                    onChange={(e) => setValue("age", e?.value ?? "")}
                                    className="text-sm"
                                    options={[
                                        { value: "18-25", label: "18-25" },
                                        { value: "25-35", label: "25-35" },
                                        { value: "35-45", label: "35-45" },
                                        { value: "45-55", label: "45-55" },
                                        { value: "55-65", label: "55-65" },
                                        { value: "65+", label: "65+" },
                                    ]}
                                />
                            }
                        </div>
                    </div>
                </Collapse>
                <CollapseAddresse prospect={prospect} register={register} getValues={getValues} setValue={setValue} />
                <CollapseConumption prospect={prospect} watchConsumption={watchConsumption} setValue={setValue} />
                <Collapse title="Information" DefautlOpen={true}>
                    <div className="flex w-full">
                        <div className="w-1/2">
                            <label className="label">
                                <span className="label-text w-full font-bold text-neutral text-sm">Maison Age</span>
                            </label>
                            {getValues("houseAge") !== undefined &&
                                <Select
                                    defaultInputValue={getValues("houseAge")}
                                    onChange={(e) => setValue("houseAge", e?.value ?? "")}
                                    className="text-sm w-11/12"
                                    options={[
                                        { value: "-2 ans", label: "-2 ans" },
                                        { value: "+5 ans", label: "+5 ans" },
                                        { value: "+15 ans", label: "+15 ans" },
                                    ]}
                                />
                            }
                        </div>
                        <div className="w-1/2">
                            <label className="label">
                                <span className="label-text w-full font-bold text-neutral text-sm">Type de toit</span>
                            </label>
                            {getValues("roof") !== undefined &&
                                <Select
                                    defaultInputValue={getValues("roof") ?? "Choisir"}
                                    onChange={(e) => setValue("roof", e?.value ?? "")}
                                    className="text-sm w-full"
                                    options={[
                                        { value: "Tuiles", label: "Tuiles" },
                                        { value: "Ardoises", label: "Ardoises" },
                                        { value: "Tole", label: "Tole" },
                                        { value: "Autre", label: "Autre" },
                                    ]}
                                />
                            }
                        </div>
                    </div>
                    <div className="flex w-full">
                        <div className="w-1/2">
                            <label className="label">
                                <span className="label-text w-full font-bold text-neutral text-sm">Facture prix</span>
                            </label>
                            {getValues("facture") !== undefined &&
                                <Select
                                    defaultInputValue={getValues("facture")?.price.toString()}
                                    onChange={(e) => setValue("facture.price", parseInt(e?.value ?? ""))}
                                    className="text-sm w-11/12"
                                    options={[
                                        { value: "-100", label: "-100" },
                                        { value: "100", label: "100" },
                                    ]}
                                />
                            }
                        </div>
                        <div className="w-1/2">
                            <label className="label">
                                <span className="label-text w-full font-bold text-neutral text-sm">Facture frequence</span>
                            </label>
                            {getValues("facture") !== undefined &&
                                <Select
                                    defaultInputValue={getValues("facture.frequency")}
                                    onChange={(e) => setValue("facture.frequency", e?.value ?? "")}
                                    className="text-sm w-full"
                                    options={[
                                        { value: "Mensuel", label: "Mensuel" },
                                        { value: "Be-mensuel", label: "Be-mensuel" },
                                    ]}
                                />
                            }
                        </div>
                    </div>
                </Collapse> 
                </div>

                <div className="self-center bottom-0 py-2">
                    {isPending ?
                        <AiOutlineLoading3Quarters className="animate-spin" size={50} /> :
                        <button
                            disabled={isPending}
                            data-cy="submit"
                            className="btn btn-primary"
                            type="submit">Valider</button>
                    }
                </div>
            </form>
        </div >
    )
}

export default TabInformation
