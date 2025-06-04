import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function MiniDisplay() {
  const [search, setSearch] = useState("");
  const [desti, setDesti] = useState([]);

  const destinations = [
    { id: 1, name: "설악산", image: "/images/seorak.jpg" },
    { id: 2, name: "지리산", image: "/images/jiri.jpg" },
    { id: 3, name: "북한산", image: "/images/bukhan.jpg" },
    { id: 4, name: "한라산", image: "/images/halla.jpg" },
    { id: 5, name: "덕유산", image: "/images/deogyu.jpg" },
    { id: 6, name: "속리산", image: "/images/sokri.jpg" },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768, // 모바일
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const filtered = destinations.filter((d) => d.name.includes(search));

  return (
    <div className="w-full max-w-xs p-4 bg-gray-100 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold">이번주엔 어디로 갈까요?</h4>
        <button className="text-blue-600 hover:underline text-sm">전체보기 &gt;</button>
      </div>

      <input
        type="text"
        placeholder="어느 산을 찾으시나요?"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
      />

      <Slider {...settings}>
        {filtered.map((dest) => (
          <div key={dest.id} className="px-2">
            <img
              src={dest.image}
              alt={dest.name}
              className="w-full h-24 object-cover rounded-md"
            />
            <p className="mt-2 text-center text-sm font-medium text-gray-700">
              {dest.name}
            </p>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default MiniDisplay;
