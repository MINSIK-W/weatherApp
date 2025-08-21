import { config } from '../config/environment';

// 검색 결과 타입
interface SearchResult {
  placeName: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface AddressInfo {
  cityOrProvince: string; // 시도
  district: string; // 시군구
  town: string; // 읍면동
  fullAddress: string; // 전체 주소
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
interface KaKaoReverseResponse {
  documents: Array<{
    address: {
      region_1depth_name: string; // 시도
      region_2depth_name: string; // 시군구
      region_3depth_name: string; // 읍면동
      address_name: string; // 전체 주소
    };
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

export const getAddressFrom = async (latitude: number, longitude: number): Promise<AddressInfo> => {
  try {
    console.log('좌표를 주소로 변환', { latitude, longitude });

    const res = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}&input_coord=WGS84`,
      {
        headers: {
          Authorization: `KakaoAK ${config.KAKAO_API_KEY}`,
        },
      }
    );

    if (!res.ok) throw new Error(`주소 변환 실패: ${res.status}`);

    const data: KaKaoReverseResponse = await res.json();
    if (!data.documents || data.documents.length === 0)
      throw new Error('해당 위치의 주소를 찾을 수 없습니다');

    const address = data.documents[0].address;

    const addressInfo: AddressInfo = {
      cityOrProvince: address.region_1depth_name,
      district: address.region_2depth_name,
      town: address.region_3depth_name,
      fullAddress: address.address_name,
    };
    console.log('변환 성공:', addressInfo);
    return addressInfo;
  } catch (err) {
    console.error('변환 오류:', err);
    throw new Error('주소를 가져올 수 없습니다');
  }
};
