import React from 'react';
import Container from './Container';
import WeatherIcon from './WeatherIcon';
import WeatherDetails, { WeatherDetailProps } from './WeatherDetails';

export interface ForecastWeatherDetailProps extends WeatherDetailProps{
    weatherIcon: string;
    date: string;
    day: string;
    temp: number;
    feelsLike: number;
    temp_min: number;
    temp_max: number;
    description: string;

}

export default function ForecastWeatherDetail(props: ForecastWeatherDetailProps) {
    const {
        weatherIcon = 'Error',
        date = 'Error',
        day = 'Error',
        temp = 0,
        feelsLike = 0,
        temp_min = 'Error',
        temp_max = 'Error',
        description = 'Error',
        sunrise = 'Error',
        sunset = 'Error',
    } = props;
    return (
        <Container className='bg-blue-300/80 gap-4'>
            {/* Left Section */}

            <section className='flex gap-4 items-center px-4'>
                {/* Date and Time */}

                <div className='flex flex-col gap-1 items-center'>
                    <WeatherIcon iconName={weatherIcon}/>
                    <p>{date}</p>
                    <p className='text-sm'>{day}</p>
                </div>
                {/* Temperature Details */}

                <div className='flex flex-col px-4 items-center justify-center text-center'>
                    <span className='text-5xl'>{Math.round(temp ?? 0)}°</span>
                    <p className='text-xs space-x-1 whitespace-nowrap'>
                        <span> Feels like</span>
                        <span>{Math.round(feelsLike ?? 0)}°</span>
                    </p>
                    <p className='capitalize'>
                        {description}
                    </p>
                </div>
            </section>

            {/* Right Section */}
            <section className='overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10'>
                <WeatherDetails {...props} />
            </section>
        </Container>
    );
}