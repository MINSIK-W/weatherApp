import * as React from 'react';
import { useState } from 'react';
import { Search } from 'lucide-react';
import WeatherIcon from './WeatherIcon.tsx';
import { searchLocation } from '../utils/kakaoApi.ts';

export default function Weather() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationName, setLocationName] = useState('서울');
  const [isLoading, setIsLoading] = useState(false);

  // 검색 버튼 클릭 핸들러
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('검색어를 입력해주세요');
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchLocation(searchQuery);

      if (results.length > 0) {
        // 검색 결과
        const firstResult = results[0];
        setLocationName(firstResult.placeName);
        console.log('검색 성공:', firstResult);

        // TODO: 날씨 API 호출 예정
      } else {
        alert('검색 결과가 없습니다');
      }
    } catch (error) {
      alert('검색 중 오류가 발생했습니다');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Enter 키 입력 핸들러
  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      try {
        await handleSearch();
      } catch (err) {
        console.error('검색 오류');
      }
    }
  };

  return (
    <div className='place-self-center p-10 rounded-xl bg-gradient-to-t from-slate-700 to-indigo-600 flex flex-col items-center justify-center'>
      <div className='flex items-center gap-3'>
        <input
          id='search'
          className='h-10 rounded-4xl outline-none border-none pl-6 text-gray-500 bg-cyan-50 text-lg'
          type='text'
          placeholder='검색'
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className='flex justify-center items-center rounded-full cursor-pointer bg-cyan-50 text-lg w-10 h-10 hover:bg-cyan-100 disabled:opacity-50'
        >
          {isLoading ? (
            <div className='w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin' />
          ) : (
            <Search className='w-5' />
          )}
        </button>
      </div>

      <div className='mt-7 mb-7'>
        <WeatherIcon weather='clear' size={150} />
      </div>

      <div className='flex flex-col items-center gap-3'>
        <p className='text-white text-7xl font-semibold tracking-tight'>16°C</p>
        <p className='text-white text-4xl'>{locationName}</p>
      </div>

      <div className='w-full text-white mt-10 flex justify-between'>
        <div className='flex items-start gap-3'>
          <WeatherIcon weather='humidity' size={26} />
          <div>
            <span className='block text-lg'>습도</span>
            <p className='text-xl'>91%</p>
          </div>
        </div>
        <div className='flex items-start gap-3 text-xl'>
          <WeatherIcon weather='wind' size={26} />
          <div>
            <span>바람 세기</span>
            <p className='text-xl'>3.6 Km/h</p>
          </div>
        </div>
      </div>
    </div>
  );
}
