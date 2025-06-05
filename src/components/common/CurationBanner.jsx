// src/components/common/CurationBanner.jsx
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const CurationBanner = () => {
  const slides = [
    { text: "🏞 체력별 난이도↓\n알록달록 추천 코스\nBEST 8", bg: "bg-blue-600" },
    { text: "👟 초보 산행 추천 코스\n무난하고 쉬운 루트\nBEST 9", bg: "bg-green-500" },
    { text: "🌸 봄꽃 따라가는 트레킹\n봄 향기 가득 코스", bg: "bg-pink-500" },
    { text: "🌊 바다 보며 걷는 등산길\n힐링 산책 추천", bg: "bg-cyan-600" },
    { text: "🌄 일출 명소\n일찍 떠나는 사람들을 위한 추천", bg: "bg-orange-500" },
    { text: "🌙 야경이 아름다운 코스\n밤하늘 산행", bg: "bg-indigo-600" },
    { text: "🍁 단풍철 가을산 코스\nBEST 단풍길", bg: "bg-red-600" },
    { text: "❄️ 눈꽃 산행지\n겨울왕국 추천 코스", bg: "bg-gray-700" },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // ✅ 한 개씩만 보이게
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  return (
    <div className="w-full font-sans space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-semibold flex items-center gap-1">
          🧭 <span>오름의 테마별 큐레이션</span>
        </h3>
        <button className="text-[10px] text-blue-600 hover:underline">전체보기 →</button>
      </div>

      <p className="text-[10px] text-gray-500">오름이 제안하는 추천 코스를 살펴보세요!</p>

      <div className="w-full overflow-hidden">
        <Slider {...settings}>
          {slides.map((slide, idx) => (
            <div key={idx} className="px-1">
              <div
                className={`rounded-md p-2 text-white text-[12px] font-bold whitespace-pre-line shadow min-h-[80px] ${slide.bg}`}
              >
                {slide.text}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default CurationBanner;
