import { useState } from "react";
import axios from "axios";

const mountainList = ['북한산', '도봉산', '한라산', '설악산', '치악산'];

//인코딩 키
const API_KEY = "Rx9Ez4voG7r9hAZRsYbX7gOcZ3rNA678Jw2Pg4weTBf5HonR6GNR6vqhCaIjy5HPXceLoHxw6KuZrzg0yAjmhw%3D%3D";

const Search = () => {
  const [inputText, setInputText] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setWeather(null);

    const trimmed = inputText.trim();
    if (!trimmed) return;

    if (mountainList.includes(trimmed)) {
      await fetchMountainWeather(trimmed);
    } else {
      setError("현재는 산 이름만 지원됩니다.");
    }
  };

  const fetchMountainWeather = async (mtNm) => {
    try {
      const now = new Date();
      const tmFc = getForecastTime(now);

      const url = `/weatherapi/1360000/MtWeatherInfoService/getMtWeatherInfo?serviceKey=${API_KEY}&pageNo=1&numOfRows=10&dataType=JSON&mtNm=${encodeURIComponent(mtNm)}&tmFc=${tmFc}`;

      const res = await axios.get(url);
      const items = res.data.response?.body?.items?.item;

      if (!items || items.length === 0) {
        setError("해당 산의 기상 정보를 찾을 수 없습니다.");
        return;
      }

      const item = items[0];

      setWeather({
        type: "mountain",
        name: item.mountain,
        sky: item.sky,
        pty: item.pty,
        temp: item.ta,
        wind: item.ws,
        rnSt: item.rnSt,
        icon: getWeatherIcon(item.sky, item.pty),
      });
    } catch (err) {
      console.error(err);
      setError("산악예보를 불러오지 못했습니다.");
    }
  };

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
              fetchMountainWeather(name);
            }}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full"
          >
            {name}
          </button>
        ))}
      </div>

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

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      {weather && (
        <div className="bg-white p-4 rounded-lg shadow text-sm flex items-center gap-4">
          <i className={`wi ${weather.icon} text-4xl text-blue-500`} />
          <div>
            <p className="font-bold mb-2">{weather.name} 정상의 오늘 날씨</p>
            <ul className="list-disc ml-5">
              <li>하늘 상태: {mapSkyToText(weather.sky)}</li>
              <li>기온: {weather.temp}℃</li>
              <li>풍속: {weather.wind} m/s</li>
              <li>강수 확률: {weather.rnSt}%</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
