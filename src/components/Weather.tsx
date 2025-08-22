import { useEffect, useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import WeatherIcon from './WeatherIcon.tsx';
import { getAddressFrom, searchLocation } from '../utils/kakaoApi.ts';
import { weatherApi } from '../utils/weatherApi.ts';

export default function Weather() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationName, setLocationName] = useState('위치 확인 중...');
  const [isLoading, setIsLoading] = useState(true);

  const [weatherData, setWeatherData] = useState<{
    temperature: number;
    humidity: number;
    windSpeed: number;
    skyCondition: string;
    iconType: 'clear' | 'cloud' | 'drizzle' | 'rain' | 'snow' | 'wind';
  } | null>(null);

  // 컴포넌트 마운트시 자동으로 위치/날씨 가져오기
  useEffect(() => {
    loadCurrentLocationWeather();
  }, []);

  const loadCurrentLocationWeather = async () => {
    try {
      console.log('앱 시작/위치 확인');

      // GPS 위치 가져오기
      const position = await getCurrentPosition();
      const { latitude, longitude } = position;

      console.log('GPS 위치:', { latitude, longitude });

      // 좌표>주소 변환
      try {
        const addressInfo = await getAddressFrom(latitude, longitude);
        const shortAddress = addressInfo.town
          ? `${addressInfo.district} ${addressInfo.town}`
          : addressInfo.district;
        setLocationName(shortAddress);
      } catch (err) {
        console.warn('주소 변환 실패, 기본값 사용:', err);
        setLocationName('현재 위치');
      }

      // 현재 위치 날씨 가져오기
      const weather = await weatherApi(latitude, longitude);
      setWeatherData(weather);
      setLocationName('현재 위치');
      console.log('현재 위치 날씨 확인:', weather);
    } catch (err) {
      console.error('자동 위치 확인 실패:', err);
      setLocationName('위치 확인 실패');
    } finally {
      setIsLoading(false);
    }
  };

  // 새로고침 버튼
  const handleCurrentLocation = async () => {
    setIsLoading(true);
    try {
      console.log('현재 위치 요청...');
      alert('현재 위치 확인중...');
      await loadCurrentLocationWeather();
    } catch (err) {
      alert('현재 위치를 가져올 수 없습니다');
    } finally {
      setIsLoading(false);
    }
  };

  // GPS 위치 가져오는 Promise 함수
  const getCurrentPosition = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('해당 브라우저는 위치서비스를 지원하지 않습니다.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        err => {
          let errMsg = '위치를 가져올 수 없습니다';

          switch (err.code) {
            case err.PERMISSION_DENIED:
              errMsg = '위치 접근 권한이 거부되었습니다';
              break;
            case err.POSITION_UNAVAILABLE:
              errMsg = '위치 정보를 사용할 수 없습니다';
              break;
            case err.TIMEOUT:
              errMsg = '위치 요청 시간이 초과되었습니다';
              break;
          }

          reject(new Error(errMsg));
        },
        {
          enableHighAccuracy: true, // 정확한 위치 요청
          timeout: 10000, // 10초 타임아웃
          maximumAge: 300000, // 5분간 캐시 사용
        }
      );
    });
  };

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

        console.log('날씨 정보 요청');
        try {
          const weather = await weatherApi(firstResult.latitude, firstResult.longitude);
          setWeatherData(weather);
          console.log('날씨 데이터:', weather);
        } catch (err) {
          console.error('날씨 데이터 가져오기 실패:', err);
          alert('날씨 정보를 가져올 수 없습니다');
        }
      } else {
        alert('검색 결과가 없습니다');
      }
    } catch (err) {
      alert('검색 중 오류가 발생했습니다');
      console.error(err);
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
      <div className='flex items-center gap-2'>
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
        <div className='flex items-center gap-3'>
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className='flex justify-center items-center rounded-full cursor-pointer bg-cyan-50 text-lg w-10 h-10 hover:bg-cyan-100 disabled:opacity-50  disabled:cursor-not-allowed transition-colors'
          >
            {isLoading ? (
              <div className='w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin' />
            ) : (
              <Search className='w-5' />
            )}
          </button>
          <button
            onClick={handleCurrentLocation}
            disabled={isLoading}
            className='flex justify-center items-center rounded-full cursor-pointer bg-blue-500 text-lg w-10 h-10 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white '
          >
            {isLoading ? (
              <div className='w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin' />
            ) : (
              <MapPin className='w-5' />
            )}
          </button>
        </div>
      </div>

      <div className='mt-7 mb-7'>
        <WeatherIcon weather='clear' size={150} />
      </div>

      <div className='flex flex-col items-center gap-3'>
        <p className='text-white text-7xl font-semibold tracking-tight'>
          {weatherData ? `${weatherData.temperature}°C` : '--°C'}
        </p>
        <p className='text-white text-4xl'>{locationName}</p>
        <p className='text-white text-lg'>
          {weatherData ? weatherData.skyCondition : '날씨 정보 없음'}
        </p>
      </div>

      <div className='w-full text-white mt-10 flex justify-between'>
        <div className='flex items-start gap-3'>
          <WeatherIcon weather='humidity' size={26} />
          <div>
            <span className='block text-lg'>습도</span>
            <p className='text-xl'>{weatherData ? `${weatherData.humidity}%` : '--%'}</p>
          </div>
        </div>
        <div className='flex items-start gap-3 text-xl'>
          <WeatherIcon weather='wind' size={26} />
          <div>
            <span>바람 세기</span>
            <p className='text-xl'>{weatherData ? `${weatherData.windSpeed} m/s` : '-- m/s'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
