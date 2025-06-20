import React, { useState, useRef, useEffect } from 'react';
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleProfileClick = () => {
    setDropdownOpen((prev) => !prev);
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-blue-400 text-white px-6 py-3 flex justify-between items-center shadow h-16 relative">
      {/* 로고 */}
      <Link to="/" className="flex items-center text-xl font-bold gap-2">
        <img
          src={`${process.env.PUBLIC_URL}/favicon.png`}
          alt="오름 로고"
          className="w-8 h-8"
        />
        오름 | OREUM
      </Link>

      {/* 검색 */}
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

      {/* 유저 & 드롭다운 */}
      <div className="relative flex items-center gap-4" ref={dropdownRef}>
        <button
          onClick={() => {
            if (isLoggedIn) navigate("/feed/write");
            else setShowLogin(true);
          }}
          className="bg-white text-green-700 px-3 py-1 rounded hover:bg-gray-100"
        >
          + 글쓰기
        </button>

        {isLoggedIn ? (
          <>
            <button
              onClick={handleProfileClick}
              className="underline font-semibold hover:text-gray-200 bg-transparent border-none cursor-pointer p-0"
              type="button"
            >
              {userInfo?.nickname || userInfo?.name}님 ⏷
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-10 mt-1 w-36 bg-white text-black rounded shadow-md z-50">
                <button
                  onClick={() => {
                    navigate("/mypage");
                    setDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  마이페이지
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  로그아웃
                </button>
              </div>
            )}
          </>
        ) : (
          <button onClick={() => setShowLogin(true)} className="text-white">
            👤 로그인
          </button>
        )}

        {showLogin && <LoginPage onClose={() => setShowLogin(false)} />}

        
      </div>
    </header>
  );
};

export default Header;
