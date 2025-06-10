import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../../redux/userSlice';
import LoginPage from '../../pages/LoginPage';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [showLogin, setShowLogin] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate("/login");
  };

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
        {isLoggedIn ? (
          <>
            <span>{userInfo?.nickname}님</span>
            <button onClick={handleLogout} className="hover:underline">🚪 로그아웃</button>
          </>
        ) : (
          <button onClick={() => setShowLogin(true)} style={{ color: 'white', textDecoration: 'none' }}>👤 로그인</button>
        )}
        {showLogin && <LoginPage onClose={() => setShowLogin(false)} />}
        <Link to="/feed/write" className="bg-white text-green-700 px-3 py-1 rounded hover:bg-gray-100">+ 글쓰기</Link>
      </div>
    </header>
  );
};

export default Header;
