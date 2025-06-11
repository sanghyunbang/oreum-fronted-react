import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GoodsCategory from "./GoodsCategory";
import GoodsBest from "./GoodsBest";
import { useNavigate } from "react-router-dom";

const Goods = () => {
  const navigate = useNavigate();

  const HeaderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    swipe: true,
    draggable: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const BestSettings = {
    dots: false,           // 아래 점 안 보임
    infinite: false,       // 무한 루프 아님 (필요하면 true)
    speed: 500,            // 슬라이드 넘어가는 속도
    slidesToShow: 3,       // 슬라이드에 보여지는 수
    variableWidth: true,
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
    { id: 1, img: "/Goods_img/캠핑가방.jpeg", name: "캠핑가방", category: "기타", brand:"아디다스", price: 15000, salePercent: 20, }, //likes: 80,
    { id: 2, img: "/Goods_img/청바지.jpeg", name: "청바지", category: "하의", brand:"아디다스", price: 35000, salePercent: 10, },
    { id: 3, img: "/Goods_img/운동화.jpeg", name: "운동화", category: "신발", brand:"아디다스", price: 65000}, // 할인 없음
    { id: 4, img: "/Goods_img/등산스틱.jpeg", name: "등산스틱", category: "기타", brand:"아디다스", price: 12000, salePercent: 15 },
    { id: 5, img: "/Goods_img/후드티.jpeg", name: "후드티", category: "상의", brand:"아디다스", price: 28000, salePercent: 30 },
  ]

  const campaignClick = (p)=>{
    navigate("/Goods/campaign="+p.id);
  }

  const productsClick = (p)=>{
    navigate(`/Goods/GoodsDetail/${p.id}`);
  }

  return (
    <div className="w-full max-w-4xl min-w-[600px] mx-auto px-4 border border-gray-200">
      <header className="text-center text-3xl my-5 font-semibold">스토어</header>
      <hr className="my-8" />

      <div className="w-full max-w-[700px] mx-auto bg-white mb-[50px] padding 0 5px">
        <Slider {...HeaderSettings}>
          {products1.map((p, idx) => (
            <div key={idx} className="aspect-ratio:16/9 position: relative" onClick={()=>campaignClick(p)}>
              <img src={p.img} alt={`slide-${idx}`} className="w-full h-full object-contain" />
            </div>
          ))}
        </Slider>
      </div>
      <header className="text-2xl font-semibold">OREUM 인기 상품</header>
        <Slider {...BestSettings}>
          {products2.slice(0, 3).map((p, index) => (
            <div key={p.id} className="flex justify-center py-4" onClick={()=>productsClick(p)}>
              <GoodsBest product={p} rank={index + 1} />
            </div>
          ))}
        </Slider>
      <div className="w-full max-w-screen-xl mx-auto px-4 mb-[32px]">
        <GoodsCategory product={products2}/>
      </div>
    </div>
  );
};

export default Goods;
