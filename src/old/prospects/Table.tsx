'use client'

import { useRouter, useSearchParams } from "next/navigation";
import Drawer from "./Drawer";
import { useEffect, useState } from "react";
import TableRow from "./TableRow";
import Pagination from "../../components/Pagination";
import TableHeader from "./TableHeader";
import { ProspectsItem } from "@/type";
import { getProspectbyID } from "@/action/ManageProspect";
import TableSkeleton from "./TableSkeleton";

interface TableProps {
  Header: Array<{ title: string; sort: boolean; value: string }>;
  Prospect: ProspectsItem[] | null;
  totalPage: number;
  isPending: boolean;
}

const Table = ({ Header, Prospect, totalPage, isPending }: TableProps) => {
  
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<ProspectsItem | null>(null);;

  useEffect(() => {
    const newData = Prospect?.filter((item) => item._id === data?._id)[0] ?? null;
    setData(newData);
  }, [Prospect]);

  useEffect(() => {
    async function fetchData() {

      const id = searchParams?.get("id");
      const drawer = searchParams?.get("drawer");
      if (id && drawer) {
        setIsOpen(true);
        // Par défaut c'est un prospect du tableau donc dans la liste Prospect Je ne requête pas la base de données
        // Sinon on traite une erreur
        // const prospect = await getProspectbyID(id ?? "");
        const prospect = Prospect?.find((prospect) => prospect._id === id) ?? null;
        setData(prospect);
      } else {
        setIsOpen(false);
      }
    }
    fetchData();
  }, [searchParams]);

  function handleOpen(boolean: boolean, id: string) {
    setIsOpen(boolean);
    const params = new URLSearchParams(searchParams?.toString());
    params.set("conf", "Calls");
    params.set("id", id);
    params.set("drawer", "true")
    router.replace(`?${params.toString()}`);
  }

  function handleClose(boolean: boolean) {
    setIsOpen(boolean);
    const params = new URLSearchParams(searchParams?.toString());
    params.delete("id");
    params.delete("drawer");
    params.delete("conf");
    router.replace(`?${params.toString()}`);
  }

  return (
    <div className="flex flex-col">
      <div data-cy="tableau" className="container mx-auto overflow-y-auto">
        <table className="table">
          <TableHeader Header={Header} />
          {isPending ? (
            <TableSkeleton totalRow={Header.length} />
          ) :
            <TableRow data={Prospect} setIsOpen={handleOpen} />
          }
        </table>
        <Drawer isOpen={isOpen} setIsOpen={handleClose} prospect={data} />
      </div>
      <div className="self-center">
        <Pagination totalPage={totalPage} />
      </div>
    </div>
  );
};

export default Table;
