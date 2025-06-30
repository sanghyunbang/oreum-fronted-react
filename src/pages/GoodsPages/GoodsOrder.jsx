import { FaHome, FaArrowLeft, FaPercent, FaTag, FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const GoodsOrder = () => {
  const [formData, setFormData] = useState({
    addressname: "",
    addressnumber: "",
    zipcode: "",
    addressbasic: "",
    addressdetail: "",
    request: "",
    maxPoints: 0,
    point: 0,
    total: "0",
  });

  const [selectedMethod, setSelectedMethod] = useState({
    pg: "kakaopay.TC0ONETIME",
    method: "kakaopay",
    label: "카카오페이",
  });

  const [impReady, setImpReady] = useState(false);
  const [tempPoints, setTempPoints] = useState(0);
  const [errors, setErrors] = useState({});

  const userInfo = useSelector((state) => state.user.userInfo);
  const location = useLocation();
  const navigate = useNavigate();

  const paymentMethods = [
    { pg: "kakaopay.TC0ONETIME", method: "kakaopay", label: "카카오페이" },
    { pg: "tosspay.tosstest", method: "tosspay", label: "토스페이" },
    { pg: "danal", method: "phone", label: "휴대폰 결제" },
    { pg: "smilepay", method: "smilepay", label: "스마일페이" },
    { pg: "payco.PARTNERTEST", method: "payco", label: "페이코" },
  ];

  const { items = [] } = location.state || {};

  const addressnameRef = useRef();
  const addressnumberRef = useRef();
  const zipcodeRef = useRef();
  const addressbasicRef = useRef();
  const addressdetailRef = useRef();

  const doChange = (e) => {
    const { name, value } = e.target;
    if (name === "point") {
      const cleanValue = value.replace(/^0+(?=\d)/, "");
      setTempPoints(Math.max(0, Number(cleanValue)));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const getDiscountedPrice = (item) => {
    const discount = item.salePercent ? 1 - item.salePercent / 100 : 1;
    return Math.floor(item.price * discount);
  };

  const calculateTotalDiscounted = useCallback(() => {
    return items.reduce(
      (sum, item) => sum + getDiscountedPrice(item) * item.qty,
      0
    );
  }, [items]);

  const calculateTotalOriginal = () => {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  const calculateSavings = () => {
    return calculateTotalOriginal() - calculateTotalDiscounted();
  };

  const DeliveryAddress = () => {
    if (!window.daum?.Postcode) {
      alert("주소 검색 로딩 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    new window.daum.Postcode({
      oncomplete: (data) => {
        const fullAddress = data.address;
        const postalCode = data.zonecode;
        setFormData((prev) => ({
          ...prev,
          zipcode: postalCode,
          addressbasic: fullAddress,
        }));
      },
    }).open();
  };

  useEffect(() => {
    const newTotal =
      calculateTotalDiscounted() - Number.parseInt(formData.point || "0");
    setFormData((prev) => {
      return prev.total !== newTotal ? { ...prev, total: newTotal } : prev;
    });
  }, [formData.point, items, calculateTotalDiscounted]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/v1/iamport.js";
    script.async = true;
    script.onload = () => {
      console.log("IMP 로딩 완료");
      setImpReady(true);
    };
    script.onerror = () => {
      alert("아임포트 스크립트 로딩 실패");
    };
    document.body.appendChild(script);
  }, []);

  const doIamportPayment = async () => {
    const newErrors = {};
    if (!formData.addressname.trim())
      newErrors.addressname = "수령인을 입력해주세요.";
    if (!formData.addressnumber.trim())
      newErrors.addressnumber = "연락처를 입력해주세요.";
    if (!formData.zipcode.trim())
      newErrors.zipcode = "우편번호를 등록해주세요.";
    if (!formData.addressbasic.trim())
      newErrors.addressbasic = "주소를 등록해주세요.";
    if (!formData.addressdetail.trim())
      newErrors.addressdetail = "상세주소를 입력해주세요.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.addressname) addressnameRef.current.focus();
      else if (newErrors.addressnumber) addressnumberRef.current.focus();
      else if (newErrors.zipcode) zipcodeRef.current.focus();
      else if (newErrors.addressbasic) addressbasicRef.current.focus();
      else if (newErrors.addressdetail) addressdetailRef.current.focus();
      return;
    }

    if (!document.getElementById("agreement").checked) {
      alert("결제 약관에 동의해야 결제가 가능합니다.");
      return;
    }

    if (!impReady) {
      alert("결제 모듈이 아직 로딩되지 않았습니다.");
      return;
    }

    if (formData.total === 0) {
      await doPayment();
      alert("결제 성공! 주문을 완료합니다.");
      return;
    }
    const { IMP } = window;
    IMP.init("imp02018483");

    IMP.request_pay(
      {
        pg: selectedMethod.pg,
        pay_method: selectedMethod.method,
        merchant_uid: "order_" + new Date().getTime(),
        name: items.map((cart) => cart.goods_name).join(", "),
        amount: parseInt(formData.total || 0),
        buyer_email: userInfo.email,
        buyer_name: userInfo.nickname,
        buyer_tel: "010-1234-5678",
        buyer_addr: formData.addressbasic + " " + formData.addressdetail,
        buyer_postcode: formData.zipcode,
      },
      async function (rsp) {
        if (rsp.success) {
          alert("결제 성공! 주문을 완료합니다.");
          await doPayment();
        } else {
          alert("결제 취소되었습니다.");
        }
      }
    );
  };

  const doPayment = async () => {
    const res = await fetch(
      "http://localhost:8080/api/goods/addOrder",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: userInfo.userId, ...formData }),
      }
    );

    if (res.ok) {
      const orderId = await res.json();
      const itemsWithOrderId = items.map((item) => ({
        order_id: orderId,
        goods_options_id: item.goods_options_id ?? item.option_id,
        qty: item.qty,
        item_price: getDiscountedPrice(item),
      }));

      const response = await fetch(
        "http://localhost:8080/api/goods/addOrderItem",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ items: itemsWithOrderId }),
        }
      );

      if (response.ok) {
        const delCart = await fetch(
          "http://localhost:8080/api/goods/deleteCart",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              id: items.map((item) => item.goods_options_id),
            }),
          }
        );
        if (delCart.ok) {
          navigate("/Goods/GoodsDelivery");
        }
      }
    }
  };

  useEffect(() => {
    const scrollDiv = document.getElementById('root').scrollTo(0, 0);
    if (scrollDiv) scrollDiv.scrollTo(0, 0);
    const doUser = async () => {
      const res = await fetch(
        "http://localhost:8080/api/goods/getUserPoints",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ userId: userInfo.userId }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, maxPoints: data ?? 0 }));
      }
    };
    doUser();
  }, [userInfo]);

  const doPoint = () => {
    const usable = Math.min(tempPoints, formData.maxPoints);
    setFormData((prev) => ({ ...prev, point: usable }));
    setTempPoints(usable);
  };

  const parseImage = (img) => {
    try {
      const parsed = Array.isArray(img) ? img : JSON.parse(img || "[]");
      return parsed.length > 0
        ? parsed[0].startsWith("http")
          ? parsed[0]
          : `http://localhost:8080${parsed[0]}`
        : "/placeholder.png";
    } catch {
      return "/placeholder.png";
    }
  };

  return (
    <div className="max-w-3xl min-w-[600px] mx-auto p-5 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between border-b pb-4 mb-6">
        <button
          onClick={() => navigate(`/Goods`)}
          className="flex items-center text-1xl hover:text-gray-900"
        >
          <FaArrowLeft className="mr-2" /> 뒤로
        </button>
        <h1 className="text-2xl font-bold text-center flex-1">주문서</h1>
        <button
          onClick={() => navigate("/Goods")}
          className="text-2xl hover:text-gray-900"
        >
          <FaHome size={20} />
        </button>
      </header>

      <div className="space-y-8">
        {/* 배송지 정보 */}
        <section className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-xl font-bold mb-4 flex items-center border-b pb-2">
            배송지 정보
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block mb-1">수령인</label>
              <input ref={addressnameRef} type="text" name="addressname" value={formData.addressname}
                onChange={doChange} placeholder="수령인 이름"
                className={`w-full px-3 py-2 border ${errors.addressname ? "border-red-500" : "border-gray-300"
                  } rounded-md`}
              />
              {errors.addressname && (
                <p className="text-red-500 text-sm">{errors.addressname}</p>
              )}
            </div>

            <div>
              <label className="block mb-1">연락처</label>
              <input ref={addressnumberRef} type="text" name="addressnumber" value={formData.addressnumber}
                onChange={doChange} placeholder="ex) 01012345678"
                className={`w-full px-3 py-2 border ${errors.addressnumber ? "border-red-500" : "border-gray-300"
                  } rounded-md`}
              />
              {errors.addressnumber && (
                <p className="text-red-500 text-sm">{errors.addressnumber}</p>
              )}
            </div>

            <div>
              <label className="block mb-1">주소</label>
              <div className="flex gap-2 mb-2">
                <input ref={zipcodeRef} type="text" name="zipcode" value={formData.zipcode}
                  readOnly placeholder="우편번호"
                  className={`w-1/3 px-3 py-2 border ${errors.zipcode ? "border-red-500" : "border-gray-300"
                    } rounded-md bg-gray-100`}
                />
                <button type="button" onClick={DeliveryAddress}
                  className="px-4 py-2 bg-green-500 text-white rounded-md"
                >
                  배송지 등록
                </button>
              </div>
              {errors.zipcode && (
                <p className="text-red-500 text-sm -mt-2 mb-3">{errors.zipcode}</p>
              )}
              <input ref={addressbasicRef} type="text" name="addressbasic" value={formData.addressbasic}
                readOnly placeholder="기본 주소"
                className={`w-full px-3 py-2 mb-2 border ${errors.addressbasic ? "border-red-500" : "border-gray-300"
                  } rounded-md bg-gray-100`}
              />
              {errors.addressbasic && (
                <p className="text-red-500 text-sm -mt-2 mb-3">{errors.addressbasic}</p>
              )}

              <input ref={addressdetailRef} type="text" name="addressdetail" value={formData.addressdetail}
                onChange={doChange} placeholder="상세 주소"
                className={`w-full px-3 py-2 border ${errors.addressdetail ? "border-red-500" : "border-gray-300"
                  } rounded-md`}
              />
              {errors.addressdetail && (
                <p className="text-red-500 text-sm">{errors.addressdetail}</p>
              )}
            </div>

            <div>
              <label className="block mb-1">요청사항 (선택)</label>
              <input type="text" name="request" value={formData.request || ""}
                onChange={doChange} placeholder="요청사항을 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </section>

        {/* 주문 상품 */}
        <section className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-xl font-bold mb-4 flex items-center border-b pb-2">
            <FaTag className="mr-2" /> 주문 상품
          </h2>
          <div className="space-y-4">
            {items.length ? (
              items.map((cart, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 border-b pb-4 last:border-b-0"
                >
                  <div className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                    <img src={parseImage(cart.img)} alt={cart.goods_name}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() =>
                        navigate(`/Goods/GoodsDetail/${cart.goods_id}`)
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 cursor-pointer"
                          onClick={() => navigate(`/Goods/GoodsDetail/${cart.goods_id}`)}
                        >
                          {cart.goods_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {cart.brand} | {cart.option_name || "옵션없음"} |{" "}
                          {cart.qty}개
                        </p>
                      </div>
                      <div className="text-right">
                        {cart.salePercent ? (
                          <>
                            <p className="line-through text-sm text-gray-400">
                              {(cart.price * cart.qty).toLocaleString()}원
                            </p>
                            <p className="font-bold text-red-600 flex items-center justify-end">
                              {cart.salePercent}
                              <FaPercent className="ml-1" size={12} /> 할인
                            </p>
                            <p className="font-bold">
                              {(getDiscountedPrice(cart) * cart.qty).toLocaleString()}원
                            </p>
                          </>
                        ) : (
                          <p className="font-bold">
                            {(cart.price * cart.qty).toLocaleString()}원
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                선택된 상품이 없습니다.
              </div>
            )}
          </div>
        </section>

        {/* 포인트 */}
        <section className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-xl font-bold mb-4 flex items-center border-b pb-2">
            <FaMoneyBillWave className="mr-2" /> 포인트 사용
          </h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input type="number" name="point" value={tempPoints.toString()}
                onChange={doChange} placeholder="사용할 포인트"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              />
              <button type="button" onClick={doPoint}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
                포인트 적용
              </button>
            </div>
            <p className="text-sm text-gray-600">
              보유 포인트:{" "}
              <span className="font-semibold">
                {formData.maxPoints.toLocaleString()}
              </span>
            </p>
          </div>
        </section>

        {/* 결제 금액 */}
        <section className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-xl font-bold mb-4 flex items-center border-b pb-2">
            결제 금액
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between py-1">
              <span>상품 총액</span>
              <span>{calculateTotalOriginal().toLocaleString()}원</span>
            </div>
            {calculateSavings() > 0 && (
              <div className="flex justify-between py-1 text-red-600">
                <span>할인 금액</span>
                <span>-{calculateSavings().toLocaleString()}원</span>
              </div>
            )}
            <div className="flex justify-between py-1">
              <span>포인트 사용</span>
              <span>
                -{Number.parseInt(formData.point || "0").toLocaleString()}원
              </span>
            </div>
            <div className="border-t mt-2 pt-3 flex justify-between font-bold text-lg">
              <span>최종 결제금액</span>
              <span className="text-green-600">
                {parseInt(formData.total || "0").toLocaleString()}원
              </span>
            </div>
          </div>
        </section>

        {/* 결제 수단 */}
        <section className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-xl font-bold mb-4 flex items-center border-b pb-2">
            <FaCreditCard className="mr-2" /> 결제 방법
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {paymentMethods.map((method, idx) => (
              <button key={idx} type="button" onClick={() => setSelectedMethod(method)}
                className={`border py-3 rounded-md text-center ${selectedMethod.method === method.method &&
                    selectedMethod.pg === method.pg
                    ? "bg-green-100"
                    : "hover:bg-gray-100"
                  }`}
              >
                {method.label}
              </button>
            ))}
          </div>
          <div className="flex items-start mt-4">
            <input type="checkbox" id="agreement" className="mt-1 mr-2" />
            <label htmlFor="agreement" className="text-sm">
              [필수] 결제 약관 및 개인정보 처리방침 동의
            </label>
          </div>
        </section>

        {/* 결제 버튼 */}
        <button
          type="button"
          onClick={doIamportPayment}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-md text-lg font-bold"
        >
          {parseInt(formData.total || "0").toLocaleString()}원 결제하기 (
          {selectedMethod.label})
        </button>
      </div>
    </div>
  );
}

export default GoodsOrder;
