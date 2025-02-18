'use server'

export const getUrlAPI = (erpReference : (String|undefined))=>{

    let url;
    if(process.env.NODE_ENV === 'production'){
        url = process.env[`API_ERP_URL_${erpReference ? erpReference.toUpperCase() : "REUNION"}`]
    }else{
        url = process.env.API_ERP_URL_DEV
    }

    return url;
}

export async function getAdvisors(erpReference : (String|undefined)) {
    const url = getUrlAPI(erpReference);
    const response = await fetch(`${url}/callcenter-getAllAdvisor`);
    const {data} = await response.json();

    return data;
}