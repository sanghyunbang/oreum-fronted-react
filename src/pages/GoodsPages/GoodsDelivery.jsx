import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHome, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";

const GoodsDelivery = () => {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.userInfo);
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    const doDelivery = async() => {
        const res = await fetch("http://localhost:8080/api/goods/deliveryList",{
            method:"POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({userId:userInfo.userId}),
        })
        if(res.ok){
            const data = await res.json();
            console.log(data);
            setFormData(data);
        }
    }
    doDelivery();
  }, [userInfo]);

  const deleteAddress = (id) => {
    // if (window.confirm("해당 배송지를 삭제하시겠습니까?")) {
    //   setFormData(prev => prev.filter(addr => addr.id !== id));
    // }
  };

  return (
    <div className="max-w-3xl min-w-[600px] mx-auto p-5">
      <header className="flex items-center justify-between pb-4 border-b mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-700 hover:text-gray-900">
          <FaArrowLeft className="mr-2" /> 뒤로
        </button>
        <h1 className="text-3xl font-bold text-center flex-1">주문 내역</h1>
        <button onClick={() => navigate("/Goods")} className="text-2xl text-gray-700 hover:text-gray-900">
          <FaHome />
        </button>
      </header>

      <div className="flex justify-end mb-4">
        {/* <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          <FaPlus className="mr-2" /> 새 배송지 추가
        </button> */}
      </div>

      <div className="space-y-4">
        {formData.map(addr => (
            <div key={addr.order_id} className="border rounded p-4 bg-white shadow-md">
            <div className="flex justify-between items-start">
                {/* 왼쪽: 배송 정보 */}
                <div className="flex-1 space-y-1">
                <p className="font-semibold text-lg">
                    {addr.addressname} <span className="text-sm text-gray-500">({addr.addressnumber})</span>
                </p>
                <p className="text-gray-600 text-sm">
                    {addr.zipcode} {addr.addressbasic} {addr.addressdetail}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    요청사항: {addr.request || "없음"}
                </p>
                </div>

                {/* 오른쪽: 상태 및 삭제 */}
                <div className="flex flex-col items-end space-y-2">
                {/* 상태 표시 */}
                <span className={`text-sm font-bold px-3 py-1 rounded-full 
                    ${addr.status === "결제완료" ? "bg-yellow-100 text-yellow-800" : 
                    addr.status === "배송중" ? "bg-yellow-100 text-yellow-800" :
                    addr.status === "배송완료" ? "bg-green-100 text-green-800" :
                    "bg-gray-200 text-gray-600"}`}>
                    {addr.status}
                </span>

                {/* 삭제 버튼 (결제완료일 때만 표시) */}
                {addr.status === "결제완료" && (
                    <button className="text-red-500 hover:text-red-700" onClick={() => deleteAddress(addr.order_id)}>
                    결제취소<FaTrash />
                    </button>
                )}
                </div>
            </div>
            </div>
        ))}
        </div>
    </div>
  );
};

export default GoodsDelivery;
