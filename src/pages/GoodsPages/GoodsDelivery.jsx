import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHome, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import Slider from "react-slick";

const GoodsDelivery = () => {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.userInfo);
  const [formData, setFormData] = useState([]);
  const [dragging, setDragging] = useState(false); // ✅ 드래그 상태 관리

  //주문 목록 불러오기
  useEffect(() => {
    const doDelivery = async () => {
      const res = await fetch("http://localhost:8080/api/goods/deliveryList", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: userInfo.userId }),
      });
      if (res.ok) {
        const data = await res.json();
        setFormData(data);
      }
    };
    doDelivery();
  }, [userInfo]);

  //주문 취소
  const cancelOrder = async (id) => {
    try {
      if (window.confirm("정말 주문을 취소 하시겠습니까?")) {
        setFormData((prev) => prev.filter((addr) => addr.id !== id));
        const response = await fetch("http://localhost:8080/api/goods/cancelOrder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ order_id: id }),
        });
        const data = await response.text();
        if (data === "1") {
          alert("주문이 취소되었습니다.");
        }
      }
    } catch {
      alert("결제 취소 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  //리뷰 페이지 이동
  const addReview = (orderId, orderItemId, goodsName, goodsImg, optionName, qty, price) => {
    navigate("/Goods/GoodsReview", {
      state: { orderId, orderItemId, goodsName, goodsImg, optionName, qty, price },
    });
  };

  const handleImageClick = (goodsId) => {
    if (!dragging) {
      navigate(`/Goods/GoodsDetail/${goodsId}`);
    }
  };

  return (
    <div className="max-w-3xl min-w-[600px] mx-auto p-5">
      <header className="flex items-center justify-between pb-4 border-b mb-10">
        <button onClick={() => navigate("/Goods")} className="flex items-center text-gray-700 hover:text-gray-900">
          <FaArrowLeft className="mr-2" /> 뒤로
        </button>
        <h1 className="text-3xl font-bold text-center flex-1">주문 내역</h1>
        <button onClick={() => navigate("/Goods")} className="text-2xl text-gray-700 hover:text-gray-900">
          <FaHome />
        </button>
      </header>

      <div className="space-y-4">
        {formData.map((addr) => (
          <div key={addr.order_id} className="border rounded p-4 bg-white shadow-md">
            <div className="flex flex-col md:flex-row gap-6 items-start">

              {/* 왼쪽: 이미지 슬라이더 (상품별 첫 이미지만) */}
              <div className="w-full md:w-[300px]">
                {addr.items.length > 1 ? (
                  <Slider
                    dots={true}
                    beforeChange={() => setDragging(true)}
                    afterChange={() => setTimeout(() => setDragging(false), 100)}
                  >
                    {addr.items.map((item, index) => {
                      const images = Array.isArray(item.img) ? item.img : JSON.parse(item.img || "[]");
                      const firstImg = images[0] || "/placeholder.png";
                      return (
                        <div key={index}>
                          <img
                            src={firstImg}
                            alt={`${item.goods_name} ${index + 1}`}
                            onClick={() => handleImageClick(item.goods_id)}
                            className="w-full h-[250px] object-cover rounded-md cursor-pointer"
                          />
                        </div>
                      );
                    })}
                  </Slider>
                ) : (
                  // 이미지가 하나일 경우 슬라이더 없이 표시
                  <img
                    src={(() => {
                      const images = Array.isArray(addr.items[0].img)
                        ? addr.items[0].img
                        : JSON.parse(addr.items[0].img || "[]");
                      return images[0] || "/placeholder.png";
                    })()}
                    alt={addr.items[0].goods_name}
                    onClick={() => handleImageClick(addr.items[0].goods_id)}
                    className="w-full h-[250px] object-cover rounded-md cursor-pointer"
                  />
                )}
              </div>

              {/* 오른쪽: 배송지 + 상품 정보 + 버튼들 */}
              <div className="flex-1 space-y-2">
                <p className="font-semibold text-lg">
                  수령인: {addr.addressname}{" "}
                  <span className="text-sm text-gray-500">({addr.addressnumber})</span>
                </p>
                <p className="text-gray-600 text-sm">
                  {addr.zipcode} {addr.addressbasic} {addr.addressdetail}
                </p>
                <p className="text-sm text-gray-500">요청사항: {addr.request || "없음"}</p>
                <div className="mt-2">
                  <ul className="space-y-1 text-sm text-gray-800">
                    {addr.items.map((item, index) => (
                      <li key={index} className="border-b pb-1 flex justify-between items-center">
                        <span>
                          <strong>{item.goods_name}</strong> ({item.option_name}) - {item.qty}개 /{" "}
                          {(item.item_price * item.qty).toLocaleString()}원
                        </span>
                        {addr.status === "배송완료" &&
                          (item.reviewWritten ? (
                            <span className="text-gray-400 text-sm">리뷰 완료</span>
                          ) : (
                            <button
                              className="text-blue-500 hover:text-blue-700 text-sm whitespace-nowrap"
                              onClick={() =>
                                addReview( addr.order_id, item.order_item_id, item.goods_name, item.img, item.option_name, item.qty, item.item_price)
                              }
                            >
                              리뷰달기
                              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-[11px] font-semibold">
                                +50P
                              </span>
                            </button>
                          ))}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col items-end space-y-2 pt-4">
                  <span
                    className={`text-sm font-bold px-3 py-1 rounded-full 
                    ${addr.status === "결제완료"
                        ? "bg-yellow-100 text-yellow-800"
                        : addr.status === "배송중"
                        ? "bg-yellow-100 text-yellow-800"
                        : addr.status === "배송완료"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-600"
                      }`}
                  >
                    {addr.status}
                  </span>

                  {addr.status === "결제완료" && (
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => cancelOrder(addr.order_id)}
                    >
                      결제취소 <FaTrash />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoodsDelivery;
