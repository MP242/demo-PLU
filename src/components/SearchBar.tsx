'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";

interface SearchBarProps {
}

const SearchBar: React.FC<SearchBarProps> = () => {
    const [search, setSearch] = useState<string>("");
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    function handleSearch(search : string) {
        const params = new URLSearchParams(searchParams?.toString());
        const value = search as string;
        setSearch(value);
        params.set("search", value);
        params.set("page", "1");
        router.replace(`?${params.toString()}`);
    }

    const debouncedHandleSearch = useMemo(()=>debounce(handleSearch, 1000),[]);

    useEffect(() => {
        const search = searchParams?.get("search");
        setSearch(search ?? "");
    }, [searchParams]);

    const processSearch = (e : any)=>{
        setSearch(e.target.value);
        debouncedHandleSearch(e.target.value)
    }

    return (
        <form
            data-cy="searchComponent">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 ">
                    <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <input
                    value={search ?? ""}
                    data-cy="search"
                    onChange={e=>processSearch(e)}
                    type="search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50" placeholder="Rechecher" />
            </div>
        </form>
    )
}

export default SearchBar
