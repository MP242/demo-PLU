'use server'

import { Error as MongooseError } from 'mongoose';
import connect from '@/database/Mongoose';
import Prospects from "@/models/modelProspects";
import { revalidatePath } from 'next/cache';
import { ProspectsItem, ProspectsItemADD } from '@/type';
import { GetLastRDV } from '@/lib/GetLastRDV';
import Logs from '@/models/modelLogs';
import { getDepartementByzipCode, getRegionbyDepartement } from './ManageLocalisation';
import { createThread } from './Openai/Threads';


connect();

export async function getProspects() {
    const data = await Prospects.find();
    return JSON.parse(JSON.stringify(data));
}

export async function createProspectJsonFromErp(erpProspect: any) {

    const departement: any = await getDepartementByzipCode(erpProspect.postalCode ?? "");
    const region: any = await getRegionbyDepartement(departement?.name);
    const thread: any = await createThread();

    const rdv = erpProspect.appointmentTime && erpProspect.appointmentAt ? [
        {
            date: `${erpProspect.appointmentAt} ${erpProspect.appointmentTime}`, 
            status: erpProspect.rdv  === "canceled" ? "Reporté" :
            erpProspect.rdv  === "done" ? "Fait" :
            erpProspect.rdv  === "dead" ? "Annulé" :
            erpProspect.rdv  === "signed" ? "Signé" : ""
        }
    ] : [];

    const formatedProspect: ProspectsItemADD = {
        lastName: erpProspect.name ?? "",
        firstName: erpProspect.firstName,
        gender: erpProspect.gender,
        age: "",
        region: region?.name ?? "",
        departement: departement?.name ?? "",
        address: erpProspect.address,
        arrondissement: "",
        city: erpProspect.city,
        zipCode: erpProspect.postalCode ?? "",
        district: "",
        housing: erpProspect.Housing ?? "house",
        phone1: erpProspect.phone1,
        phone2: erpProspect.phone2,
        mobile1: erpProspect.mobile1,
        mobile2: erpProspect.mobile2,
        erpReference: erpProspect.erpReference ?? "",
        domaine: erpProspect.domains ? erpProspect.domains[0] : null,
        thread: thread?.id ?? "",
        calling: 0,
        iris: "",
        proprietaire: "",
        profession: "",
        houseAge: "",
        consumption: "",
        roof: "",
        facture: { price: 0, frequency: "" },
        calls: [],
        rdv
    };

    return formatedProspect;
}

export async function createProspect(data: ProspectsItemADD) {
    try {
        const prospect = new Prospects(data);
        await prospect.save();
    } catch (error: any) {
        console.log(error);
        const errorMessage = (error as MongooseError)?.message || "An error occurred while creating the prospect.";
        return JSON.stringify(errorMessage);
    }
}

export async function deleteProspect(id: string) {
    await Prospects.findByIdAndDelete(id);
}

export async function updateProspectCall(id: string | undefined, data: { date: string; time: string, idUser: string }) {
    const prospect = await Prospects.findById(id);
    prospect.calls.push({ date: `${data.date} ${data.time}`, texte: { value: "", updateAt: "" }, idUser: data.idUser, answer: { value: "", updateAt: "" }, status: "" });
    prospect.calling += 1;
    await prospect.save();
    revalidatePath("/prospects");
    revalidatePath("/");
}

export async function updateProspectTextbyCall(id: string, call: string, texte: string) {
    let prospect = await Prospects.findById(id);
    const index = prospect.calls.findIndex((element: { date: string; }) => element.date === call);
    prospect.calls[index].texte = {
        value: texte,
        updateAt: new Date().toISOString()
    };
    await Prospects.findByIdAndUpdate(id, prospect);
    revalidatePath("/prospects");
    revalidatePath("/");
}

export async function updateProspectThread(id: string | undefined, thread: string) {
    const prospect = await Prospects.findById(id);
    prospect.thread = thread;
    await prospect.save();
    revalidatePath("/prospects");
    revalidatePath("/");
}

export async function updateProspectAnswerbyCall(id: string, call: string, answer: string) {
    let prospect = await Prospects.findById(id);
    const index = prospect.calls.findIndex((element: { date: string; }) => element.date === call);
    prospect.calls[index].answer = {
        value: answer,
        updateAt: prospect.calls[index].texte.updateAt
    };
    await Prospects.findByIdAndUpdate(id, prospect);
    revalidatePath("/prospects");
    revalidatePath("/");
}

export async function getAnswerbyCall(id: string, call: string) {
    const prospect = await Prospects.findById(id);
    const index = prospect.calls.findIndex((element: { date: string; }) => element.date === call);
    return prospect.calls[index].answer;
}

