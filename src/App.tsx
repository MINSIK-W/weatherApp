import Weather from './components/Weather.tsx';
import Developing from './developing/Developing.tsx';

function App() {
  return (
    <>
      <div className='grid min-h-screen bg-indigo-200'>
        <Weather />
        <div className='container mx-auto text-center text-sm text-gray-600'>
          <p>
            본 서비스는{' '}
            <a
              className='font-semibold underline hover:text-indigo-500 transition '
              href='https://www.weather.go.kr/'
              target='_blank'
              rel='noopener noreferrer'
            >
              기상청
            </a>
            (날씨 정보 REST API),
            <a
              className='font-semibold underline hover:text-indigo-500 transition mx-1'
              href='https://developers.kakao.com/'
              target='_blank'
              rel='noopener noreferrer'
            >
              Kakao Developers
            </a>
            (검색/좌표 REST API) 데이터를 활용합니다.
          </p>
        </div>
      </div>
      <Developing
        progress={70}
        eta='8월 4주 예정'
        message='작업 진행중입니다.'
        showCloseButton={true}
      />
    </>
  );
}

export default App;
