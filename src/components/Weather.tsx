import {Search} from "lucide-react";
import WeatherIcon from "./WeatherIcon.tsx";

export default function Weather() {

  return (
    <div className='place-self-center p-10 rounded-xl bg-gradient-to-t from-slate-700 to-indigo-600 flex flex-col items-center justify-center'>
      <div className='flex items-center gap-3'>
        <input id='search' className='h-10 rounded-4xl outline-none border-none pl-6 text-gray-500 bg-cyan-50 text-lg' type="text" placeholder='검색'/>
          <span className='flex justify-center items-center rounded-full cursor-pointer bg-cyan-50 text-lg w-10 h-10'>
          <Search className='w-5' />
        </span>
      </div>
      <div className='mt-7 mb-7'>
        <WeatherIcon weather="clear" size={150}/>
      </div>
      <div className='flex flex-col items-center gap-3'>
        <p className='text-white text-7xl font-semibold tracking-tight'>16°C</p>
        <p className='text-white text-4xl'>서울</p>
      </div>
      <div className='w-full text-white mt-10 flex justify-between'>
        <div className='flex items-start gap-3'>
          <WeatherIcon weather="humidity" size={26}/>
          <div>
            <span className='block text-lg'>습도</span>
            <p className='text-xl'>91%</p>
          </div>
        </div>
        <div className='flex items-start gap-3 text-xl'>
          <WeatherIcon weather="wind" size={26}/>
          <div>
            <span>바람 세기</span>
            <p className='text-xl'>3.6 Km/h</p>
          </div>
        </div>
      </div>
    </div>
  );
}