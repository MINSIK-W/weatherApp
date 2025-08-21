import { config } from '../config/environment';
import { convertToGrid } from './convertToGrid.ts';

// 날씨 데이터 타입
interface WeatherData {
  temperature: number; // 기온
  humidity: number; // 습도
  windSpeed: number; // 풍속
  skyCondition: string; // 하늘상태
}

// 원본 응답 타입
interface KmaResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: Array<{
          category: string; // 날씨 요소 (TMP, REH, WSD 등)
          fcstValue: string; // 예보값
          fcstDate: string; // 예보일자
          fcstTime: string; // 예보시간
        }>;
      };
    };
  };
}

/**
 * 현재 날짜/시간 형식 변환
 */
const getApiDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour: number = now.getHours(); // 명시적 타입 지정

  // 발표시간
  const baseHours = [2, 5, 8, 11, 14, 17, 20, 23];
  let baseHour = 2; // 기본값

  // 현재 시간보다 이전인 가장 최근 발표시간 찾기
  for (let i = baseHours.length - 1; i >= 0; i--) {
    if (hour >= baseHours[i]) {
      baseHour = baseHours[i];
      break;
    }
  }

  // 02시 이전이면 전날 23시 데이터 사용
  if (hour < 2) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayYear = yesterday.getFullYear();
    const yesterdayMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
    const yesterdayDay = String(yesterday.getDate()).padStart(2, '0');
    return {
      baseDate: yesterdayYear + yesterdayMonth + yesterdayDay,
      baseTime: '2300',
    };
  }

  return {
    baseDate: year + month + day,
    baseTime: String(baseHour).padStart(2, '0') + '00',
  };
};

/**
 * 위치 좌표로 날씨 정보 가져오기
 */
export const weatherApi = async (latitude: number, longitude: number): Promise<WeatherData> => {
  try {
    // GPS 좌표 격자로 변환
    const { nx, ny } = convertToGrid({ latitude, longitude });
    const { baseDate, baseTime } = getApiDateTime();

    console.log('날씨 API 요청:', { nx, ny, baseDate, baseTime });

    // API 호출
    const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst`;
    const queryParams = [
      `serviceKey=${config.VITE_WEATHER_API}`,
      `pageNo=1`,
      `numOfRows=1000`,
      `dataType=JSON`,
      `base_date=${baseDate}`,
      `base_time=${baseTime}`,
      `nx=${nx}`,
      `ny=${ny}`,
    ].join('&');

    const response = await fetch(`${url}?${queryParams}`);

    console.log('기상청 API 응답 상태:', response.status);
    console.log('요청 URL:', response);

    if (!response.ok) {
      throw new Error(`기상청 API 오류: ${response.status}`);
    }

    // 응답 텍스트 확인
    const responseText = await response.text();
    console.log('기상청 API 원본 응답:', responseText.substring(0, 500)); // 처음 500자만

    // XML 인지 확인
    if (responseText.startsWith('<')) {
      console.error('API 키나 파라미터 문제');
      throw new Error('기상청 API에서 XML 응답을 받았습니다. API 키를 확인해주세요.');
    }

    // JSON 파싱 시도
    const data: KmaResponse = JSON.parse(responseText);

    // 응답 확인
    if (data.response.header.resultCode !== '00') {
      throw new Error(`기상청 API 에러: ${data.response.header.resultMsg}`);
    }

    console.log('기상청 API 응답:', data.response.body.items.item.slice(0, 10)); // 처음 10개만 로그

    // 데이터 파싱
    const items = data.response.body.items.item;
    const weatherMap = new Map<string, string>();

    // 가장 최근 시간대 데이터만
    const firstDateTime = items[0]?.fcstDate + items[0]?.fcstTime;
    const currentItems = items.filter(item => item.fcstDate + item.fcstTime === firstDateTime);

    currentItems.forEach(item => {
      weatherMap.set(item.category, item.fcstValue);
    });

    console.log('파싱된 날씨 데이터:', Object.fromEntries(weatherMap));

    return {
      temperature: parseFloat(weatherMap.get('TMP') || '0'),
      humidity: parseFloat(weatherMap.get('REH') || '0'),
      windSpeed: parseFloat(weatherMap.get('WSD') || '0'),
      skyCondition: getSkyCondition(weatherMap.get('SKY') || '1'),
    };
  } catch (err) {
    console.error('날씨 데이터 가져오기 실패:', err);
    throw new Error('날씨 정보를 가져올 수 없습니다');
  }
};

/**
 * 하늘상태 코드 문자열
 */
const getSkyCondition = (skyCode: string): string => {
  switch (skyCode) {
    case '1':
      return '맑음';
    case '3':
      return '구름많음';
    case '4':
      return '흐림';
    default:
      return '맑음';
  }
};
