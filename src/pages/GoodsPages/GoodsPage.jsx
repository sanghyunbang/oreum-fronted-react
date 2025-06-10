import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GoodsCategory from "./GoodsCategory";

const Goods = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const images = [
    "/Goods_img/등산스틱.jpeg",
    "/Goods_img/물병걸이.jpeg",
    "/Goods_img/캠핑가방.jpeg",
    "/Goods_img/이벤트.jpeg",
    "/Goods_img/등산용품.jpeg",
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <header className="text-center text-2xl my-5 font-semibold">스토어</header>
      <hr className="my-6" />

      <div className="w-full max-w-[700px] mx-auto bg-white mb-8">
        <Slider {...settings}>
          {images.map((src, idx) => (
            <div key={idx} className="w-full pt-[56.25%] relative bg-white">
              <img src={src} alt={`slide-${idx}`} className="absolute top-0 left-0 w-full h-full object-contain" />
            </div>
          ))}
        </Slider>
      </div>
      <div className="w-full max-w-screen-xl mx-auto px-4">
        <GoodsCategory/>
      </div>
    </div>
  );
};

export default Goods;
