import { FaHome, FaArrowLeft, FaPercent, FaTag, FaCreditCard, FaMoneyBillWave } from "react-icons/fa"
import { useState, useEffect, useCallback } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

const GoodsOrder = () => {
  const [formData, setFormData] = useState({ addressname: "", addressnumber: "", zipcode: "", addressbasic: "", addressdetail: "", request: "", point: "",total:"0" })
  const [selectedMethod, setSelectedMethod] = useState({ pg: "kakaopay.TC0ONETIME", method: "kakaopay", label: "카카오페이" });
  const [impReady, setImpReady] = useState(false);
  const userInfo = useSelector((state) => state.user.userInfo);
  const location = useLocation();
  const navigate = useNavigate()
  const paymentMethods = [
    { pg: "kakaopay.TC0ONETIME", method: "kakaopay", label: "카카오페이" },
    { pg: "tosspay.tosstest",   method: "tosspay",  label: "토스페이" },
    { pg: "danal",              method: "phone",    label: "휴대폰 결제" },
    { pg: "smilepay",          method: "smilepay",   label: "스마일페이" },
    { pg: "payco.PARTNERTEST", method: "payco",     label: "페이코"},
  ];
  const { items = [] } = location.state || {};

  //폼데이터로 저장
  const doChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const doPoint = () => {
    // Point usage logic would go here
  }

  //물건 할인 가격
  const getDiscountedPrice = (item) => {
    const discount = item.salePercent ? 1 - item.salePercent / 100 : 1
    return Math.floor(item.price * discount)
  }

  //할인가격 포함된 총가격
  const calculateTotalDiscounted = useCallback(() => {
    return items.reduce((sum, item) => sum + getDiscountedPrice(item) * item.qty, 0);
  }, [items]);

  //할인가격 포함 안 된 총가격
  const calculateTotalOriginal = () => {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0)
  }

  //포인트 포함된 총결제 금액 계산
  useEffect(() => {
    const newTotal = calculateTotalDiscounted() - Number.parseInt(formData.point || "0");
    setFormData((prev) => {
      return prev.total !== newTotal
        ? { ...prev, total: newTotal }
        : prev; // 변경 없으면 그대로 반환 (불필요한 렌더링 방지)
    });
  }, [formData.point, items, calculateTotalDiscounted]);

  //할인 금액 계산
  const calculateSavings = () => {
    return calculateTotalOriginal() - calculateTotalDiscounted()
  }

  //주소명 가져오는 API
  const DeliveryAddress = () => {
    if (!window.daum?.Postcode) {
      alert("주소 검색 로딩 중입니다. 잠시 후 다시 시도해주세요.")
      return
    }

    new window.daum.Postcode({
      oncomplete: (data) => {
        const fullAddress = data.address
        const postalCode = data.zonecode
        setFormData((prev) => ({ ...prev, zipcode: postalCode, addressbasic: fullAddress }))
      },
    }).open()
  }
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
    script.async = true
    document.body.appendChild(script)
  }, [])   //여기까지 주소api


  //아임포트 api 생성 및 확인
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/v1/iamport.js"; // ✅ 새 CD
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

  //주문 결제
  const doIamportPayment = () => {
    if (!formData.addressname || !formData.addressnumber || !formData.zipcode || !formData.addressbasic || !formData.addressdetail) {
      alert("모든 배송 정보를 입력해주세요.");
      return;
    }
    if (!document.getElementById("agreement").checked) {
      alert("결제 약관에 동의해야 결제가 가능합니다.");
      return;
    }
    if (!impReady) {
      alert("결제 모듈이 아직 로딩되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    const { IMP } = window;
    IMP.init("imp02018483"); // 아임포트 테스트용 가맹점 코드

    //아임포트(결제시스템)에 결과 전송하는 데이터
    IMP.request_pay({
      pg: selectedMethod.pg,
      pay_method: selectedMethod.method,
      merchant_uid: "order_" + new Date().getTime(),
      name: items.map((cart) => cart.goods_name).join(", "),
      amount: parseInt(formData.total || "0"),
      buyer_email: "tester@example.com",
      buyer_name: "홍길동",
      buyer_tel: "010-1234-5678",
      buyer_addr: formData.addressbasic + " " + formData.addressdetail,
      buyer_postcode: formData.zipcode,
    }, async function (rsp) {
      if (rsp.success) {
        alert("결제 성공! 주문을 완료합니다.");
        await doPayment();
      } else {
        alert("결제 취소되었습니다.");
      }
    });
  };

  //결제하기
  const doPayment = async (e) => {
    if (!formData.addressname || !formData.addressnumber || !formData.zipcode || !formData.addressbasic || !formData.addressdetail) {
      alert("모든 필수 배송 정보를 입력해주세요.");
      return;
    }
    const res = await fetch("http://localhost:8080/api/goods/addOrder",{
      method:"POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({userId:userInfo.userId, ...formData}),
    })
    if(res.ok){
      const orderId = await res.json();
      const itemsWithOrderId = items.map(item => ({
        order_id: orderId,
        goods_options_id: item.goods_options_id ?? item.option_id,
        qty: item.qty,
        item_price: getDiscountedPrice(item),
      }));
      const response = await fetch("http://localhost:8080/api/goods/addOrderItem",{
        method:"POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({items: itemsWithOrderId}),
      })
      if(response.ok){
        const delCart = await fetch("http://localhost:8080/api/goods/deleteCart",{
          method:"POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            id: items.map(item => item.goods_options_id),
          }),
        })
        if(delCart.ok){
          navigate("/Goods/GoodsDelivery");
        }
      }
    }
  }

  //결제할때 팝업 확인
  useEffect(() => {
  const checkIMP = setInterval(() => {
    if (window.IMP) {
      setImpReady(true);
      clearInterval(checkIMP);
    }
  }, 100); // 0.1초마다 확인
  // 만약 5초 안에 안 뜨면 타임아웃 처리
  setTimeout(() => clearInterval(checkIMP), 10000);
  }, []);
  

  // useEffect(()=>{
  //   const doUser = async() =>{
  //     const res = await fetch("http://localhost:8080/api/goods/getUserPoint",{
  //       method:"POST",
  //       headers: { "Content-Type": "application/json" },
  //       credentials: "include",
  //       body: JSON.stringify({userId:userInfo.userId}),
  //     })
  //     if(res.ok){

  //     }
  //   }
  //   doUser();
  // },[userInfo])

  return (
    <div className="max-w-4xl min-w-[600px] mx-auto p-5 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between border-b pb-4 mb-6">
        <button onClick={()=>navigate(`/Goods`)} className="flex items-center text-1xl hover:text-gray-900">
          <FaArrowLeft className="mr-2" /> 뒤로
        </button>
        <h1 className="text-2xl font-bold text-center flex-1">주문서</h1>
        <button onClick={()=>navigate("/Goods")} className="text-2xl hover:text-gray-900">
          <FaHome size={20} />
        </button>
      </header>

      <div className="space-y-8">
        {/* <form onSubmit={doPayment}> */}
        {/* Shipping Information */}
        <section className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-xl font-bold mb-4 flex items-center border-b pb-2">배송지 정보</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">수령인</label>
              <input type="text" name="addressname" value={formData.addressname} onChange={doChange} placeholder="이름을 입력해주세요." required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
              <input type="text" name="addressnumber" value={formData.addressnumber} onChange={doChange} placeholder="ex) 010-1234-5678" required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">배송지</label>
              <div className="flex gap-2 mb-2">
                <input type="text" name="zipcode" value={formData.zipcode} readOnly placeholder="우편번호" required
                  className="w-1/3 px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
                <button type="button" onClick={DeliveryAddress} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors" required
                >
                  배송지 등록
                </button>
              </div>

              <input type="text" name="addressbasic" value={formData.addressbasic} readOnly placeholder="주소를 입력해주세요." required
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 mb-2"
              />

              <input type="text" name="addressdetail" value={formData.addressdetail} onChange={doChange} placeholder="상세 주소를 입력해주세요." required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">배송 요청사항 (선택)</label>
              <input type="text" name="request" value={formData.request || ""} onChange={doChange} placeholder="배송 요청사항을 입력해주세요."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </section>

        {/* Order Items */}
        <section className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-xl font-bold mb-4 flex items-center border-b pb-2">
            <FaTag className="mr-2" /> 주문 상품
          </h2>

          <div className="space-y-4">
            {items.length ? (
              items.map((cart, idx) => (
                <div key={idx} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
                  <div className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                    <img src={cart.img || "/placeholder.svg"} alt={cart.goods_name} className="w-full h-full object-cover cursor-pointer" onClick={()=>navigate(`/Goods/GoodsDetail/${cart.goods_id}`)}/>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 cursor-pointer" onClick={()=>navigate(`/Goods/GoodsDetail/${cart.goods_id}`)}>{cart.goods_name}</h3>
                        <p className="text-sm text-gray-500">
                          {cart.brand} | {cart.option_name || "옵션없음"} | {cart.qty}개
                        </p>
                      </div>

                      <div className="text-right">
                        {cart.salePercent ? (
                          <>
                            <p className="line-through text-sm text-gray-400">
                              {(cart.price * cart.qty).toLocaleString()}원
                            </p>
                            <p className="font-bold text-red-600 flex items-center justify-end">
                              {cart.salePercent}<FaPercent className="mr-1" size={12} /> 할인
                            </p>
                            <p className="font-bold">{(getDiscountedPrice(cart) * cart.qty).toLocaleString()}원</p>
                          </>
                        ) : (
                          <p className="font-bold">{(cart.price * cart.qty).toLocaleString()}원</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">선택된 상품이 없습니다.</div>
            )}
          </div>
        </section>

        {/* Points */}
        <section className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-xl font-bold mb-4 flex items-center border-b pb-2">
            <FaMoneyBillWave className="mr-2" /> 포인트
          </h2>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input type="number" name="point" value={formData.point} onChange={doChange} placeholder="사용할 포인트"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={doPoint}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                포인트 사용
              </button>
            </div>
            <p className="text-sm text-gray-600">
              잔여 포인트: <span className="font-semibold">1,000</span>점
            </p>
          </div>
        </section>

        {/* Payment Amount */}
        <section className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-xl font-bold mb-4 flex items-center border-b pb-2">결제금액</h2>

          <div className="space-y-2">
            <div className="flex justify-between py-1">
              <span className="text-gray-600">총 상품금액</span>
              <span>{calculateTotalOriginal().toLocaleString()}원</span>
            </div>

            {calculateSavings() > 0 && (
              <div className="flex justify-between py-1 text-red-600">
                <span>할인금액</span>
                <span>-{calculateSavings().toLocaleString()}원</span>
              </div>
            )}

            <div className="flex justify-between py-1">
              <span className="text-gray-600">배송비</span>
              <span>0원</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-gray-600">포인트 사용</span>
              <span>-{Number.parseInt(formData.point || "0").toLocaleString()}원</span>
            </div>

            <div className="border-t mt-2 pt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>최종 결제금액</span>
                <span className="text-green-600">
                  {(calculateTotalDiscounted() - Number.parseInt(formData.point || "0")).toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Method */}
        <section className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-xl font-bold mb-4 flex items-center border-b pb-2">
            <FaCreditCard className="mr-2" /> 결제 방법
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
            {paymentMethods.map((method, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedMethod(method)}
                className={`border py-3 rounded-md transition-colors flex flex-col items-center justify-center ${
                  selectedMethod.method === method.method && selectedMethod.pg === method.pg
                    ? "bg-green-100"
                    : "hover:bg-gray-100"
                }`}
              >
                <span>{method.label}</span>
              </button>
            ))}
          </div>
            <div className="flex items-start">
              <input type="checkbox" id="agreement" className="mt-1 mr-2" />
              <label htmlFor="agreement" className="text-sm">
                [필수] 결제 서비스 이용 약관, 개인정보 처리 동의
              </label>
            </div>
          </div>
        </section>

        {/* Payment Button */}
        <button type="button" onClick={doIamportPayment}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-md text-lg font-bold transition-colors"
          >
          {parseInt(formData.total || "0").toLocaleString()}원 결제하기 ({selectedMethod.label})
        </button>
        {/* </form> */}
      </div>
    </div>
  )
}

export default GoodsOrder;
