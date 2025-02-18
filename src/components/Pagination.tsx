'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Select from 'react-select';

interface PaginationProps {
    totalPage: number | null;
}

const Pagination = ({ totalPage }: PaginationProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        const params = new URLSearchParams(searchParams?.toString());
        const page = params.get("page");
        if (page) {
            setPage(parseInt(page));
        }
    }, [searchParams]);

    function handlePageChange(page: number) {
        setPage(page);
        const params = new URLSearchParams(searchParams?.toString());
        params.set("page", page.toString());
        router.replace(`?${params.toString()}`)
    }

    return (
        <div className="my-2 gap-4 join flex items-center justify-center">
            {totalPage &&
                <>
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="btn btn-md flex justify-center items-center text-2xl btn-primary disabled:opacity-50 rounded-lg disabled:text-base-100"
                    >
                        «
                    </button>
                    <Select
                        menuPlacement="top"
                        value={{ value: page, label: page.toString() + " / " + totalPage.toString() }}
                        className="text-sm"
                        options={Array.from(Array(totalPage).keys()).map((i) => ({ value: i + 1, label: (i + 1).toString() }))}
                        onChange={(e) => handlePageChange(e?.value as number)}
                    />
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= totalPage}
                        className="btn btn-md flex justify-center items-center text-2xl btn-primary disabled:opacity-50 rounded-lg disabled:text-base-100"
                    >
                        »
                    </button>
                </>
            }
        </div>
    )
}

export default Pagination;
