// hooks/useMountainWeather.js
import { useState } from 'react';
import { convertLatLonToGrid } from '../utils/geo';

export default function useMountainWeather() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const kakaoKey = process.env.REACT_APP_KAKAO_API_KEY;
  const kmaKey = process.env.REACT_APP_KMA_API_KEY;

  const fetchWeatherByMountain = async (mountainName) => {
    try {
      // 1. Kakao 키워드 검색으로 좌표 얻기
      const res = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${mountainName}`,
        {
          headers: { Authorization: `KakaoAK ${kakaoKey}` },
        }
      );
      const data = await res.json();
      const { x, y } = data.documents[0]; // x: 경도, y: 위도

      // 2. 위경도 → nx, ny 변환
      const { nx, ny } = convertLatLonToGrid(Number(y), Number(x));

      // 3. 기상청 날씨 API 호출
      const today = new Date();
      const base_date = today.toISOString().slice(0, 10).replace(/-/g, '');
      const base_time = '0600';

      const weatherRes = await fetch(
        `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${kmaKey}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`
      );
      const weatherData = await weatherRes.json();

      setWeather(weatherData);
    } catch (err) {
      setError(err.message);
    }
  };

  return { weather, error, fetchWeatherByMountain };
}
