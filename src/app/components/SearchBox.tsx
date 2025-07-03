import React from 'react';
import { FaSearchLocation } from "react-icons/fa";
import { cn } from '../utils/cn';

type Props = {
    className?: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
    onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
}

export default function SearchBox(props: Props) {
    return (
        <form onSubmit={props.onSubmit} className={cn("flex relative items-center justify-center h-10", props.className)}>
            <input type="text" value={props.value} onChange={props.onChange} placeholder="Search for a city..." className="px-4 py-2 w-[230px] border border-gray-300 rounded-1-md focus:outline-none focus:ring-blue-500" />
            <button className="px-4 py-[9px] bg-blue-500 text-white rounded-r-md focus: outline-none hover:text-blue-800 h-full" >
                <FaSearchLocation />
            </button>
        </form>
    )
}