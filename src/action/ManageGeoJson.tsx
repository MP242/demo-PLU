'use server'

import client from '@/database/Mongodb';

export async function getQuatierbyCity(value: string) {
    const collection = client.db('GeoJson-France').collection(value);
    const result = await collection.find().toArray();
    const quartier = result.map((item) => {
        return {
            ...item,
            _id: item._id.toString(),
            properties: {
                ...item.properties,
                level: item?.properties?.level ?? 'quartier'
            }
        }
    })
    return quartier;
}

export async function getQuartiersbyArrondissement(value: string) {
    const collection = client.db('GeoJson-France').collection(value);
    const result = await collection.find().toArray();
    const quartier = result.map((item) => {
        return {
            ...item,
            _id: item._id.toString(),
            properties: {
                ...item.properties,
                level: item?.properties?.level ?? 'quartier'
            }
        }
    })
    return quartier;
}

export async function getArrondissementDepartement(value: string) {
    const collection = client.db('GeoJson-France').collection(value);
    const result = await collection.find().toArray();
    const arrondissement = result.map((item) => {
        return {
            ...item,
            _id: item._id.toString(),
            properties: {
                ...item.properties,
                level: 'arrondissement'
            }
        }
    })
    return arrondissement;
}

export async function getDepartementbyRegion(value: string) {
    const collection = client.db('GeoJson-France').collection(value);
    const result = await collection.find().toArray();
    const departement = result.map((item) => {
        return {
            ...item,
            _id: item._id.toString(),
            properties: {
                ...item.properties,
                level: 'departement'
            }
        }
    })
    return departement;
}

export async function getRegion() {
    const collection = client.db("GeoJson-France").collection('Region');
    const result = await collection.find().toArray();
    const region = result.map((item) => {
        return {
            ...item,
            _id: item._id.toString(),
            properties: {
                ...item.properties,
                level: 'region'
            }
        }
    })
    return region;
}
