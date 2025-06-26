import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GoodsCategory from "./GoodsCategory";
import GoodsBest from "./GoodsBest";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Goods = () => {
  const [Goods, setGoods] = useState([]);
  const [GoodsOptions, setGoodsOptions] = useState([]);
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
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    variableWidth: true,
    swipe: true,
    draggable: true,
  };

  const products1 = [
    { id: 1, img: "/Goods_img/header.jpeg" },
    { id: 2, img: "/Goods_img/header1.jpeg" },
    { id: 3, img: "/Goods_img/header2.jpeg" },
    { id: 4, img: "/Goods_img/header3.jpeg" },
    { id: 5, img: "/Goods_img/header4.jpeg" },
  ];

  useEffect(() => {
    const doListAll = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/goods/listAll", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const res = await fetch("http://localhost:8080/api/goods/itemListAll", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await response.json();
        const data1 = await res.json();

        setGoods(data);
        setGoodsOptions(data1);
      } catch (error) {
        console.error("상품 목록 불러오기 실패:", error);
      }
    };
    doListAll();
  }, []);

  const campaignClick = (p) => {
    navigate("/Goods/campaign=" + p.id);
  };

  const productsClick = (p) => {
    navigate(`/Goods/GoodsDetail/${p.id}`);
  };

  // 품절 여부 확인 함수
  const isSoldOut = (goodsId) => {
    const relatedOptions = GoodsOptions.filter(o => o.goodsId === goodsId);
    return relatedOptions.length > 0 && relatedOptions.every(opt => opt.stockQty === 0);
  };

  return (
    <div className="w-full max-w-3xl min-w-[600px] mx-auto px-4 border border-gray-200">
      <header className="text-center text-3xl my-5 font-semibold">스토어
        <button className="mx-10" onClick={() => navigate("/Goods/GoodsCart")}>장바구니</button>
        <button className="mx-10" onClick={() => navigate("/Goods/GoodsAdd")}>상품추가</button>
        <button onClick={() => navigate("/Goods/GoodsDelivery")}>주문내역</button>
      </header>
      <hr className="my-8" />

      <div className="w-full max-w-[700px] mx-auto bg-white mb-[50px] padding 0 5px">
        <Slider {...HeaderSettings}>
          {products1.map((p, idx) => (
            <div key={idx} className="aspect-ratio:16/9 position: relative" onClick={() => campaignClick(p)}>
              <img src={p.img} alt={`slide-${idx}`} className="w-full h-full object-contain" />
            </div>
          ))}
        </Slider>
      </div>

      <header className="text-2xl font-semibold">OREUM 인기 상품</header>
      <Slider {...BestSettings}>
        {Goods.slice(0, 3).map((p, index) => {
          const soldOut = isSoldOut(p.id);
          return (
            <div
              key={p.id}
              className={`flex justify-center py-4 ${soldOut ? 'opacity-50' : ''} pointer-events-auto cursor-pointer`} // pointer-events-none 제거
              onClick={() => productsClick(p)} // 항상 이동 가능
            >
              <div className="relative">
                {soldOut && (
                  <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded z-10">품절</div>
                )}
                <GoodsBest product={p} rank={index + 1} />
              </div>
            </div>
          );
        })}
      </Slider>

      <div className="w-full max-w-screen-xl mx-auto px-4 mb-[32px]">
        <GoodsCategory
          product={Goods}
          soldOutIds={Goods.filter(g => {
            const relatedOptions = GoodsOptions.filter(o => o.goodsId === g.id);
            return relatedOptions.length > 0 && relatedOptions.every(o => o.stockQty === 0);
          }).map(g => g.id)}
        />
      </div>
    </div>
  );
};

export default Goods;
