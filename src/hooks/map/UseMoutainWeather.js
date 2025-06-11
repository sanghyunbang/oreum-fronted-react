import { useState } from 'react';

export default function useMountainWeather() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeatherByMountain = async (mountainName) => {
    const backendUrl = "http://localhost:8080/weather/summit";
    try {
      console.clear();
      console.log("🟢 산 이름으로 날씨 요청:", mountainName);

      setError(null);
      setWeather(null);

      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('jwtToken')}`
        },
        credentials: 'include', // 이거 꼭 있어야 세션/쿠키 공유 가능
        body: JSON.stringify({ mountainName }),
      });

      console.log("✅ 백엔드 응답 상태:", response.status);

      if (!response.ok) {
        const text = await response.text();
        console.error("❌ 백엔드 응답 본문:", text);
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

  return { weather, error, fetchWeatherByMountain };
}
