'use client';

import Image from "next/image";
import Navbar from "./components/Navbar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import format from "date-fns/format";
import { fromUnixTime, parseISO } from "date-fns";
import Container from "./components/Container";
import WeatherIcon from "./components/WeatherIcon";
import { getDayOrNightIcon } from "./utils/getDayOrNightIcon";
import WeatherDetails from "./components/WeatherDetails";
import { yardsToMiles } from "./utils/yardsToMiles";
import ForecastWeatherDetail from "./components/ForecastWeatherData";
import { loadingCityAtom, placeAtom } from "./atom";
import { useAtom } from "jotai";
import { use, useEffect } from "react";

type WeatherResponse = {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherEntry[];
  city: City;
};

type WeatherEntry = {
  dt: number;
  main: MainWeatherData;
  weather: WeatherDescription[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  sys: Sys;
  dt_txt: string;
};

type MainWeatherData = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
};

type WeatherDescription = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

type Clouds = {
  all: number;
};

type Wind = {
  speed: number;
  deg: number;
  gust: number;
};

type Sys = {
  pod: string;
};

type City = {
  id: number;
  name: string;
  coord: Coordinates;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
};

type Coordinates = {
  lat: number;
  lon: number;
};

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

export default function Home() {
  const [place, setplace] = useAtom(placeAtom);
  const [loadingCity, ] = useAtom(loadingCityAtom);
  
  const { isPending, error, data, refetch } = useQuery<WeatherResponse>({
    queryKey: ['repoData'],
    queryFn: async() => { 
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place},us&units=imperial&appid=${API_KEY}&cnt=56`
      );
      return data;
    }
  });

  // When user changes the place, refetch the data
  useEffect(() => {
    refetch();
  }, [place, refetch]);

  const firstData = data?.list[0];

  console.log('console data', data ?? '');
  console.log('console firstData', firstData ?? '');

  const uniqueDates = [
    ...new Set(data?.list.map(
      (entry) => new Date(entry.dt * 1000).toISOString().split('T')[0]
    )),
  ]

  // Filtering data to get the first entry after 6 AM for each unique date
  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split('T')[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6; // Only consider entries after 6 AM
    })
  });

  if (isPending) return (
    <div className='flex items-center min-h-screen justify-center'>
      <p className='animate-bounce'>Loading...</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar location={data?.city.name}/>
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* today's weather */}
        {loadingCity ? (<WeatherSkeleton />) :
        <>
        <section className="space-y-4">
          <div className="space-y-2">   
            <h2 className="flex gap-1 text-2xl items-end">
              <p> {format(parseISO(firstData?.dt_txt ??''), 'EEEE')} </p>
              <p> : {format(parseISO(firstData?.dt_txt ??''), 'MMM d, yyyy')}</p>
            </h2>
            <Container className='bg-blue-300/80 gap-10 px-6 items-center'>
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {Math.round(firstData?.main.temp ?? 0)}°
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  <span>Feels like</span>
                  <span>{Math.round(firstData?.main.feels_like ?? 0)}°</span>
                </p>
                <p className="text-xs space-x-2">
                  <span>
                    ↓{Math.round(firstData?.main.temp_min ?? 0)}° / ↑{Math.round(firstData?.main.temp_max ?? 0)}°
                  </span>
                </p>
              </div>
              {/* time and weather icon */}
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((d, i) => (
                  <div key={i} 
                        className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
                      <p className='whitespace-nowrap'>
                        {format(parseISO(d.dt_txt), 'h:mm a')}
                      </p>
                      {/* <WeatherIcon iconName={d.weather[0].icon} /> */}
                      <WeatherIcon iconName={getDayOrNightIcon(d.weather[0].icon, d.dt_txt)} />
                      <p>{Math.round(d?.main.temp ?? 0)}°</p>
                  </div>
                ))}
              </div>
            </Container>
          </div>
          <div className="flex gap-4">
            {/* Weather details left container */}
            
            <Container className="w-fit bg-blue-300/80 justify-center flex-col px-4 items-center">
              <p className="capitalize text-center">
                {firstData?.weather[0].description}{' '}
              </p>
              <WeatherIcon iconName={getDayOrNightIcon(firstData?.weather[0].icon ?? '', firstData?.dt_txt ?? '')} />
            </Container>
            {/* Weather details right container */}
            <Container className="w-full bg-blue-300/80 px-6 gap-4 justify-between overflow-x-auto">
                <WeatherDetails 
                  sunrise={format(fromUnixTime(data?.city.sunrise ?? 0), 'h:mm a')} 
                  visibility={`${Math.round(yardsToMiles(data?.list[0].visibility ?? 0))} miles`}  
                  humidity={`${data?.list[0].main.humidity}%`}
                  windSpeed={`${Math.round(data?.list[0].wind.speed ?? 0)} mph`}
                  airPressure={`${data?.list[0].main.pressure} hPa`}
                  sunset={format(fromUnixTime(data?.city.sunset ?? 0), 'h:mm a')}
                />
            </Container>
          </div>
        </section>
        {/* 5-day forecast */}
        <section className="flex w-full flex-col gap-4">
          <p className='text-2xl'>Forcast (5 Days)</p>
          {firstDataForEachDate.map((d, i) => (
          <ForecastWeatherDetail 
              key={i}
              description={d?.weather[0].description ?? 'Error'}
              weatherIcon={d?.weather[0].icon ?? 'Error'}
              date={format(parseISO(d?.dt_txt ?? ''), 'MMM d')}
              day={format(parseISO(d?.dt_txt ?? ''), 'EEEE')}
              feelsLike={d?.main.feels_like ?? 0}
              temp={d?.main.temp ?? 0}
              temp_min={d?.main.temp_min ?? 0}
              temp_max={d?.main.temp_max ?? 0}
              airPressure={`${d?.main.pressure} hPa`}
              humidity={`${d?.main.humidity}%`}
              visibility={`${Math.round(yardsToMiles(d?.visibility ?? 0))} miles`}
              windSpeed={`${Math.round(d?.wind.speed ?? 0)} mph`} sunrise={""} sunset={""}
            />
          ))}

        </section>

        </>
        }
      </main>
    </div>
  );  
  
}

function WeatherSkeleton() {
  return (
      <section className="space-y-8">
        {/* Today's weather skeleton */}
        <div className="space-y-2 animate-pulse">
          {/* Date and temperature row */}
            <div className="flex gap-1 text-2xl items-end">
              <div className='h-6 w-24 bg-gray-300 rounded'></div>
              <div className='h-6 w-24 bg-gray-300 rounded'></div>
            </div>

            {/* Time & weather icon row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex flex-col items-center space-y-2"
                >
                  <div className='h-6 w-16 bg-gray-300 rounded'></div>
                  <div className='h-6 w-16 bg-gray-300 rounded'></div>
                  <div className='h-6 w-16 bg-gray-300 rounded'></div>
                </div>
              ))}
            </div>
          </div>

      {/* 5-day forecast */}
          <div className="flex flex-col gap-4 animate-pulse">
            <p className='text-2xl h-8 w-36 bg-gray-300 rounded'></p>

            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                  <div className='h-8 w-28 bg-gray-300 rounded'></div>
                  <div className='h-10 w-10 bg-gray-300 rounded-full'></div>
                  <div className='h-8 w-28 bg-gray-300 rounded'></div>
                  <div className='h-8 w-28 bg-gray-300 rounded'></div>
              </div>
            ))}
            </div>
      </section>
  );
}