'use client'

import CardAddUtilisateur from "./CardAddUtilisateur";
import CardUsers from "./CardUsers";

export default function PageUtilisateur() {
    return (
        <div className="w-full flex flex-col h-full p-5">
            <div className="w-3/12 self-center pb-5">
                <CardAddUtilisateur />
            </div>
            <CardUsers />
        </div>
    );
}
