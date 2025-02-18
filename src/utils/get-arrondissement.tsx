import { cache } from "react";
import { getArrondissementDepartement } from "@/action/ManageGeoJson";

export const getArrondissementDepartementCache = cache(async (departement: string) => {
    return await getArrondissementDepartement(departement);
})
