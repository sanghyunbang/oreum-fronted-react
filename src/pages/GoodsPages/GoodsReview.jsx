import { useEffect, useState } from "react";
import { FaArrowLeft, FaHome, FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const GoodsReview = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(0); // 실제 선택된 별점
    const [hoverRating, setHoverRating] = useState(0); // 마우스 올렸을 때 별점
    const userInfo = useSelector((state) => state.user.userInfo);
    const { orderId, orderItemId, goodsName, goodsImg, optionName, qty, price } = location.state || {};

    const doSubmit = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/goods/addReview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ id: userInfo.userId, orderItemId, orderId, rating, review }),
            });
            if (!res.ok) throw new Error();
            alert("리뷰가 등록되었습니다.");
            navigate("/Goods");
        } catch {
            alert("리뷰 작성에 실패했습니다. 잠시후 다시 시도해주십시오.");
        }
    };

    return (
        <div className="max-w-3xl min-w-[600px] mx-auto p-5">
            <header className="flex items-center justify-between pb-4 border-b mb-10">
                <button onClick={() => navigate("/Goods/GoodsDelivery")} className="flex items-center text-gray-700 hover:text-gray-900">
                    <FaArrowLeft className="mr-2" /> 뒤로
                </button>
                <h1 className="text-3xl font-bold text-center flex-1">리뷰 작성</h1>
                <button onClick={() => navigate("/Goods")} className="text-2xl text-gray-700 hover:text-gray-900">
                    <FaHome />
                </button>
            </header>
            <div>
                <img src={goodsImg} alt={goodsName} className="w-full max-w-xs h-auto rounded-lg mb-4" />
                <ul className="space-y-1 text-sm text-gray-800">
                    <li className="border-b pb-1">
                        <strong>{goodsName}</strong> ({optionName}) - {qty}개 / {price ? price.toLocaleString() : "0"}원
                    </li>
                </ul>
                <p>주문 번호: {orderId}</p>

                {/* 별점 UI */}
                <div className="flex space-x-1 mt-5">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                            key={star}
                            className={`cursor-pointer text-2xl ${
                                (hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300"
                            }`}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                        />
                    ))}
                </div>

                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="리뷰를 작성해주세요"
                    className="w-full h-40 p-3 border rounded mt-4"
                />
                <button
                    type="button"
                    onClick={doSubmit}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    리뷰 작성
                </button>
            </div>
        </div>
    );
};

export default GoodsReview;
