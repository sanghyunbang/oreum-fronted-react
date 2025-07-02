import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const parseImage = (img) => {
    try {
        const parsed = Array.isArray(img) ? img : JSON.parse(img || "[]");
        return parsed.length > 0
            ? parsed[0].startsWith("http") ? parsed[0] : `${process.env.REACT_APP_API_URL}${parsed[0]}`
            : "/placeholder.png";
    } catch {
        return "/placeholder.png";
    }
};

const GoodsLiked = () => {
    const userInfo = useSelector((state) => state.user.userInfo);
    const [isLikedMap, setIsLikedMap] = useState({}); // {goodsId: true/false, ...}
    const [liked, setLiked] = useState([]); //좋아요한 상품목록
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo) return;
        const scrollDiv = document.getElementById('root').scrollTo(0, 0);
        if (scrollDiv) scrollDiv.scrollTo(0, 0);

        const fetchData = async () => {
            // 1. 상품목록 불러오기
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/goods/likedList`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ userId: userInfo.userId }),
            });
            if (res.ok) {
                const data = await res.json();
                setLiked(data);

                // 2. 각 상품별 좋아요 체크 요청
                const likeChecks = await Promise.all(
                    data.map(async (item) => {
                        const res2 = await fetch(`${process.env.REACT_APP_API_URL}/api/goods/like/check`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify({ userId: userInfo.userId, goodsId: item.goodsId }),
                        });
                        if (res2.ok) {
                            const liked = await res2.json();
                            return [item.goodsId, liked]; // [상품ID, 좋아요 여부]
                        } else {
                            return [item.goodsId, false];
                        }
                    })
                );
                // 3. Map으로 정리
                const map = {};
                likeChecks.forEach(([goodsId, liked]) => {
                    map[goodsId] = liked;
                });
                setIsLikedMap(map);
            }
        };
        fetchData();
    }, [userInfo]);


    const doLiked = async (goodsId) => {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/goods/liked`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ userId: userInfo.userId, goodsId }),
        });
        if (res.ok) {
            const result = await res.text();
            setIsLikedMap((prev) => ({
                ...prev,
                [goodsId]: result === "liked",
            }));
            setLiked((prev) =>
                prev.map((item) =>
                    item.goodsId === goodsId
                        ? { ...item, likes: item.likes + (result === "liked" ? 1 : -1) }
                        : item
                )
            );
            if (result === "unliked") {
                alert("좋아요 취소되었습니다.");
            } else {
                alert("좋아요!!")
            }
        }
    };

    const getDiscountedPrice = (item) => {
        const discount = item.salePercent ? (1 - item.salePercent / 100) : 1;
        return Math.floor(item.price * discount);
    };

    return (
        <div>
            {liked.map((item) => (
                <div key={item.goodsId} className="flex items-center gap-4 border-t py-4">
                    <img
                        src={parseImage(item.img)}
                        alt={item.name}
                        onClick={() => navigate(`/Goods/GoodsDetail/${item.goodsId}`)}
                        className="w-[80px] h-[80px] object-cover rounded-md cursor-pointer"
                        onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                    />
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-center mb-2">
                            <span
                                className="font-semibold cursor-pointer"
                                onClick={() => navigate(`/Goods/GoodsDetail/${item.goodsId}`)}
                            >
                                {item.name}
                            </span>
                        </div>
                        {/* <div className="text-gray-500 mb-1">옵션없음 | 1개</div> */}
                        {/* 가격부분: 왼쪽 정렬 */}
                        <div className="flex flex-col items-start">
                            <span className="ml-0 font-semibold">
                                {item.salePercent ? (
                                    <>
                                        <span className="line-through text-gray-400 mr-2">
                                            {(item.price).toLocaleString()}원
                                        </span>
                                        <br />
                                        <span className="py-1 pr-1 text-base font-bold text-red-600">
                                            {item.salePercent}%
                                        </span>
                                        {(getDiscountedPrice(item)).toLocaleString()}원
                                    </>
                                ) : (
                                    <>
                                        {(getDiscountedPrice(item)).toLocaleString()}원
                                    </>
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center w-[72px] h-[44px] bg-white rounded">
                        <button onClick={() => doLiked(item.goodsId)}>
                            {isLikedMap[item.goodsId] ? <FaHeart color="red" /> : <FaRegHeart color="gray" />}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
export default GoodsLiked;