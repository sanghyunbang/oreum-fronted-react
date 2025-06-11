import React, { useState, useEffect } from 'react';
import MapFromKakao from '../components/map/MapFromKakao';
import Search from '../components/map/sidebar/Search';

const MapPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [trails, setTrails] = useState([]);

  const VWORLD_KEY = process.env.REACT_APP_VWORLD_API_KEY;
  const emdCode = '11110101'; // 청운효자동 (서울 종로구)

  useEffect(() => {
    const fetchTrails = async () => {
      try {
        const url = `/vworld/req/data?service=data&version=2.0&request=GetFeature&format=json&data=LT_L_FRSTCLIMB&key=${VWORLD_KEY}&attrFilter=emdCd:=:${emdCode}&domain=http://localhost:3000`;

        const response = await fetch(url);
        const data = await response.json();

        if (
          data?.response?.status === 'OK' &&
          data?.response?.result?.featureCollection?.features
        ) {
          const items = data.response.result.featureCollection.features.map((f) => {
            const properties = f.properties;
            const geometry = f.geometry;

            const ag_geom = (() => {
              if (!geometry) return null;

              if (geometry.type === 'LineString') {
                return `LINESTRING(${geometry.coordinates.map((c) => c.join(' ')).join(',')})`;
              }

              if (geometry.type === 'MultiLineString') {
                const firstLine = geometry.coordinates[0];
                return `LINESTRING(${firstLine.map((c) => c.join(' ')).join(',')})`;
              }

              return null;
            })();

            return {
              ...properties,
              ag_geom,
            };
          });

          setTrails(items);
        } else {
          console.error('❌ API 응답 실패:', data);
        }
      } catch (error) {
        console.error('❗ fetch 실패:', error);
      }
    };
    fetchTrails();
  }, [VWORLD_KEY]);

  return (
    <div className="flex h-screen relative">
      {/* 토글 버튼 */}
      <button
        className={`absolute top-4 z-50 bg-gray-300 px-2 py-1 rounded-r text-sm transition-all duration-300
          ${isSidebarOpen ? 'left-[300px]' : 'left-0'}`}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? '◀' : '▶'}
      </button>

      {/* 사이드바 */}
      <div
        className={`bg-gray-100 h-full overflow-hidden transition-all duration-300
          ${isSidebarOpen ? 'w-[300px]' : 'w-0'}`}
      >
        <div className="w-[300px] h-full">{isSidebarOpen && <Search />}</div>
      </div>

      {/* 지도 영역 */}
      <div className="flex-1 h-full">
        <div className="w-full h-full">
          <MapFromKakao />
        </div>
      </div>
    </div>
  );
};

export default MapPage;
