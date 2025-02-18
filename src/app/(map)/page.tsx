'use client'

import Map from "@/components/Map";
import SideBar from "./Sidebar";

export default function mapPage() {

    return (
        <div className="flex h-full w-full">
            {/* {<SideBar/>} */}
            <Map />
        </div>
    )
}
