import { cache } from "react";
import { getQuartiersbyArrondissement, getQuatierbyCity } from "@/action/ManageGeoJson";

export const getQuartiersbyArrondissementCache = cache(async (arrondissement: string) => {
    return await getQuartiersbyArrondissement(arrondissement);
})

export const getQuatierbyCityCache = cache(async (city: string) => {
    return await getQuatierbyCity(city);
})

