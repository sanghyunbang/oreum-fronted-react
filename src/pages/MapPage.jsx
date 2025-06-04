import React, { useState, useEffect } from 'react';
import MapFromKakao from '../components/map/MapFromKakao';

const MapPage = () => {

  //외부 관련
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const styles = getStyles(isSidebarOpen);
  
  // VM 관련
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
    <div style={styles.containerStyle}>
      {/* ✅ 토글 버튼은 사이드바 바깥쪽에 배치 */}
      <button
        style={styles.toggleBtnStyle(isSidebarOpen)}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? '◀' : '▶'}
      </button>
  
      <div style={styles.sidebarStyle}>
        {isSidebarOpen && (
          <div style={{ padding: '20px' }}>
            <h2>이번 주엔 어느 산으로 갈까요?</h2>
            <input type="text" placeholder="어느 산을 찾으시나요?" />
            <p>산 목록, 추천 코스 등 사이드바 내용이 여기에 들어갑니다.</p>
          </div>
        )}
      </div>
  
      <div className="mapArea" style={styles.mapStyle}>
        <div style={styles.mapPlaceholderStyle}><MapFromKakao /></div>
      </div>
    </div>
  );
  
};

export default MapPage;

const getStyles = (isSidebarOpen) => ({
    containerStyle: {
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      position: 'relative', // 버튼 절대 위치용
    },
    sidebarStyle: {
      backgroundColor: '#f1f1f1',
      width: isSidebarOpen ? '300px' : '0',
      transition: 'width 0.3s ease',
      overflow: 'hidden',
    },
    mapStyle: {
      flex: 1,
      backgroundColor: '#eaeaea',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    mapPlaceholderStyle: {
      width: '90%',
      height: '90%',
      backgroundColor: 'white',
      border: '1px solid #ccc',
    },
    // 토글 버튼은 sidebar 안이 아니라 절대 위치
    toggleBtnStyle: (isSidebarOpen) => ({
      position: 'absolute',
      top: '10px',
      left: isSidebarOpen ? '300px' : '0',
      backgroundColor: '#ccc',
      border: 'none',
      borderRadius: '0 5px 5px 0',
      padding: '5px 10px',
      cursor: 'pointer',
      zIndex: 100,
      transition: 'left 0.3s ease',
    }),
  });
  
