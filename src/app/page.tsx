'use client';

import Image from "next/image";
import Navbar from "./components/Navbar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import format from "date-fns/format";
import { parseISO } from "date-fns";
import Container from "./components/Container";
import WeatherIcon from "./components/WeatherIcon";

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

// https://api.openweathermap.org/data/2.5/forecast?zip=85929,us&units=imperial&appid=61b1cbab3130e194ca68072459724a8c&cnt=2
export default function Home() {
  const { isPending, error, data } = useQuery<WeatherResponse>({
    queryKey: ['repoData'],
    queryFn: async() => { 
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?zip=85929,us&units=imperial&appid=${process.env.
        NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    }
  });

  const firstData = data?.list[0];

  console.log('console data', data ?? '');
  
  if (isPending) return (
    <div className='flex items-center min-h-screen justify-center'>
      <p className='animate-bounce'>Loading...</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* today's weather */}
        <section className="space-y-4">
          <div className="space-y-2">   
            <h2 className="flex gap-1 text-2xl items-end">
              <p> {format(parseISO(firstData?.dt_txt ??''), 'EEEE')} </p>
              <p> : {format(parseISO(firstData?.dt_txt ??''), 'MMM d, yyyy')}</p>
            </h2>
            <Container className=' gap-10 px-6 items-center'>
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
                      <WeatherIcon iconName={d.weather[0].icon} />
                      <p>{Math.round(d?.main.temp ?? 0)}°</p>
                  </div>
                ))}
              </div>
            </Container>
          </div>
        </section>
        <section className="flex flex-col gap-4">
          {/* 7-day forecast */}
        </section>
      </main>
    </div>
  );
}
