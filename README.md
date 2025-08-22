# 기술 스택
### Frontend
<img alt="React" src="https://img.shields.io/badge/-React-45b8d8?style=flat-square&logo=react&logoColor=white" />
<img alt="TypeScript" src="https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
<img alt="Vite" src="https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white" />
<img alt="Tailwind CSS" src="https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" />

### APIs
<img alt="Kakao" src="https://img.shields.io/badge/-Kakao_API-FFCD00?style=flat-square&logo=kakao&logoColor=black" />
<img alt="Korean Weather Service" src="https://img.shields.io/badge/-기상청_API-0066CC?style=flat-square&logoColor=white" />

---
# 주요 기능
- 자동 현재 위치 감지: GPS를 통한 자동 위치 확인 및 날씨 표시
- 지역 검색: 카카오 API를 활용한 정확한 지역 검색
- 기상청 공식 데이터: 한국 기상청 API를 통한 정확한 날씨 정보
- 상세 날씨 정보: 온도, 습도, 풍속, 하늘 상태
- 동적 아이콘: 실제 날씨 상태에 맞는 아이콘 자동 변경

# 데이터 플로우
- 자동 위치 감지: GPS → 좌표 획득
- 주소 변환: 좌표 → 카카오 역지오코딩 → 실제 주소
- 좌표 변환: GPS 좌표 → 기상청 격자 좌표
- 날씨 조회: 격자 좌표 → 기상청 API → 실시간 날씨
- UI 업데이트: 날씨 데이터 → 화면 표시