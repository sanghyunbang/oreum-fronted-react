import { useState } from "react";
import axios from "axios";
import UseMountainWeather from "../../../hooks/map/UseMoutainWeather";

const BASE_URL = "http://localhost:8080";

// 🌧 강수량 처리 함수
const formatPcp = (val) => {
  const value = String(val).trim();
  if (["?", "??", "???", "????", "-", "0", ""].includes(value)) {
    return " ";
  }
  return `${value}`;
};


// 🌡 기온 처리
const formatTemp = (val) => `${val}℃`;

// ☁️ 하늘 상태 처리
const skyCodeToText = (code) => {
  switch (code) {
    case "1.0":
      return "☀️ 맑음";
    case "3.0":
      return "⛅️ 구름";
    case "4.0":
      return "☁️ 흐림";
    default:
      return "/";
  }
};

const Search = ({onSearchResult}) => {
  const {
    weather: mountainWeather,
    error: weatherError,
    fetchWeatherByMountainNum,
  } = UseMountainWeather();

  const [inputText, setInputText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const trimmed = inputText.trim();
    console.log("🔍 trimmed:", trimmed);
    if (!trimmed) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/api/mountains/search?query=${encodeURIComponent(trimmed)}`,
        { withCredentials: true }
      );
      const results = res.data;

      if (results.length > 0) {
        const matched = results[0];
        console.log(" 무슨 값을 onSearchResult로 전해주나??", matched);
        onSearchResult(matched);
        await fetchWeatherByMountainNum(matched.mountainNum);
      } else {
        alert("해당 산을 찾을 수 없습니다."); // 이 부분 수정해야 -> onSearchResult에 검색하는 검색명을 넘기고 카카오가 center찾도록
      }
    } catch (err) {
      console.error("[X] 검색 중 오류 발생:", err);
      alert("검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInputText(value);

    if (value.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(
        `${BASE_URL}/api/mountains/search?query=${encodeURIComponent(value)}`,
        { withCredentials: true }
      );
      setSuggestions(res.data);
    } catch (err) {
      console.error("❌ 자동완성 중 오류 발생:", err);
      setSuggestions([]);
    }
  };

  return (
    <div className="p-5 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">
        이번 주엔 어느 산으로 갈까요?
      </h2>

      {/* 검색창 */}
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="산 이름을 입력하세요 (예: 북한산)"
          className="flex-1 border border-gray-300 px-4 py-2 rounded-full text-sm"
        />
        <button
          onClick={handleSearch}
          className="bg-green-500 text-white px-4 py-2 rounded-full text-sm hover:bg-green-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "검색 중..." : "🔍"}
        </button>
      </div>

      {/* 자동완성 추천 */}
      {suggestions.length > 0 && (
        <ul className="mb-4 bg-white border rounded-lg p-2 text-sm">
          {suggestions.map((item) => (
            <li
              key={item.mountainNum}
              className="cursor-pointer px-2 py-1 hover:bg-gray-100"
              onClick={async () => {
                setInputText(item.name);
                setSuggestions([]);
                await fetchWeatherByMountainNum(item.mountainNum);
              }}
            >
              {item.name} ({item.altitude}m)
            </li>
          ))}
        </ul>
      )}

      {/* 안내 문구 (초기 상태 or 결과 없음) */}
      {!mountainWeather && !weatherError && (
        <p className="text-sm text-gray-500 text-center mt-4">
          산 이름을 검색하면 산악 예보가 표시됩니다.
        </p>
      )}

      {/* 에러 메시지 (진짜 에러일 때만) */}
      {weatherError && (
        <p className="text-red-600 text-sm mb-3">{weatherError}</p>
      )}

      {mountainWeather && mountainWeather.forecast && (
        <div className="bg-white p-4 rounded-lg shadow text-sm">
          <p className="font-bold mb-3">{mountainWeather.mountain}의 산악예보</p>

          {Object.entries(mountainWeather.forecast).map(([date, info]) => {
            if (!info["0900_temp"]) return null;

            return (
              <div key={date} className="mb-4 border rounded-md p-3 bg-gray-50">
                <div className="flex justify-between mb-2 text-gray-600 text-xs">
                  <span>{date} 예보</span>
                  <span>
                    🌅 {info.sunrise || "-"} / 🌇 {info.sunset || "-"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  {["0900", "1500", "2100"].map((time) => (
                    <div
                      key={time}
                      className="bg-white border rounded p-2 flex flex-col gap-1"
                    >
                      <div className="font-bold text-gray-700">
                        {time.slice(0, 2)}:00
                      </div>
                      <div>{skyCodeToText(info[`${time}_sky`])}</div>
                      <div>{formatTemp(info[`${time}_temp`])}</div>
                      <div>{formatPcp(info[`${time}_pcp`])}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default Search;
