const getEnvVar = (key: string): string => {
  const value = import.meta.env[key];

  console.log(`환경변수 ${key}:`, value ? '설정됨' : '설정안됨');
  console.log(`전체 환경변수:`, import.meta.env);

  if (!value) {
    throw new Error(`환경변수 ${key}가 설정안됨`);
  }
  return value;
};

export const config = {
  KAKAO_API_KEY: getEnvVar('VITE_KAKAO_API_KEY'),
  VITE_WEATHER_API: getEnvVar('VITE_WEATHER_API'),
} as const;
