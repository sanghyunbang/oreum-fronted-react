import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaChartLine,
  FaMapMarkedAlt,
  FaUsers,
  FaPlus,
  FaStar,
  FaMinus
} from "react-icons/fa";
import CurationBanner from "./CurationBanner";
import CustomFeedModal from "./CustomFeedModal";

const mountainEmojis = [
  { label: "🏞️", value: "🏞️" },
  { label: "🌄", value: "🌄" },
  { label: "⛰️", value: "⛰️" },
  { label: "🏔️", value: "🏔️" },
  { label: "🏕️", value: "🏕️" },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const recentMountains = ["지리산", "설악산", "한라산"];
  const [communities, setCommunities] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFeedModal, setShowFeedModal] = useState(false);
  const handleFeedCreated = () => {
  
  setShowFeedModal(false);
};

  // form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(mountainEmojis[0].value);

  const fetchCommunities = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/community/list", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("커뮤니티 리스트 불러오기 실패");
      const data = await res.json();
      setCommunities(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleAddCommunity = async () => {
    if (!title.trim()) return alert("제목을 입력하세요");

    const isDuplicate = communities.some((com) => com.title === title.trim());
    if (isDuplicate) {
    return alert("이미 같은 이름의 커뮤니티가 존재합니다.");
  }

    try {
      // DTO 형태에 맞게 body 구성
      const body = {
        title,
        description,
        isPrivate,
        thumbnailUrl,
      };

      const res = await fetch("http://localhost:8080/api/community/insertpost", {
        method: "POST",
        headers: {
           "Content-Type": "application/json",
         },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("커뮤니티 추가 실패");

      // 초기화 및 폼 닫기
      setTitle("");
      setDescription("");
      setIsPrivate(false);
      setThumbnailUrl(mountainEmojis[0].value);
      setShowAddForm(false);
      fetchCommunities();
    } catch (error) {
      console.error(error);
      alert("커뮤니티 추가 중 오류가 발생했습니다.");
    }
  };

  return (
    <aside className="w-[250px] px-4 py-6 bg-white border-r border-gray-200 text-sm space-y-6 overflow-y-auto h-full">
      <div className="mt-6">
        <CurationBanner />
      </div>

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
        <div
          className="flex items-center gap-2 cursor-pointer hover:text-green-600"
          onClick={() => navigate("/map")}
        >
          <FaMapMarkedAlt /> <span>등산 지도</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:text-green-600">
          <FaUsers /> <span>모임/동행</span>
        </div>
      </nav>

      <div>
        <h4 className="text-gray-700 font-semibold mb-2 flex items-center justify-between">
          등산 커뮤니티
          <button
            onClick={() => setShowAddForm((prev) => !prev)}
            className="text-green-600 hover:text-green-800 flex items-center gap-1"
            aria-label={showAddForm ? "커뮤니티 추가 닫기" : "커뮤니티 추가"}
          >
            {showAddForm ? <FaMinus /> : <FaPlus />}
          </button>
        </h4>

        {showAddForm && (
          <div className="mb-3 space-y-2">
            <input
              type="text"
              placeholder="제목 (title)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 w-full"
            />
            <textarea
              placeholder="설명 (description)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 w-full resize-none"
              rows={3}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              비공개 커뮤니티로 설정
            </label>

            <div>
              <label className="block mb-1 font-semibold">썸네일 이미지 선택</label>
              <div className="flex gap-2 flex-wrap">
                {mountainEmojis.map((emoji) => (
                  <button
                    key={emoji.value}
                    type="button"
                    onClick={() => setThumbnailUrl(emoji.value)}
                    className={`px-3 py-1 border rounded cursor-pointer ${
                      thumbnailUrl === emoji.value
                        ? "border-green-600 bg-green-100"
                        : "border-gray-300 hover:border-green-400"
                    }`}
                  >
                    {emoji.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddCommunity}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mt-2 w-full"
            >
              추가
            </button>
          </div>
        )}

        <ul className="space-y-2">
          {communities.length === 0 ? (
            <li>로딩중...</li>
          ) : (
            communities.map((com) => (
              <li
                key={com.title} 
                className="flex justify-between items-center cursor-pointer hover:text-green-700"
                onClick={() => navigate(`/community/${com.title}`)}
              >
                <span>
                  {com.thumbnailUrl || "🏕️"} {com.title}
                </span>
                <FaStar className="text-gray-300 hover:text-yellow-400" />
              </li>
            ))
          )}
        </ul>
      </div>

      <div>
        <h4 className="text-gray-700 font-semibold mb-2">나만의 피드</h4>
        <div className="flex items-center gap-2 text-blue-600 cursor-pointer hover:underline"
        onClick={() => setShowFeedModal(true)}>
          <FaPlus size={12} /> <span>맞춤 피드 만들기</span>
        </div>
        {showFeedModal && (
        <CustomFeedModal
          onClose={() => setShowFeedModal(false)}
          onSuccess={handleFeedCreated}
        />
      )}
      </div>

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
      
    </aside>
  );
};

export default Sidebar;
