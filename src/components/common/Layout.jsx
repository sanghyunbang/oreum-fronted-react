// Layout.jsx
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/userSlice';

const Layout = () => {
  const location = useLocation();
  const [isMapPage, setIsMapPage] = useState(false);
  const [loading, setLoading] = useState(true); // 로그인 복원 대기용
  const dispatch = useDispatch();

  // 여기에 curation 모드도 추가할 예정
  useEffect(() => {
    setIsMapPage(location.pathname === '/map' || location.pathname === '/writeForCuration');
  }, [location.pathname]);

  // 자동 로그인 복구
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/user", { withCredentials: true })
      .then((res) => {
        console.log("자동 로그인 응답:", res.data);
        dispatch(login(res.data));
      })
      .catch(() => {
        console.log("자동 로그인 실패");
      })
      .finally(() => {
        setLoading(false); // 무조건 false로
      });
  }, [dispatch]);

  if (loading) return null; // 복원 전에는 아무것도 렌더링하지 않음

  return (
    <div className="min-h-screen bg-white overflow-y-auto">
      <header className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </header>

      <footer className="fixed bottom-0 left-0 right-0 z-50">
        <Footer />
      </footer>

      {!isMapPage && (
        <aside className="fixed top-16 bottom-16 left-0 w-60 z-40">
          <Sidebar />
        </aside>
      )}

      <main
        className={`pt-16 pb-16 px-4
          ${isMapPage ? '' : 'ml-60 mr-60 max-w-[calc(100vw-240px-240px)]'}
        `}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