export async function updateProspectRDV(id: string | undefined, data: { date: string; time: string, status: string, idAdvisor?: string }, revalidate: boolean = true) {
    let prospect = await Prospects.findById(id);
    const index = prospect.rdv.findIndex((element: { date: string; }) => element.date === `${data.date} ${data.time}`);
    if (index !== -1) {
        prospect.rdv[index].status = data.status;
        await Prospects.findByIdAndUpdate(id, prospect);
    } else {
        prospect.rdv.push({ date: `${data.date} ${data.time}`, status: data.status, idAdvisor: data.idAdvisor });
        await prospect.save();
    }

    if (revalidate) {
        revalidatePath("/prospects");
        revalidatePath("/");
    }
}

export async function updateProspect(id: string | undefined, data: ProspectsItem) {
    await Prospects.findByIdAndUpdate(id, data);
    revalidatePath("/prospects");
    revalidatePath("/");
}

export async function updateStatusCall(id: string, call: string, status: string) {
    let prospect = await Prospects.findById(id);
    const index = prospect.calls.findIndex((element: { date: string; }) => element.date === call);
    prospect.calls[index].status = status;
    await Prospects.findByIdAndUpdate(id, prospect);
    revalidatePath("/prospects");
    revalidatePath("/");
}

export async function getProspectbyID(id: string): Promise<ProspectsItem> {
    const data = await Prospects.findById(id);
    return JSON.parse(JSON.stringify(data));
}

export async function getProspect(value: any) {
    const data = await Prospects.findOne(value);
    return JSON.parse(JSON.stringify(data));
}

export async function getProspectbyPhone(phone: string): Promise<ProspectsItem> {
    const data = await Prospects.findOne({ $or: [{ phone1: phone }, { phone2: phone }] });
    return JSON.parse(JSON.stringify(data));
}

export async function getProspectsbyCity(city: string): Promise<ProspectsItem[]> {
    const data = await Prospects.find({ city: city });
    return JSON.parse(JSON.stringify(data));
}

export async function getProspectsWithPagination(filter? : any) {
    
    const {   
        status,
        search,
        page,
        sort,
        value,
        region,
        departement,
        arrondissement,
        city,
        iris_code,
    } = filter || {};

    const itemPerPage = +filter?.itemPerPage ?? 10;

    const constraints = [];

    if(search){
        constraints.push({
            $or: [
                { lastName: { $regex: search, $options: "i" } },
                { firstName: { $regex: search, $options: "i" } },
                { phone1: { $regex: search, $options: "i" } },
                { phone2: { $regex: search, $options: "i" } },
                { mobile1: { $regex: search, $options: "i" } },
                { mobile2: { $regex: search, $options: "i" } },
            ]
        })
    }
    if (region !== "Tout") {
        constraints.push({region});
    }
    if (departement !== "Tout") {
        constraints.push({departement});
    }
    if (arrondissement !== "Tout") {
        constraints.push({arrondissement});
    }
    if (city !== "Tout") {
        constraints.push({city});
    }
    if (iris_code !== "Tout") {
        constraints.push({iris: iris_code});
    }
    if (status !== "Tout") {
        constraints.push({status});
    }
    let sortBy: any = {};
    if (sort !== "" && value !== "") {
        sortBy = { [value]: sort };
    }

    let request : any = constraints?.length > 0 ? {$and : constraints} : {};

    // Pagination
    const start = (Number(page) - 1) * itemPerPage;

    const total = await Prospects.count(request);
    const data = await Prospects.find(request,null, {skip: start}).sort(sortBy).limit(itemPerPage);
    const totalPage = Math.ceil(total / itemPerPage);

    const result = {
        totalPage,
        data
    }

    return JSON.parse(JSON.stringify(result));
}

export async function getProspectsFilter(
        prospects: (ProspectsItem[] | null), 
        filter : {
            status: string, 
            search: string, 
            page: string, 
            sort: string, 
            value: string, 
            itemPerPage: string, 
            region: string, 
            departement: string, 
            arrondissement: string, 
            city: string, 
            iris_code: string
        }
    ): Promise<{ prospects: ProspectsItem[], totalPage: number }> {
    let sortBy: any = {};

    if(!prospects) JSON.parse(JSON.stringify({ prospects: [], totalPage: 1 }));

    const {   
        status,
        search,
        page,
        sort,
        value,
        itemPerPage,
        region,
        departement,
        arrondissement,
        city,
        iris_code,
    } = filter;

    if (sort !== "" && value !== "") {
        sortBy = { [value]: sort };
    }

    console.log("Search :: ",search);

    let data = search ? await Prospects.find({
        $or: [
            { lastName: { $regex: search, $options: "i" } },
            { firstName: { $regex: search, $options: "i" } }
        ]
    }).sort(sortBy) : prospects ? prospects : [];


    // let data = await Prospects.find({
    //     $or: [
    //         { lastName: { $regex: search, $options: "i" } },
    //         { firstName: { $regex: search, $options: "i" } }
    //     ]
    // }).sort(sortBy);


    if (region !== "Tout") {
        data = data.filter((prospect: ProspectsItem) => prospect.region === region);
    }
    if (departement !== "Tout") {
        data = data.filter((prospect: ProspectsItem) => prospect.departement === departement);
    }
    if (arrondissement !== "Tout") {
        data = data.filter((prospect: ProspectsItem) => prospect.arrondissement === arrondissement);
    }
    if (city !== "Tout") {
        data = data.filter((prospect: ProspectsItem) => prospect.city === city);
    }
    if (iris_code !== "Tout") {
        data = data.filter((prospect: ProspectsItem) => prospect.iris === iris_code);
    }
    if (status !== "Tout") {
        data = data.filter((prospect: ProspectsItem) => GetLastRDV(prospect.rdv)?.status === status);
    }

    const totalPage = Math.ceil(data.length / parseInt(itemPerPage));
    const start = (Number(page) - 1) * parseInt(itemPerPage);
    const end = start + parseInt(itemPerPage);
    data = data.slice(start, end);

    const res = { prospects: data, totalPage: totalPage };

    return JSON.parse(JSON.stringify(res));
}

