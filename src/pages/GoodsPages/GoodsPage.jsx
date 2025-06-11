import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GoodsCategory from "./GoodsCategory";
import GoodsBest from "./GoodsBest";

const Goods = () => {
  const HeaderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const BestSettings = {
    dots: false,           // 아래 점 안 보임
    infinite: false,       // 무한 루프 아님 (필요하면 true)
    speed: 500,            // 슬라이드 넘어가는 속도
    slidesToShow: 3,       // 슬라이드에 보여지는 수
    variableWidth: true,
    arrows: false,         // 화살표도 안 보임 (필요하면 true로)
    swipe: true,           // 터치/드래그 가능
    draggable: true,       // 마우스로 드래그 가능
  };

  const products1 = [
    { id: 1, img: "/Goods_img/header.jpeg"},
    { id: 2, img: "/Goods_img/header1.jpeg"},
    { id: 3, img: "/Goods_img/header2.jpeg"},
    { id: 4, img: "/Goods_img/header3.jpeg"},
    { id: 5, img: "/Goods_img/header4.jpeg"},
  ]
  const products2 = [
    { id: 1, img: "/Goods_img/캠핑가방.jpeg", name: "캠핑가방", category: "기타", price: 15000, salePercent: 20 },
    { id: 2, img: "/Goods_img/청바지.jpeg", name: "청바지", category: "하의", price: 35000, salePercent: 10 },
    { id: 3, img: "/Goods_img/운동화.jpeg", name: "운동화", category: "신발", price: 65000}, // 할인 없음
    { id: 4, img: "/Goods_img/등산스틱.jpeg", name: "등산스틱", category: "기타", price: 12000, salePercent: 15 },
    { id: 5, img: "/Goods_img/후드티.jpeg", name: "후드티", category: "상의", price: 28000, salePercent: 30 },
  ]

  return (
    <div className="w-full max-w-4xl min-w-[600px] mx-auto px-4 border border-gray-200">
      <header className="text-center text-3xl my-5 font-semibold">스토어</header>
      <hr className="my-8" />

      <div className="w-full max-w-[700px] mx-auto bg-white mb-[50px] padding 0 5px">
        <Slider {...HeaderSettings}>
          {products1.map((p, idx) => (
            <div key={idx} className="aspect-ratio:16/9 position: relative">
              <img src={p.img} alt={`slide-${idx}`} className="w-full h-full object-contain" />
            </div>
          ))}
        </Slider>
      </div>
      <header className="text-2xl font-semibold">OREUM 추천 상품</header>
        <Slider {...BestSettings}>
          {products2.map((p) => (
            <div key={p.id} className="flex justify-center py-4">
              <GoodsBest product={p} />
            </div>
          ))}
        </Slider>
      <div className="w-full max-w-screen-xl mx-auto px-4 mb-[32px]">
        <GoodsCategory />
      </div>
    </div>
  );
};

export default Goods;
