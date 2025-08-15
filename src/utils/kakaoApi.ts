import { config } from '../config/environment';

// 검색 결과 타입
interface SearchResult {
  placeName: string;
  address: string;
  latitude: number;
  longitude: number;
}

// 카카오 API 원본 타입
interface KakaoResponse {
  documents: Array<{
    place_name: string;
    address_name: string;
    x: string; // 경도
    y: string; // 위도
  }>;
}

// 위치 검색 함수
export const searchLocation = async (query: string): Promise<SearchResult[]> => {
  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `KakaoAK ${config.KAKAO_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`검색 실패: ${response.status}`);
    }

    const data: KakaoResponse = await response.json();

    // 카카오 응답 변환
    return data.documents.map(doc => ({
      placeName: doc.place_name,
      address: doc.address_name,
      latitude: parseFloat(doc.y),
      longitude: parseFloat(doc.x),
    }));
  } catch (error) {
    console.error('위치 검색 오류:', error);
    throw new Error('위치를 검색할 수 없습니다');
  }
};
