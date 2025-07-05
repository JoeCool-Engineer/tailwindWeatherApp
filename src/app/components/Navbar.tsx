'use client';

import React, { useState } from 'react';
import { IoSunnySharp } from "react-icons/io5";
import { MdMyLocation } from "react-icons/md";
import { MdOutlineLocationOn } from "react-icons/md";
import SearchBox from './SearchBox';
import axios from 'axios';
import { useAtom } from 'jotai';
import { loadingCityAtom, placeAtom } from '../atom';
import { set } from 'date-fns';


type Props = { location?: string}

const API_Key = process.env.NEXT_PUBLIC_WEATHER_KEY;

export default function Navbar({ location }: Props) {
    const [city, setCity] = useState('');
    const [error, setError] = useState('');

    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [place, setplace] = useAtom(placeAtom);
    const [_, setLoadingCity] = useAtom(loadingCityAtom);

    async function handleInputChange(value: string) {
        setCity(value);
        if (value.length >=3) {
            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_Key}`
                );

                const suggestions = response.data.list.map((item: any) => item.name);
                setSuggestions(suggestions);
                setError('');
                setShowSuggestions(true);
            } catch (err) {
                setSuggestions([]); 
                setShowSuggestions(false);   
            }
        }
        else {
            setSuggestions([]);
            setShowSuggestions(false);
        }   
    }

    function handleSuggestionClick(value: string) {
        setCity(value);
        setShowSuggestions(false);
    }

    function handleCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    setLoadingCity(true);
                    // Fetch the weather data for the current location
                    const response = await axios.get(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_Key}`
                    );
                    setTimeout(() => {
                        setLoadingCity(false);
                        setplace(response.data.name);
                    }, 500);
                } catch (error) {
                    setError('Unable to fetch weather data for your location.');
                    setLoadingCity(false);
                }
            });
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    }

// Timeout for the Skeleton loading is set to 500ms 
    function handleSubmissionSearch(e: React.FormEvent<HTMLFormElement>) {
        setLoadingCity(true);
        e.preventDefault();
        if (suggestions.length == 0) {
            setError('No suggestions available');
            setLoadingCity(false);
            return;
        } 
        else {
            setError('');
            setTimeout(() => {
                        setLoadingCity(false);
                        setplace(city);
                        setShowSuggestions(false);
                   }, 500);
            }
    }

    return (
        <>
        <nav className="shadow-sm sticky top-0 z-50 bg-white">
            <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">                
                <p className="flex items-center justify-center gap-2 ">
                    <h2 className="text-gray-500 text-3xl">Weather</h2>
                    <IoSunnySharp className="text-3xl mt-1 text-yellow-500"/>
                </p>
                {/* */}
                <section className="flex gap-2 items-center">
                    <MdMyLocation 
                        title="Your Current Location"
                        onClick={handleCurrentLocation}
                        className="text-2xl text-gray-500 hover:opacity-70 cursor-pointer" />
                    <MdOutlineLocationOn className="text-3xl hover:opacity-70"/>
                    <p className="text-slate-900/80 text-sm ">{location}</p>
                    <div className="relative hidden md:flex">
                        {/* SearchBox */}

                        <SearchBox 
                            value={city} 
                            onChange={(e) => {handleInputChange(e.target.value);}}
                            onSubmit={(handleSubmissionSearch)} 
                        />
                        <SuggestionBox
                            {...{
                                suggestions,
                                showSuggestions,
                                handleSuggestionClick,
                                error
                            }}
                        
                        />
                    </div>
                </section>
            </div>
        </nav>
        <section className='flex max-w-7xl px-3 md:hidden'> 
        <div className="relative">
            {/* SearchBox */}

            <SearchBox 
                value={city} 
                onChange={(e) => {handleInputChange(e.target.value);}}
                onSubmit={(handleSubmissionSearch)} 
            />
            <SuggestionBox
                {...{
                    suggestions,
                    showSuggestions,
                    handleSuggestionClick,
                    error
                }}
                        
            />
        </div>
        </section>
        </>
    );
}   

function SuggestionBox ({
    suggestions,
    showSuggestions,
    handleSuggestionClick,
    error
}: {
    showSuggestions: boolean;
    suggestions: string[];
    handleSuggestionClick: (suggestion: string) => void;
    error?: string;
}) {
    return (
        <>
            { ((showSuggestions && suggestions.length > 1) || error) && (
                <ul className = 'mb-4 bg-white absolute border top-[40px] left-0 border-gray-300 rounded-md min-w-[200px] flex flex-col gap-1 py-2 px-2'>
                    {error && suggestions.length < 1 && (
                        <li className='text-red-500 p-1'> {error}</li>
                    )}
                    {suggestions.map((item, i) => (
                        <li 
                        key={i}
                        onClick ={() => handleSuggestionClick(item)}
                        className='cursor-pointer p-1 rounded hover:bg-gray-200'>
                            {item}
                        </li>
                    ))}                    
                </ul>
            )}
        </>
    )
}