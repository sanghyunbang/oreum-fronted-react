// Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/userSlice';
import LoginPage from '../../pages/LoginPage';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [showLogin, setShowLogin] = useState(false);

  const handleLogout = async () => {
  try {
    await fetch("http://localhost:8080/api/user/logout", {
      method: "POST",
      credentials: "include",
    });
    dispatch(logout());
    navigate("/");
  } catch (error) {
    console.error("Logout failed", error);
  }
};

  const handleWriteClick = () => {
    if (isLoggedIn) {
      navigate("/feed/write");
    } else {
      setShowLogin(true);
    }
  };

  const handleProfileClick = () => {
    navigate("/mypage");  
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

      <div className="bg-white w-2/3 py-1 rounded-[20px] flex justify-around">
        <input
          type="text"
          placeholder="  내가 관심있는 산을 검색해보세요!"
          className="w-[90%] py-2 rounded-[20px] text-black text-sm indent-4"
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded-full text-sm hover:bg-green-600">
          🔍
        </button>
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <button 
              onClick={handleProfileClick} 
              className="underline text-white font-semibold hover:text-gray-200"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              type="button"
            >
              {userInfo?.nickname || userInfo?.name}님
            </button>
            <button onClick={handleLogout} className="hover:underline">🚪 로그아웃</button>
          </>
        ) : (
          <button onClick={() => setShowLogin(true)} style={{ color: 'white' }}>👤 로그인</button>
        )}
        {showLogin && <LoginPage onClose={() => setShowLogin(false)} />}

        <button
          onClick={handleWriteClick}
          className="bg-white text-green-700 px-3 py-1 rounded hover:bg-gray-100"
        >
          + 글쓰기
        </button>
        </div>
    </header>
  );
};

export default Header;
