import { useState } from "react";
import { FaArrowLeft, FaHome, FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const parseImage = (img) => {
  try {
    const parsed = Array.isArray(img) ? img : JSON.parse(img || "[]");
    return parsed.length > 0 ? `http://localhost:8080${parsed[0]}` : "/placeholder.png";
  } catch {
    return "/placeholder.png";
  }
};

const GoodsReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState("");
  const userInfo = useSelector((state) => state.user.userInfo);
  const { orderId, orderItemId, goodsName, goodsImg, optionName, qty, price } = location.state || {};

  const validate = () => {
    if (!rating) { setError("별점을 선택해주세요."); return false; }
    if (!review.trim()) { setError("리뷰 내용을 입력해주세요."); return false; }
    setError("");
    return true;
  };

  const doSubmit = async () => {
    if (!validate()) return;
    try {
      const res = await fetch("http://localhost:8080/api/goods/addReview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: userInfo.userId, orderItemId, orderId, rating, review }),
      });
      if (!res.ok) throw new Error();
      alert("리뷰가 등록되었습니다.\n+50 POINTS");
      navigate("/Goods/GoodsDelivery");
    } catch {
      alert("리뷰 작성에 실패했습니다. 잠시후 다시 시도해주십시오.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 font-sans text-gray-800">
      <header className="flex items-center justify-between pb-4 border-b mb-8">
        <button onClick={() => navigate("/Goods/GoodsDelivery")} className="flex items-center text-gray-600 hover:text-black">
          <FaArrowLeft className="mr-2" /> 뒤로
        </button>
        <h1 className="text-2xl font-bold text-center flex-1">리뷰 작성</h1>
        <button onClick={() => navigate("/Goods")} className="text-xl text-gray-600 hover:text-black">
          <FaHome />
        </button>
      </header>

      <div className="bg-white border rounded-lg p-5 shadow-sm">
        <img src={parseImage(goodsImg)} alt={goodsName} className="w-32 sm:w-40 md:w-52 lg:w-64 h-auto object-cover rounded-lg mb-5 mx-auto" onError={(e) => (e.currentTarget.src = "/placeholder.png")} />
        <ul className="text-m text-gray-700 mb-3">
          <li className="pb-1 border-b">
            <strong>제품명: {goodsName}</strong> ({optionName}) - {qty}개 / {price?.toLocaleString() || "0"}원
          </li>
          <li className="mt-2">주문 번호: {orderId}</li>
        </ul>

        <div className="mt-5 mb-3">
          <label className="block mb-1 font-medium">별점</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer text-2xl transition-colors ${
                  (hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300"
                }`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">리뷰 내용</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="리뷰를 작성해주세요"
            className="w-full h-32 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          type="button"
          onClick={doSubmit}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          리뷰 작성
        </button>
      </div>
    </div>
  );
};

export default GoodsReview;
