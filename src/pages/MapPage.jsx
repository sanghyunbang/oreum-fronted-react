import React, { useState } from 'react';

const MapPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const styles = getStyles(isSidebarOpen);
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
  
      <div style={styles.mapStyle}>
        <div style={styles.mapPlaceholderStyle}>[지도 미리보기]</div>
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
    // ✅ 토글 버튼은 sidebar 안이 아니라 절대 위치
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
  
