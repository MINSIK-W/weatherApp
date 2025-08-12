import Weather from "./components/Weather.tsx";

function App() {

  return (
    <>
      <div className='grid min-h-screen bg-indigo-200'>
        <Weather />
        <div className="container mx-auto text-center text-sm text-gray-600">
          <p>날씨 정보는 기상청에서 제공하는 데이터를 활용했습니다.</p>
          <p>출처: 기상청 (Korea Meteorological Administration)</p>
        </div>
      </div>
    </>

)
}

export default App
