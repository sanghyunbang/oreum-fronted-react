import React from "react";
import { useNavigate } from "react-router-dom";

export default function WriteTypeModal({ onClose }) {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      {/* 배경 클릭 시 닫기 */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative z-10 w-96 bg-white rounded-2xl shadow-2xl p-6 animate-fade-in">
        <h3 className="text-xl font-bold text-gray-800 text-center mb-6">✍️ 글쓰기 유형 선택</h3>

        <div className="space-y-4">
          <button
            onClick={() => handleNavigate("/feed/write")}
            className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-blue-100 text-blue-900 hover:bg-blue-200 transition-all shadow hover:shadow-md"
          >
            <div className="text-left">
              <p className="text-base font-semibold">일반 글쓰기</p>
              <p className="text-xs text-blue-800">자유로운 생각이나 후기를 남겨보세요</p>
            </div>
            <span className="text-xl">📝</span>
          </button>

          <button
            onClick={() => handleNavigate("/writeForCuration")}
            className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-green-100 text-green-900 hover:bg-green-200 transition-all shadow hover:shadow-md"
          >
            <div className="text-left">
              <p className="text-base font-semibold">큐레이션 글쓰기</p>
              <p className="text-xs text-green-800">지도와 함께 경로를 정리해보세요</p>
            </div>
            <span className="text-xl">🗺️</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
      </div>
    </div>
  );
}
