import { useState } from "react";
import axios from "axios";
import UseMountainWeather from "../../../hooks/map/UseMoutainWeather";

const mountainList = ['북한산', '도봉산', '한라산', '설악산', '치악산'];


const Search = () => {

  // 산정보 관련 훅 셋팅
  const {
    weather: mountainWeather, 
    error: weatherError, fetchWeatherByMountain } = UseMountainWeather(); 

  const [inputText, setInputText] = useState("");

  const handleSearch = async () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    if (mountainList.includes(trimmed)) {
      await fetchWeatherByMountain(trimmed); // hook에서 가져온 메서드만 실행
    } else {
      alert("현재는 산 이름만 지원합니다.");
    }
  }
  const getForecastTime = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = date.getHours();
    const hour = hh < 5 ? "0500" : hh < 11 ? "0500" : hh < 17 ? "1100" : "1700";
    return `${yyyy}${mm}${dd}${hour}`;
  };

  const getWeatherIcon = (sky, pty) => {
    if (pty === "1") return "wi-rain";
    if (pty === "2") return "wi-rain-mix";
    if (pty === "3") return "wi-snow";

    switch (sky) {
      case "1": return "wi-day-sunny";
      case "3": return "wi-day-cloudy";
      case "4": return "wi-cloudy";
      default: return "wi-na";
    }
  };

  const mapSkyToText = (sky) => {
    switch (sky) {
      case "1": return "맑음";
      case "3": return "구름 많음";
      case "4": return "흐림";
      default: return "알 수 없음";
    }
  };

  return (
    <div className="p-5 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">
        이번 주엔 어느 산으로 갈까요?
      </h2>

      {/* 추천 산 리스트 */}
      <div className="flex gap-2 flex-wrap text-xs mb-4">
        {mountainList.map((name, i) => (
          <button
            key={i}
            onClick={() => {
              setInputText(name);
              fetchWeatherByMountain(name); // ✅ 수정
            }}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full"
          >
            {name}
          </button>
        ))}
      </div>

      {/* 검색창 */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="산 이름을 입력하세요 (예: 북한산)"
          className="flex-1 border border-gray-300 px-4 py-2 rounded-full text-sm"
        />
        <button
          onClick={handleSearch}
          className="bg-green-500 text-white px-4 py-2 rounded-full text-sm hover:bg-green-600"
        >
          🔍
        </button>
      </div>

      {/* 에러 메시지 */}
      {weatherError && (
        <p className="text-red-600 text-sm mb-3">{weatherError}</p>
      )}

      {/* 날씨 결과 */}
      {mountainWeather && (
        <div className="bg-white p-4 rounded-lg shadow text-sm flex items-center gap-4">
          <i className={`wi ${getWeatherIcon(mountainWeather.sky, mountainWeather.pty)} text-4xl text-blue-500`} />
          <div>
            <p className="font-bold mb-2">{mountainWeather.name} 정상의 오늘 날씨</p>
            <ul className="list-disc ml-5">
              <li>하늘 상태: {mapSkyToText(mountainWeather.sky)}</li>
              <li>기온: {mountainWeather.temp}℃</li>
              <li>풍속: {mountainWeather.wind} m/s</li>
              <li>강수 확률: {mountainWeather.rnSt}%</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );


};

export default Search;
