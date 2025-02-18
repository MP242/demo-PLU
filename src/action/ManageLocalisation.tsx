'use server'

import client from "@/database/Mongodb"

export async function getRegions() {
    const collection = client.db("GeoJson-France").collection('Region-Name');
    const result = await collection.find().toArray();
    const region = result.map((item) => {
        return {
            ...item,
            _id: item._id.toString()
        }
    })
    return region;
}

export async function getRegionbyName(region: string) {
    const collection = client.db("GeoJson-France").collection('Region-Name');
    const result = await collection.findOne({ name: region });
    const regionName = {
        ...result,
        _id: result?._doc?._id.toString()
    }
    return regionName;
}

export async function getRegionbyDepartement(departement: string) {
    const collection = client.db("GeoJson-France").collection('Region-Name');
    const result = await collection.findOne({ departements: departement });
    const region = {
        ...result,
        _id: result?._doc?._id.toString()
    }
    return region;
}

export async function getDepartementByName(Name: string) {
    const collection = client.db("GeoJson-France").collection('Departement-Name');
    const result = await collection.findOne({name: Name});

    const departement = {
        ...result,
        _id: result?._doc?._id.toString()
    }
    return departement;
}

export async function getDepartementByzipCode(zipCode: string) {
    const collection = client.db("GeoJson-France").collection('Departement-Name');
    let result = await collection.find().toArray();
    result = result.filter((item: any) => zipCode.startsWith(item.num_dep));
    const departement = {
        ...result[0],
        _id: result[0]?._doc?._id.toString()
    }
    return departement;
}

export async function getQuartierByName(Name: string) {
    const collection = client.db("GeoJson-France").collection(Name);
    const result = await collection.find({}, { projection: { iris_code: 1, iris_name_lower: 1 } }).toArray();
    let quartier = result.map((item) => {
        return {
            iris_code: item.iris_code[0],
            quartier: item.iris_name_lower,
            _id: item._id.toString()
        }
    })
    quartier = quartier.filter((item, index, self) =>
        index === self.findIndex((t) => (
            t.iris_code === item.iris_code && t.quartier === item.quartier
        ))
    )
    return quartier;
}

export async function getArrondissementByName(Name: string) {
    const collection = client.db("GeoJson-France").collection("Arrondissement-Name");
    const result = await collection.findOne({ name: Name });
    const arrondissement = {
        ...result,
        _id: result?._doc?._id.toString()
    }
    return arrondissement;
}
