import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={{
      padding: '1rem 2rem',
      backgroundColor: '#2E8B57',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '1.2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      {/* ✅ 홈으로 이동하는 링크 */}
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
        오름 | OREUM ⛰
      </Link>

      🔍 검색창 자리

      👤 로그인 / 유저 메뉴
    </header>
  );
};

export default Header;
