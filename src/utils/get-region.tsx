import { cache } from "react";
import { getRegion } from "@/action/ManageGeoJson";

export const getRegionCache = cache(async () => {
    return await getRegion();
});
