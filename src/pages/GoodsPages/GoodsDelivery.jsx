import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHome, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import Slider from "react-slick";

// ✅ S3 절대 URL 대응 이미지 파싱 함수
const parseImage = (img) => {
  try {
    const parsed = Array.isArray(img) ? img : JSON.parse(img || "[]");
    return parsed.length > 0 ? parsed[0] : "/placeholder.png";
  } catch {
    return "/placeholder.png";
  }
};

const GoodsDelivery = () => {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.userInfo);
  const [formData, setFormData] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [cancelId, setCancelId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const doDelivery = async () => {
      if (!userInfo) { alert("로그인이 필요합니다."); navigate(-1); return; }
      const scrollDiv = document.getElementById('root').scrollTo(0, 0);
      if (scrollDiv) scrollDiv.scrollTo(0, 0);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/goods/deliveryList`, {
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
  }, [userInfo, navigate]);

  const deleteDelivery = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/goods/deleteOrder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ order_id: id, reason: cancelReason }),
      })
      if (response.ok) {
        alert("결제내역이 삭제되었습니다.");
        setFormData(prev => prev.filter(o => o.order_id !== id)); //삭제시 화면에 바로 반영
      }
    } catch {
      alert("결제내역 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주십시오.");
    }
  }

  const handleCancelSubmit = async (id) => {
    if (!cancelReason) return;
    setSubmitting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/goods/cancelOrder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ order_id: id, reason: cancelReason }),
      });
      const data = await response.text();
      if (data === "1") {
        alert("주문이 취소되었습니다.");
        setFormData(prev => prev.map(o => o.order_id === id ? { ...o, status: "결제취소" } : o));
      } else {
        alert("취소 처리 실패");
      }
    } catch {
      alert("취소 요청 중 오류 발생");
    } finally {
      setSubmitting(false);
      setCancelId(null);
      setCancelReason("");
    }
  };

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
          <div
            key={addr.order_id}
            className={`border rounded p-4 shadow-md transition-all duration-300 ${addr.status === "결제취소" ? "bg-gray-100 opacity-60" : "bg-white"
              }`}
          >
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-full md:w-[300px]">
                {(addr.items?.length ?? 0) > 1 ? (
                  <Slider
                    dots={true}
                    className="!mb-2"
                    beforeChange={() => setDragging(true)}
                    afterChange={() => setTimeout(() => setDragging(false), 100)}
                  >
                    {addr.items.map((item, index) => (
                      <div key={index}>
                        <img
                          src={parseImage(item.img)}
                          alt={`${item.goods_name} ${index + 1}`}
                          onClick={() => handleImageClick(item.goods_id)}
                          className="w-full h-[250px] object-cover rounded-md cursor-pointer"
                          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <img
                    src={parseImage(addr.items?.[0]?.img)}
                    alt={addr.items?.[0]?.goods_name}
                    onClick={() => handleImageClick(addr.items?.[0]?.goods_id)}
                    className="w-full h-[250px] object-cover rounded-md cursor-pointer"
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                  />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <p className="font-semibold text-lg">
                  수령인: {addr.addressname} <span className="text-sm text-gray-500">({addr.addressnumber})</span>
                </p>
                <p className="text-gray-600 text-sm">
                  {addr.zipcode} {addr.addressbasic} {addr.addressdetail}
                </p>
                <p className="text-sm text-gray-500">요청사항: {addr.request || "없음"}</p>
                <ul className="space-y-1 text-sm text-gray-800 mt-2">
                  {addr.items.map((item, index) => (
                    <li key={index} className="border-b pb-1 flex justify-between items-center">
                      <span>
                        <strong className="cursor-pointer" onClick={() => navigate(`/Goods/GoodsDetail/${item.goods_id}`)}>{item.goods_name} ({item.option_name})</strong> - {item.qty}개 / {(item.item_price * item.qty).toLocaleString()}원
                      </span>
                      {addr.status === "배송완료" &&
                        (item.reviewWritten ? (
                          <span className="text-gray-400 text-sm">리뷰 완료</span>
                        ) : (
                          <button
                            className="text-blue-500 hover:text-blue-700 text-sm whitespace-nowrap"
                            onClick={() =>
                              addReview(addr.order_id, item.order_item_id, item.goods_name, item.img, item.option_name, item.qty, item.item_price)
                            }
                          >
                            리뷰달기
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-[11px] font-semibold">+75P</span>
                          </button>
                        ))
                      }
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col justify-between items-end h-full min-h-[120px]">
                  <span
                    className={`text-sm font-bold px-3 py-1 rounded-full ${addr.status === "결제완료"
                        ? "bg-yellow-100 text-yellow-800"
                        : addr.status === "배송중"
                          ? "bg-yellow-100 text-yellow-800"
                          : addr.status === "배송완료"
                            ? "bg-green-100 text-green-800"
                            : addr.status === "결제취소"
                              ? "bg-gray-200 text-gray-600"
                              : "bg-gray-100 text-gray-500"
                      }`}
                  >
                    {addr.status}
                  </span>
                  {addr.status === "결제취소" && (
                    <>
                      <div className="text-sm mt-3 text-gray-500">이 주문은 취소되었습니다.</div>
                      <button onClick={() => deleteDelivery(addr.order_id)}
                        className="self-end mt-auto text-red-500 hover:text-red-700 text-sm">
                        내역 삭제
                      </button>
                    </>
                  )}

                  {addr.status === "결제완료" && (
                    cancelId === addr.order_id ? (
                      <div className="w-full border-t pt-3 space-y-2">
                        <select
                          className="w-full border px-3 py-2 rounded"
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                        >
                          <option value="">취소 사유를 선택하세요</option>
                          <option value="단순변심">단순 변심</option>
                          <option value="상품 정보 상이">상품 정보 상이</option>
                          <option value="배송 지연">배송 지연</option>
                          <option value="기타">기타</option>
                        </select>
                        <div className="flex gap-2">
                          <button
                            disabled={!cancelReason || submitting}
                            onClick={() => handleCancelSubmit(addr.order_id)}
                            className="flex-1 bg-red-500 text-white rounded py-2 hover:bg-red-600 disabled:opacity-50"
                          >
                            {submitting ? "처리 중..." : "결제 취소 확인"}
                          </button>
                          <button
                            disabled={submitting}
                            onClick={() => {
                              setCancelId(null);
                              setCancelReason("");
                            }}
                            className="flex-1 border border-gray-300 text-gray-700 rounded py-2 hover:bg-gray-50"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => setCancelId(addr.order_id)}
                      >
                        결제취소 <FaTrash />
                      </button>
                    )
                  )}
                  {addr.status === "배송완료" && (
                    <button onClick={() => deleteDelivery(addr.order_id)}
                      className="self-end mt-auto text-red-500 hover:text-red-700 text-sm">
                      내역 삭제
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
