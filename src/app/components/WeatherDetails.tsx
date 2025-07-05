import React from 'react';
import { PiEyes } from "react-icons/pi";
import { GiDroplets, GiWindsock } from "react-icons/gi";
import { ImMeter2 } from "react-icons/im";
import { FiSunrise, FiSunset } from "react-icons/fi";

export interface WeatherDetailProps {
    visibility: string;
    humidity: string;
    windSpeed: string;
    airPressure: string;
    sunrise: string;
    sunset: string;
}

export default function WeatherDetails(props: WeatherDetailProps){
    // Default values for the props
    const {
        sunrise = "Error",
        visibility = "Error",
        humidity = "Error",
        windSpeed = "Error",
        airPressure = "Error",
        sunset = "Error"
    } = props;

    return (
        <>
            <SingleWeatherDetail
                icon={<FiSunrise />}
                information="Sunrise"
                value={props.sunrise}
            />
            <SingleWeatherDetail
                icon={<PiEyes />}
                information="Visibility"
                value={visibility}
            />
            <SingleWeatherDetail
                icon={<GiDroplets />}
                information="Humidity"
                value={humidity}
            />
            <SingleWeatherDetail
                icon={<GiWindsock />}
                information="Wind Speed"
                value={windSpeed}
            />
            <SingleWeatherDetail
                icon={<ImMeter2 />}
                information="Air Pressure"
                value={airPressure}
            />
            <SingleWeatherDetail
                icon={<FiSunset />}
                information="Sunset"
                value={sunset}
            />
        </>
    )
}

export interface SingleWeatherDetailProps {
    information: string;
    icon: React.ReactNode;
    value: string;
}

function SingleWeatherDetail(props: SingleWeatherDetailProps) {
    return (
        <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80">
            <p className='whitespace-nowrap'>{props.information}</p>
            <div className="text-3xl">{props.icon}</div>
            <p>{props.value}</p>
        </div>
    )
}