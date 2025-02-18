'use client'

import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { FaTable, FaFileUpload, FaRegCalendarAlt, FaPowerOff, FaMapMarkedAlt } from "react-icons/fa";
import { BiUserCircle } from "react-icons/bi";
import { IoEarthOutline } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { PiArrowCircleLeftBold } from "react-icons/pi";
import { useState } from "react";
import Link from "next/link";

interface SideBarProps {
}

const SideBar = ({ }: SideBarProps) => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);


    const sidebarPages = ['/dashboard', '/utilisateur', '/prospects', '/integration', '/rdv'];

    return (
        <div className="h-full">
            {sidebarPages.includes(pathname || '') &&
                <div className={`${isOpen ? "w-56" : "w-20"} text-white bg-neutral flex text-lg font-medium flex-col justify-between items-center transition-all ease-in-out h-full p-3`}>
                    <PiArrowCircleLeftBold onClick={() => setIsOpen(!isOpen)} className={`${isOpen ? "self-end " : "self-center rotate-180"} text-2xl hover:cursor-pointer`} />
                    <ul className="menu menu-lg rounded-box p-0 m-0 space-y-4 relative w-full">
                        {/*<li key={0}>
                            <a
                                data-cy={'dashboard'}
                                href={'dashboard'}
                                className={`font-bold text-white self-center w-full hover:bg-primary-content ${pathname?.includes('dashboard') ? 'bg-primary-focus' : ''}`}>
                                <MdDashboard />Dashboard
                            </a>
                        </li>
                        */}

                        <li key={1} className="w-full relative p-0">
                            <Link
                                data-cy={'prospects'}
                                href={'prospects'}
                                className={`${isOpen ? "justify-start" : "justify-center px-2"} flex !max-h-10 min-h-[40px] gap-4 transition ease-in-out items-center self-center active:text-base-100 text-white w-full ${pathname?.includes('prospects') ? "bg-primary hover:bg-accent"
                                : ""}`}>
                                <FaTable />
                                {isOpen && <p>Tableau</p>}
                            </Link>
                        </li>
                        <li key={2} className="w-full relative p-0">
                        <Link
                                data-cy={'integration'}
                                href={'integration'}
                                className={`${isOpen ? "justify-start" : "justify-center px-2"} flex !max-h-10 min-h-[40px] gap-4 transition ease-in-out items-center self-center active:text-base-100 text-white w-full ${pathname?.includes('integration') ? "bg-primary hover:bg-accent"
                                : ""}`}>
                                <FaFileUpload />
                                {isOpen && <p>Intégration</p>}
                            </Link>
                        </li>
                        <li key={3} className="w-full relative p-0">
                            <Link
                                data-cy={'rdv'}
                                href={'rdv'}
                                className={`${isOpen ? "justify-start" : "justify-center px-2"} flex !max-h-10 min-h-[40px] gap-4 transition ease-in-out items-center self-center active:text-base-100 text-white w-full ${pathname?.includes('rdv') ? "bg-primary hover:bg-accent"
                                : ""}`}>
                                <FaRegCalendarAlt />
                                {isOpen && <p>Rendez-vous</p>}
                            </Link>
                        </li>
                        <li key={4} className="w-full relative p-0">
                            <Link
                                data-cy={'utilisateur'}
                                href={'utilisateur'}
                                className={`${isOpen ? "justify-start" : "justify-center px-2"} flex !max-h-10 min-h-[40px] gap-4 transition ease-in-out items-center self-center active:text-base-100 text-white w-full ${pathname?.includes('utilisateur') ? "bg-primary hover:bg-accent"
                                : ""}`}>
                                <BiUserCircle/>
                                {isOpen && <p>Utilisateur</p>}
                            </Link>
                        </li>
                        <li key={5} className="w-full relative p-0">
                            <Link
                                data-cy={'map'}
                                href={'map'}
                                className={`${isOpen ? "justify-start" : "justify-center px-2"} flex !max-h-10 min-h-[40px] gap-4 transition ease-in-out items-center self-center active:text-base-100 text-white w-full ${pathname?.includes('map') ? "bg-primary hover:bg-accent"
                                : ""}`}>
                                {/* <IoEarthOutline /> */}
                                <FaMapMarkedAlt/>
                                {isOpen && <p>map</p>}
                            </Link>
                        </li>
                    </ul>
                    {/* <button
                        data-cy="logout"
                        onClick={() => signOut()}
                        className="btn btn-primary w-full font-semibold p-2">
                        <FaPowerOff size={30} className="w-full text-xl"/>
                        {isOpen ? <span className="text-base-100">Déconnexion</span> : ""}
                    </button> */}

                    <button data-cy="logout" onClick={() => signOut()} className="h-10 text-base-100 min-h-0 p-2 truncate line-clamp-1 bg-primary flex justify-center items-center btn btn-primary border-primary btn-block">{isOpen ? <p>Déconnexion</p> : <FaPowerOff className="w-5 h-5" />}</button>
                </div>
            }
        </div>
    );
}

export default SideBar;
