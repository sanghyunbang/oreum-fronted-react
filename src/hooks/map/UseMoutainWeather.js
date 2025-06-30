import { useState } from 'react';

export default function useMountainWeather() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeatherByMountainNum = async (mountainNum) => {
    const backendUrl = `http://localhost:8080/weather/summit?mountainNum=${mountainNum}`;
    try {
      console.clear();
      console.log("🟢 mountainNum으로 날씨 요청:", mountainNum);

      setError(null);
      setWeather(null);

      const response = await fetch(backendUrl, {
        method: "GET",
        credentials: 'include',
      });

      console.log("✅ 백엔드 응답 상태:", response.status);

      if (!response.ok) {
        const text = await response.text();
        console.error("❌ 백엔드 응답 본문:", text);
        // 예보 없음은 error로 간주하지 않음
        if (response.status === 404) {
          console.warn("⚠️ 산악예보 없음");
          setWeather(null); // 단순히 비우기
          return;
        }
        throw new Error("서버에서 날씨 정보를 받아오지 못했습니다.");
      }

      const weatherData = await response.json();
      console.log("🌤 날씨 데이터:", weatherData);
      setWeather(weatherData);
    } catch (err) {
      console.error("🔥 에러 발생:", err);
      setError(err.message || "알 수 없는 에러가 발생했습니다.");
    }
  };

  return { weather, error, fetchWeatherByMountainNum };
}
