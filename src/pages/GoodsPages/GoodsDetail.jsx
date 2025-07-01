import { useEffect, useState } from "react";
import Slider from "react-slick";
import { FaHeart, FaRegHeart, FaShare, FaStar, FaHome, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector } from "react-redux";

const GoodsDetail = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [selectedOption, setSelectedOption] = useState([]);
  const [goods, setGoods] = useState({});
  const [goodsOpt, setGoodsOpt] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const userInfo = useSelector((state) => state.user.userInfo);
  const { id } = useParams();
  const navigate = useNavigate();

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const addOption = (e) => {
    if (!e.target.value) return;
    const selected = JSON.parse(e.target.value);

    if (selected.stockQty === 0) {
      alert("품절된 옵션입니다.");
      return;
    }

    const exists = selectedOption.some((opt) => opt.id === selected.id);
    if (exists) {
      alert("이미 선택된 옵션입니다.");
      return;
    }

    const mergedOption = {
      ...selected,
      qty: 1,
      goods_id: goods.id,
      goods_name: goods.name,
      brand: goods.brand,
      price: goods.price,
      salePercent: goods.salePercent,
      img: Array.isArray(goods.img) ? goods.img : JSON.parse(goods.img || "[]"),
      goods_options_id: selected.id,
      option_name: selected.option_name,
      stock_qty: selected.stockQty,
    };

    setSelectedOption((prev) => [...prev, mergedOption]);
  };

  const removeOption = (id) => {
    setSelectedOption((prev) => prev.filter((opt) => opt.id !== id));
  };

  const totalPrice = selectedOption.reduce((acc, opt) => {
    const unitPrice = Number(goods.price * (1 - goods.salePercent / 100)) || 0;
    return acc + unitPrice * opt.qty;
  }, 0);

  const doLiked = async () => {
    const res = await fetch("http://localhost:8080/api/goods/liked", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId: userInfo.userId, goodsId: goods.id }),
    });
    if (res.ok) {
      const result = await res.text();
      setIsLiked(result === "liked");
      setGoods((prev) => ({
        ...prev,
        likes: prev.likes + (result === "liked" ? 1 : -1),
      }));
    }
  };

  const handleAddToCart = async () => {
    if (!userInfo) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (selectedOption.length === 0) {
      alert("옵션을 선택해주세요.");
      return;
    }
    const response = await fetch("http://localhost:8080/api/goods/cartAdd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        userId: userInfo.userId,
        options: selectedOption.map((opt) => ({ id: opt.id, qty: opt.qty })),
      }),
    });
    const data = await response.text();
    if (data === "0") {
      alert("현재 장바구니에 담긴 상품이 있습니다.");
      return;
    }
    alert("장바구니에 추가되었습니다!");
  };

  const doPurchase = async () => {
    if (!userInfo) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (selectedOption.length === 0) {
      alert("옵션을 선택해주세요.");
      return;
    }
    const response = await fetch("http://localhost:8080/api/goods/cartAdd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        userId: userInfo.userId,
        options: selectedOption.map((opt) => ({ id: opt.id, qty: opt.qty })),
      }),
    });
    if (response.ok) {
      navigate("/Goods/GoodsOrder", { state: { items: selectedOption } });
    }
  };

  useEffect(() => {
    const LikeCh = async () => {
      const response = await fetch("http://localhost:8080/api/goods/like/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: userInfo.userId, goodsId: goods.id }),
      });
      if (response.ok) {
        const data = await response.json();
        setIsLiked(data);
      }
    };
    if (userInfo?.userId && goods?.id) {
      LikeCh();
    }
  }, [userInfo, goods.id]);

  useEffect(() => {
    const doList = async () => {
      const res = await fetch(`http://localhost:8080/api/goods/detailList?id=${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      setGoods(data[0]);
      const scrollDiv = document.getElementById('root').scrollTo(0, 0);
      if (scrollDiv) scrollDiv.scrollTo(0, 0);
    };
    const doOptionList = async () => {
      const res = await fetch(`http://localhost:8080/api/goods/detailListOpt?id=${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      setGoodsOpt(data);
    };
    const doReview = async () => {
      const res = await fetch(`http://localhost:8080/api/goods/listReview?id=${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      setReviews(data);
    };
    doList();
    doOptionList();
    doReview();
  }, [id]);

  // ✅ 모든 옵션 품절 여부
  const allSoldOut = Array.isArray(goodsOpt) && goodsOpt.every((opt) => opt.stockQty === 0);

  return (
    <>
      <div className="max-w-3xl min-w-[600px] mx-auto p-5 font-sans">
        <header className="flex items-center justify-between px-4 py-2 mb-[80px]">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-700 hover:text-gray-900">
            <FaArrowLeft className="mr-2" /> 뒤로
          </button>
          <h5 className="text-center flex-1 text-2xl font-bold -ml-1">{goods.name}</h5>
          <div className="text-2xl cursor-pointer z-10 mr-5" onClick={() => navigate("/Goods")}>
            <FaHome />
          </div>
          <div className="text-2xl cursor-pointer z-10" onClick={() => navigate("/Goods/GoodsCart")}>
            <FaShoppingCart />
          </div>
          <div className="w-6" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          <div className="relative mb-5">
            <Slider {...sliderSettings}>
              {(Array.isArray(goods.img) ? goods.img : JSON.parse(goods.img || "[]")).map((image, index) => (
                <div key={index}>
                  <img src={image} alt={`${goods.name} ${index + 1}`} className="w-full h-[400px] object-cover rounded-lg" />
                </div>
              ))}
            </Slider>
          </div>

          <div className="py-5">
            <h1 className="text-2xl font-bold mb-3 text-gray-800">{goods.name}</h1>

            <div className="mb-5">
              {goods.salePercent ? (
                <>
                  <span className="line-through text-gray-400 text-base mr-2">{goods.price?.toLocaleString()}원</span>
                  <br />
                  <span className="py-1 pr-1 text-base font-bold text-red-600">{goods.salePercent}%</span>
                  {(goods.price * (1 - goods.salePercent / 100))?.toLocaleString()}원
                </>
              ) : (
                <>
                  {goods.price?.toLocaleString()}
                  <span className="text-sm font-bold text-gray-600 ml-1">원</span>
                </>
              )}
            </div>
            <hr></hr>

            <div className=" p-4 rounded-lg mb-5">
              <div>
                <strong>배송비:</strong> 무료
              </div>
              <div>
                <strong>배송일:</strong> 영업일 기준 2-3일 이내
              </div>
            </div>

            <div className="flex justify-end mb-5">
              {allSoldOut ? (<></>) : (
                <select onChange={addOption} value="" className="w-auto max-w-[200px] border border-gray-300 rounded p-2">
                  <option value="">상품 옵션</option>
                  {Array.isArray(goodsOpt) &&
                    goodsOpt.map((opt) => (
                      <option
                        key={opt.id}
                        value={JSON.stringify({ id: opt.id, option_name: opt.optionName, stockQty: opt.stockQty })}
                        disabled={opt.stockQty === 0}
                        style={{ color: opt.stockQty === 0 ? "#999" : "#000" }}
                      >
                        {opt.optionName} {opt.stockQty === 0 ? "(품절)" : opt.stockQty <= 10 ? `(재고 ${opt.stockQty}개)` : ""}
                      </option>
                    ))}
                </select>
              )}
            </div>

            {selectedOption.map((opt, idx) => (
              <div key={idx} className="border border-gray-200 mb-1">
                <div className="flex items-center border rounded-md overflow-hidden">
                  <span className="ml-5 mr-[100px]">
                    {opt.option_name}{" "}
                    {opt.stock_qty <= 10 ? <span className="text-red-500">(재고 {opt.stock_qty}개)</span> : ""}
                  </span>
                  <button className="text-red-500 ml-auto mr-3" onClick={() => removeOption(opt.id)}>
                    X
                  </button>
                </div>
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button
                    className="w-10 h-9 bg-gray-100"
                    onClick={() =>
                      setSelectedOption((prev) =>
                        prev.map((o) => (o.id === opt.id ? { ...o, qty: Math.max(1, o.qty - 1) } : o))
                      )
                    }
                  >
                    -
                  </button>
                  <p value={opt.qty} readOnly className="w-12 h-9 flex items-center justify-center border-none">{opt.qty}</p>
                  <button
                    className="w-10 h-9 bg-gray-100"
                    onClick={() => {
                      if (opt.qty >= opt.stock_qty) {
                        alert(`최대 재고 ${opt.stock_qty}개를 초과할 수 없습니다.`);
                        return;
                      }
                      setSelectedOption((prev) =>
                        prev.map((o) => o.id === opt.id ? { ...o, qty: o.qty + 1 } : o)
                      );
                    }}
                  >
                    +
                  </button>
                  <p className="ml-auto mr-5">{Math.floor(goods.price * (1 - goods.salePercent / 100))?.toLocaleString()}원</p>
                </div>
              </div>
            ))}

            <div className="mt-6 mb-6">
              <div className="flex justify-between items-center border-t pt-2 text-lg font-semibold">
                <span>총 결제금액</span>
                <span className="text-emerald-500 text-xl">{Math.floor(totalPrice).toLocaleString()}원</span>
              </div>
            </div>

            <div className="flex gap-2 mb-5">
              <div className="flex flex-col items-center justify-center w-[72px] h-[44px] bg-white rounded">
                <button onClick={doLiked}>
                  {isLiked ? <FaHeart color="red" /> : <FaRegHeart color="gray" />}
                </button>
                <span className="text-sm text-gray-700">{goods.likes}</span>
              </div>

              {allSoldOut ? (
                <button disabled className="w-full h-[44px] bg-gray-200 text-gray-400 font-bold rounded cursor-not-allowed" >
                  품절
                </button>
              ) : (
                <>
                  <button className="w-[124px] h-[44px] bg-white border rounded border-gray-300" onClick={handleAddToCart}>
                    장바구니
                  </button>
                  <button className="w-[124px] h-[44px] bg-black text-white rounded" onClick={doPurchase}>
                    구매하기
                  </button>
                </>
              )}

              <button onClick={() => {  alert("URL이 복사되었습니다."); }} className="w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center">
                <FaShare />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300">
          <div className="flex border-b border-gray-300">
            {["details", "reviews", "qna"].map((tab) => (
              <button
                key={tab}
                className={`py-4 px-8 border-b-2 ${activeTab === tab ? "border-blue-600 text-blue-600 font-bold" : "border-transparent"
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "details" ? "상세정보" : tab === "reviews" ? `제품후기(${reviews?.length || 0})` : "제품문의"}
              </button>
            ))}
          </div>
          <div className="py-8">
            {activeTab === "details" && (
              <div>
                <h3 className="text-xl font-bold mb-10 text-center">상품 상세정보</h3>
                <div className="mb-4" dangerouslySetInnerHTML={{ __html: goods.description || "설명이 없습니다." }} />
              </div>
            )}
            {activeTab === "reviews" && (
              <div>
                <h3 className="text-xl font-bold mb-4">제품후기</h3>
                {Array.isArray(reviews) && reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.reviewId} className="p-5 border-b">
                      <div className="flex items-start mb-3">
                        <img
                          src={review.profileImage || "/placeholder-profile.png"}
                          alt="profile"
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <div className="font-semibold text-gray-800">{review.nickname}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString("ko-KR")}
                            </div>
                          </div>
                          <div className="flex mt-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p>{review.content}</p>
                    </div>
                  ))
                ) : (
                  <p>리뷰가 없습니다.</p>
                )}
              </div>
            )}
            {activeTab === "qna" && (
              <div>
                <h3 className="text-xl font-bold mb-4">문의</h3>
                <p>상품에 대한 문의사항이 있으시면 언제든 연락주세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .ql-align-center { text-align: center; }
        .ql-align-center img {
          display: inline-block;
          margin: 0 auto;
          float: none;
          width: auto !important;
          max-width: 100%;
        }
        .ql-align-right { text-align: right; }
        .ql-align-left { text-align: left; }
      `}</style>
    </>
  );
};

export default GoodsDetail;
