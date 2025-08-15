interface GridCoordinate {
  nx: number; // 격자 X 좌표
  ny: number; // 격자 Y 좌표
}

interface GpsCoordinate {
  latitude: number; // 위도
  longitude: number; // 경도
}

export function convertToGrid(gps: GpsCoordinate): GridCoordinate {
  const RE = 6371.00877; // 반경(km)
  const GRID = 5.0; // 간격(km)
  const SLAT1 = 30.0; // 위도1
  const SLAT2 = 60.0; // 위도2
  // 기준점
  const OLON = 126.0; // 경도
  const OLAT = 38.0; // 위도
  const XO = 43; // X 값
  const YO = 136; // Y 값

  const DEGRAD = Math.PI / 180.0;

  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  let ra = Math.tan(Math.PI * 0.25 + gps.latitude * DEGRAD * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);
  let theta = gps.longitude * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  const nx = Math.floor(ra * Math.sin(theta) + XO + 0.5);
  const ny = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

  return { nx, ny };
}
export const testCoordinateConversion = () => {
  const seoul = { latitude: 37.5665, longitude: 126.978 }; // 서울시청
  const grid = convertToGrid(seoul);
  console.log('서울시청 GPS:', seoul);
  console.log('서울시청 격자:', grid);
  // 예상 결과: nx: 60, ny: 127 정도 나와야 함
};
