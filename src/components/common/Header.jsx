import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-400 text-white px-6 py-3 flex justify-between items-center shadow">
      <Link to="/" className="flex items-center text-xl font-bold gap-2">
        <img
          src={`${process.env.PUBLIC_URL}/favicon.png`}
          alt="오름 로고"
          className="w-8 h-8"
        />
        오름 | OREUM
      </Link>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="검색..."
          className="px-3 py-1 rounded text-black text-sm"
        />
        <Link to="/login" className="hover:underline">👤 로그인</Link>
        <Link to="/write" className="bg-white text-green-700 px-3 py-1 rounded hover:bg-gray-100">+ 글쓰기</Link>
      </div>
    </header>
  );
};

export default Header;
