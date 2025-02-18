'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { PiEqualsThin } from 'react-icons/pi'
import { useEffect, useState } from 'react'
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai'

interface TableHeaderProps {
    Header: Array<{ title: string; sort: boolean; value: string }>;
}

const TableHeader = ({ Header }: TableHeaderProps) => {
    const [sort, setSort] = useState<string>("");
    const [value, setValue] = useState<string>("");
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const params = new URLSearchParams(searchParams?.toString());
        const sort = params.get("sort") as string;
        const value = params.get("value") as string;
        setSort(sort);
        setValue(value);
    }, [searchParams]);

    function handleSort(value: string) {
        const params = new URLSearchParams(searchParams?.toString());
        const sort = params.get("sort") as string;
        const valueParam = params.get("value") as string;
        params.set("page", "1");
        if (valueParam === value) {
            if (sort === "asc") {
                params.set("sort", "desc");
            } else {
                params.set("sort", "asc");
            }
        } else {
            params.set("value", value);
            params.set("sort", "asc");
        }

        router.replace(`?${params.toString()}`);
    }

    return (
        <thead>
            <tr className="text-lg text-primary">
                {Header?.map((item, index) => (
                    <th key={index}>
                        {item.title}
                        {item.sort && (
                            <button
                                data-cy={`sort-${item}`}
                                className="ml-2 text-sm"
                                onClick={() => handleSort(item.value)}>
                                {item.value === value && sort === "asc" && <AiOutlineArrowUp />}
                                {item.value === value && sort === "desc" && <AiOutlineArrowDown />}
                                {item.value !== value && <PiEqualsThin />}
                            </button>
                        )}
                    </th>
                ))}
            </tr>
        </thead>
    )
}

export default TableHeader