// export async function getProspectsFilter(prospects: (ProspectsItem[] | null), filter : {status: string, search: string, page: string, sort: string, value: string, itemPerPage: string, region: string, departement: string, arrondissement: string, city: string, iris_code: string}): Promise<{ prospects: ProspectsItem[], totalPage: number }> {
//     let sortBy: any = {};

//     if(!prospects) JSON.parse(JSON.stringify({ prospects: [], totalPage: 1 }));

//     const {   
//         status,
//         search,
//         page,
//         sort,
//         value,
//         itemPerPage,
//         region,
//         departement,
//         arrondissement,
//         city,
//         iris_code,
//     } = filter;

//     if (sort !== "" && value !== "") {
//         sortBy = { [value]: sort };
//     }
//     let data = await Prospects.find({
//         $or: [
//             { lastName: { $regex: search, $options: "i" } },
//             { firstName: { $regex: search, $options: "i" } }
//         ]
//     }).sort(sortBy);
//     if (region !== "Tout") {
//         data = data.filter((prospect: ProspectsItem) => prospect.region === region);
//     }
//     if (departement !== "Tout") {
//         data = data.filter((prospect: ProspectsItem) => prospect.departement === departement);
//     }
//     if (arrondissement !== "Tout") {
//         data = data.filter((prospect: ProspectsItem) => prospect.arrondissement === arrondissement);
//     }
//     if (city !== "Tout") {
//         data = data.filter((prospect: ProspectsItem) => prospect.city === city);
//     }
//     if (iris_code !== "Tout") {
//         data = data.filter((prospect: ProspectsItem) => prospect.iris === iris_code);
//     }
//     if (status !== "Tout") {
//         data = data.filter((prospect: ProspectsItem) => GetLastRDV(prospect.rdv)?.status === status);
//     }

//     const totalPage = Math.ceil(data.length / parseInt(itemPerPage));
//     const start = (Number(page) - 1) * parseInt(itemPerPage);
//     const end = start + parseInt(itemPerPage);
//     data = data.slice(start, end);

//     const res = { prospects: data, totalPage: totalPage };

//     return JSON.parse(JSON.stringify(res));
// }

export async function getCallbyidUser(idUser: string) {
    const data = await Prospects.find({ "calls.idUser": idUser });
    const res = data.map((prospect: ProspectsItem) => {
        const calls = prospect.calls.filter((item: any) => item.idUser === idUser);
        return { calls: calls };
    });
    return res;
}

const getApiUrlFromProspect = (prospect: ProspectsItem | null) => {

    const key = process.env.NODE_ENV === "development" ?
        'API_ERP_URL_DEV' :
        prospect?.erpReference ? `API_ERP_URL_${prospect?.erpReference.toUpperCase()}` : '';

    return process.env[key];
}


export const invalidateLogByProspectId = async (prospectId : string | undefined)=>{
    await Logs.updateMany({ "data.prospectId" : prospectId},{isLast : false});
}

// Gestion de l'ERP
// { date: '2023-11-22', time: '10:35', status: '' }
export async function pushRDVToErp(prospectPhones: (String | undefined)[], prospect: (ProspectsItem | null), data: any) {

    const body = { data, prospect, prospectPhones };

    const API_ERP_URL = getApiUrlFromProspect(prospect);

    try{

        const response = await fetch(`${API_ERP_URL}/callcenter-updateProspectRdv`, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const result = await response.json();

        await invalidateLogByProspectId(prospect?._id);
        Logs.create({code : result.code || result.status, message : result.message, isLast:true, data : { prospectId : prospect?._id}});

    } catch (e) {

        Logs.create({code : "0000", message : "Impossible d'updater le prospect", isLast:true, data : { prospectId : prospect?._id}});
    }

    revalidatePath("/prospects");
    revalidatePath("/");

} 

export const getAlertByProspectId = async (prospectId : any) : Promise<any[]> =>{
    let logs = await Logs.find({"data.prospectId": prospectId, isLast : true});
    return JSON.parse(JSON.stringify(logs));
}