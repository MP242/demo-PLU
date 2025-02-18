'use client'

import { useState } from "react";

interface CollapseProps {
    title: any;
    children: any;
    DefautlOpen?: boolean;
}

const Collapse = ({ title, children, DefautlOpen }: CollapseProps) => {
    const [isOpen, setIsOpen] = useState(DefautlOpen);

    return (
        <div className="p-4 rounded-xl bg-base-200">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <h2 className="text-lg font-bold text-primary">{title}</h2>
                <span className="text-gray-600">{isOpen ? '▲' : '▼'}</span>
            </div>
            {isOpen && <div className="mt-4">{children}</div>}
        </div>
    );
};



export default Collapse
