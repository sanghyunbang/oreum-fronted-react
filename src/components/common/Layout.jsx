// src/components/common/Layout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import RightAside from './RightAside';

const Layout = () => {
  const location = useLocation();
  const isMapPage = location.pathname === '/map';

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      {/* 고정 Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </header>

      {/* 고정 Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-50">
        <Footer />
      </footer>

      {/* 고정 Sidebar */}
      {!isMapPage && (
        <aside className="fixed top-16 bottom-16 left-0 w-60 z-40">
          <Sidebar />
        </aside>
      )}

      {/* 고정 RightAside */}
      {!isMapPage && (
        <aside className="fixed top-16 bottom-16 right-0 w-60 z-40">
          <RightAside />
        </aside>
      )}

      {/* ✅ 메인 콘텐츠 (스크롤 가능 영역) */}
      <main className="absolute top-16 bottom-16 left-60 right-60 overflow-y-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
