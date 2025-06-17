import React, { useState, useEffect } from 'react';
import MapFromKakao from '../components/map/MapFromKakao';
import Search from '../components/map/sidebar/Search';

const MapPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [trails, setTrails] = useState([]);

  const VWORLD_KEY = process.env.REACT_APP_VWORLD_API_KEY;
 

  const handleSearchResult = async (mountainInfo) => {
    if (!mountainInfo || (!mountainInfo.mountain && !mountainInfo.name)) {
    console.error("❌ 유효하지 않은 mountainInfo:", mountainInfo);
    return;
  }
    const {name, lat, lon} = mountainInfo;

    const delta = 0.01;
    const minLon = lon - delta;
    const minLat = lat - delta;
    const maxLon = lon + delta;
    const maxLat = lat + delta;

    

    const searchKeyword = name.split('(')[0].trim(); // "북한산"
    const encodedName = encodeURIComponent(`%${searchKeyword}%`);

    const url = `/vworld/req/data?service=data&version=2.0&request=GetFeature&format=json&data=LT_L_FRSTCLIMB&key=${VWORLD_KEY}&domain=http://localhost:3000&geomFilter=BOX(${minLon},${minLat},${maxLon},${maxLat})&attrFilter=mntn_nm:like:${searchKeyword}`;


    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log("🧾 전체 응답 데이터:", data);  // 디버깅

    const features = data.response?.result?.featureCollection?.features;

    if (!features || !Array.isArray(features)) {
      console.error("❌ features가 없거나 잘못된 응답:", data);
      return;
    }

    const items = features.map((f) => {
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


    } catch (err) {
      console.error("[X] 등산로 요청 실패:", err);
    }
  }


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
        <div className="w-[300px] h-full">{isSidebarOpen && <Search onSearchResult={handleSearchResult} />}</div>
      </div>

      {/* 지도 영역 */}
      <div className="flex-1 h-full">
        <div className="w-full h-full">
          <MapFromKakao trails={trails}/>
        </div>
      </div>
    </div>
  );
};

export default MapPage;



  // useEffect(() => {
  //   const fetchTrails = async () => {
  //     try {
  //       const url = `/vworld/req/data?service=data&version=2.0&request=GetFeature&format=json&data=LT_L_FRSTCLIMB&key=${VWORLD_KEY}&attrFilter=emdCd:=:${emdCode}&domain=http://localhost:3000`;

  //       const response = await fetch(url);
  //       const data = await response.json();

  //       if (
  //         data?.response?.status === 'OK' &&
  //         data?.response?.result?.featureCollection?.features
  //       ) {
  //         const items = data.response.result.featureCollection.features.map((f) => {
  //           const properties = f.properties;
  //           const geometry = f.geometry;

  //           const ag_geom = (() => {
  //             if (!geometry) return null;

  //             if (geometry.type === 'LineString') {
  //               return `LINESTRING(${geometry.coordinates.map((c) => c.join(' ')).join(',')})`;
  //             }

  //             if (geometry.type === 'MultiLineString') {
  //               const firstLine = geometry.coordinates[0];
  //               return `LINESTRING(${firstLine.map((c) => c.join(' ')).join(',')})`;
  //             }

  //             return null;
  //           })();

  //           return {
  //             ...properties,
  //             ag_geom,
  //           };
  //         });

  //         setTrails(items);
  //       } else {
  //         console.error('[] API 응답 실패:', data);
  //       }
  //     } catch (error) {
  //       console.error('❗ fetch 실패:', error);
  //     }
  //   };
  //   fetchTrails();
  // }, [VWORLD_KEY]);
