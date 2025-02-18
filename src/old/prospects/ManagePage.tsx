'use client'

import { getProspectsFilter, getProspectsWithPagination } from "@/action/ManageProspect";
import { useRouter, useSearchParams } from "next/navigation";
import Table from "@/app/prospects/Table"
import SearchBar from "@/components/SearchBar";
import MySelect from "@/components/Select";
import { ProspectsItem } from "@/type";
import { useState, useEffect, useTransition } from "react";
import BrowserLocalisation from "@/components/BrowserLocalisation";
import {useRefreshStore} from "@/stores/refreshStore";

const OptionStatus = [
    "Tout",
    "Signé",
    "Fait",
    "Annulé",
    "Reporté",
]

interface ManagePageProps {
    Prospects?: ProspectsItem[] | null;
    Header: Array<{ title: string; sort: boolean; value: string }>;
    totalPage?: number;
}

const ManagePage = ({  Header}: ManagePageProps) => {
// const ManagePage = ({ Prospects, Header, totalPage : pageCount }: ManagePageProps) => {
    const [filter, setFilter] = useState<{ status: string, search: string, page: string, sort: string, value: string, itemPerPage: string, region: string, departement: string, arrondissement: string, city: string, iris_code: string }>
        ({ status: "", search: "", page: "", sort: "", value: "", itemPerPage: "", region: "", departement: "", arrondissement: "", city: "", iris_code: "" });
    const [isPending, startTransition] = useTransition();
    const [totalPage, setTotalPage] = useState<number | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [Body, setBody] = useState<ProspectsItem[] | null>(null);

    const {refresh} = useRefreshStore();

    useEffect(() => {
        async function fetch() {

            const status = searchParams?.get("status") || "Tout";
            const search = searchParams?.get("search") || "";
            const page = searchParams?.get("page") || "1";
            const sort = searchParams?.get("sort") || "";
            const value = searchParams?.get("value") || "";
            const itemPerPage = searchParams?.get("itemPerPage") || "10";
            const region = searchParams?.get("region") || "Tout";
            const departement = searchParams?.get("departement") || "Tout";
            const arrondissement = searchParams?.get("arrondissement") || "Tout";
            const iris_code = searchParams?.get("iris_code") || "Tout";
            const city = searchParams?.get("city") || "Tout";

            // if (filter.status === status && filter.search === search && filter.page === page && filter.sort === sort && filter.value === value && filter.itemPerPage === itemPerPage && filter.region === region && filter.departement === departement && filter.arrondissement === arrondissement && filter.iris_code === iris_code && filter.city === city) {
            //     console.log("ICI");
            //     const res = await getProspectsFilter(Prospects, {status, search, page, sort, value, itemPerPage, region, departement, arrondissement, city, iris_code});
            //     setBody(res.prospects);
            //     return;
            // } else {
            //     console.log("OU");
                
            // }
            setFilter({ status, search, page, sort, value, itemPerPage, region, departement, arrondissement, city, iris_code });

            startTransition(async () => {
                // console.log("LA");

                const filter = {status, search, page, sort, value, itemPerPage, region, departement, arrondissement, city, iris_code};

                let {data, totalPage} : {data: ProspectsItem[], totalPage: number} = await getProspectsWithPagination(filter);

                // const res = await getProspectsFilter(Prospects,filter);
                setTotalPage(totalPage);
                setBody(data);
            });
        }
        fetch();
    }, [searchParams, refresh]);

    function onChangeStatus(value: string) {
        const params = new URLSearchParams(searchParams?.toString());
        params.set("status", value);
        router.replace(`?${params.toString()}`);
    }


    return (
        <>
            <div className="w-4/12">
                <SearchBar />
            </div>
            <div className="self-end pb-2 flex items-center space-x-4">
                <div className="flex space-x-3 min-w-max">
                    <BrowserLocalisation />
                </div>
                <div>
                    <MySelect
                        size="md"
                        DefaultValue={searchParams?.get("itemPerPage") ?? "10"} options={["10", "20", "50"]} onChange={(value) => {
                            const params = new URLSearchParams(searchParams?.toString());
                            params.set("itemPerPage", value);
                            router.replace(`?${params.toString()}`);
                        }} />
                </div>
                <div>
                    <MySelect
                        size="md"
                        Description="Status RDV"
                        DefaultValue={searchParams?.get("status") ?? "Tout"} options={OptionStatus} onChange={onChangeStatus} />
                </div>
            </div>
            {Body &&
                <div>
                    <Table Header={Header} Prospect={Body} totalPage={totalPage ?? 0} isPending={isPending} />
                </div>
            }
        </>
    )
}

export default ManagePage
