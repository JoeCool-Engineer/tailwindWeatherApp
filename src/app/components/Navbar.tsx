import React from 'react';
import { IoSunnySharp } from "react-icons/io5";
import { MdMyLocation } from "react-icons/md";
import { MdOutlineLocationOn } from "react-icons/md";
import SearchBox from './SearchBox';

type Props = {}

export default function Navbar({}: Props) {
    return (
        <nav className="shadow-sm sticky top-0 z-50 bg-white">
            <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">                
                <p className="flex items-center justify-center gap-2 ">
                    <h2 className="text-gray-500 text-3xl">Weather</h2>
                    <IoSunnySharp className="text-3xl mt-1 text-yellow-500"/>
                </p>
                {/* */}
                <section className="flex gap-2 items-center">
                    <MdMyLocation className="text-2xl text-gray-500 hover:opacity-70 cursor-pointer" />
                    <MdOutlineLocationOn className="text-3xl hover:opacity-70"/>
                    <p className="text-slate-900/80 text-sm ">Chandler</p>
                    <div>{/* SearchBox */}
                        <SearchBox value={''} onChange={undefined} onSubmit={undefined} />
                    </div>
                </section>
            </div>
        </nav>
    );
}   