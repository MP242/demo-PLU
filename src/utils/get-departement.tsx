import { cache } from "react";
import { getDepartementbyRegion } from "@/action/ManageGeoJson";

export const getDepartementbyRegionCache = cache(async (region: string) => {
    return await getDepartementbyRegion(region);
})
