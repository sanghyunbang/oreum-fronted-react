// src/components/common/Sidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaChartLine,
  FaMapMarkedAlt,
  FaUsers,
  FaPlus,
  FaStar,
} from "react-icons/fa";
import CurationBanner from "./CurationBanner"; // ✅ 추가

const Sidebar = () => {
  const navigate = useNavigate();

  const recentMountains = ["지리산", "설악산", "한라산"];
  const communities = [
    { name: "지리산", icon: "🏞️" },
    { name: "북한산", icon: "🌄" },
    { name: "한라산", icon: "⛰️" },
    { name: "대둔산", icon: "🏔️" },
    { name: "himedia", icon: "🌲" },
  ];

  return (
    <aside className="w-[250px] px-4 py-6 bg-white border-r border-gray-200 text-sm space-y-6 overflow-y-auto h-full">
      
      {/* ✅ 추가된 배너 */}
      <div className="mt-6">
        <CurationBanner />
      </div>
      {/* 네비게이션 */}
      <nav className="space-y-3">
        <div
          className="flex items-center gap-2 cursor-pointer hover:text-green-600"
          onClick={() => navigate("/")}
        >
          <FaHome /> <span>홈</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:text-green-600">
          <FaChartLine /> <span>인기 게시글</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:text-green-600"
        onClick={() => navigate("/map")}>
          <FaMapMarkedAlt /> <span>등산 지도</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:text-green-600">
          <FaUsers /> <span>모임/동행</span>
        </div>
      </nav>

      {/* 커스텀 큐레이션 */}
      <div>
        <h4 className="text-gray-700 font-semibold mb-2">나만의 피드</h4>
        <div className="flex items-center gap-2 text-blue-600 cursor-pointer hover:underline">
          <FaPlus size={12} /> <span>맞춤 피드 만들기</span>
        </div>
      </div>

      {/* 최근 본 산 */}
      <div>
        <h4 className="text-gray-700 font-semibold mb-2">최근 본 산</h4>
        <ul className="space-y-1 text-gray-800">
          {recentMountains.map((mountain) => (
            <li
              key={mountain}
              className="cursor-pointer hover:text-green-700"
              onClick={() => navigate(`/mountain/${mountain}`)}
            >
              {mountain}
            </li>
          ))}
        </ul>
      </div>

      {/* 등산 커뮤니티 */}
      <div>
        <h4 className="text-gray-700 font-semibold mb-2">등산 커뮤니티</h4>
        <ul className="space-y-2">
          {communities.map((com) => (
            <li
              key={com.name}
              className="flex justify-between items-center cursor-pointer hover:text-green-700"
              onClick={() => navigate(`/community/${com.name}`)}
            >
              <span>
                {com.icon} {com.name}
              </span>
              <FaStar className="text-gray-300 hover:text-yellow-400" />
            </li>
          ))}
        </ul>
      </div>

    </aside>
  );
};

export default Sidebar;
