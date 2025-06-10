import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import RightAside from './RightAside';
import MiniDisplay from '../board/MiniDisplay';

const Layout = () => {
  const location = useLocation();
  const [isMapPage, setIsMapPage] = useState(false);

  useEffect(() => {
    setIsMapPage(location.pathname === '/map');
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white overflow-y-auto">
      {/*Header 고정 */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </header>

      {/*Footer 고정 */}
      <footer className="fixed bottom-0 left-0 right-0 z-50">
        <Footer />
      </footer>

      {/*왼쪽 Sidebar (고정) */}
      {!isMapPage && (
        <aside className="fixed top-16 bottom-16 left-0 w-60 z-40">
          <Sidebar />
        </aside>
      )}

      {/* 오른쪽 사이드바 (고정) */}
      {!isMapPage && (
        <aside className="fixed top-16 bottom-16 right-4 w-[300px] z-40 pointer-events-none">
          <div className="pointer-events-auto">
            <MiniDisplay />
          </div>
        </aside>
      )}


      {/* 메인 콘텐츠 */}
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
