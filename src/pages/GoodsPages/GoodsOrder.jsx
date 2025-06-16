import { FaHome, FaArrowLeft, FaPercent, FaTag, FaCreditCard, FaMoneyBillWave } from "react-icons/fa"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const GoodsOrder = () => {
  const [formData, setFormData] = useState({
    addressname: "",
    addressnumber: "",
    zipcode: "",
    addressbasic: "",
    addressdetail: "",
    request: "",
    point: "",
  })
  const navigate = useNavigate()

  const [Goods, setGoods] = useState([
    {id: 1, img: "/Goods_img/캠핑가방.jpeg", name: "캠핑가방", category: "기타", brand: "아디다스", price: 15000, salePercent: 20, option: "M", qty: 5,},
    {id: 2, img: "/Goods_img/청바지.jpeg", name: "청바지", category: "하의", brand: "아디다스", price: 35000, salePercent: 10, option: "S", qty: 1,},
    {id: 3, img: "/Goods_img/운동화.jpeg", name: "운동화", category: "신발", brand: "아디다스", price: 65000, option: "S", qty: 2,},
    {id: 4, img: "/Goods_img/등산스틱.jpeg", name: "등산스틱", category: "기타", brand: "아디다스", price: 12000, salePercent: 15, option: "L", qty: 1,},
    {id: 5, img: "/Goods_img/후드티.jpeg", name: "후드티", category: "상의", brand: "아디다스", price: 28000, salePercent: 30, option: "M", qty: 1,},
  ])

  //폼데이터로 저장
  const doChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const doPoint = () => {
    // Point usage logic would go here
  }

  //물건 할인 가격
  const getDiscountedPrice = (item) => {
    const discount = item.salePercent ? 1 - item.salePercent / 100 : 1
    return Math.floor(item.price * discount)
  }

  //할인가격 포함 안 된 총가격
  const calculateTotalOriginal = () => {
    return Goods.reduce((sum, item) => sum + item.price * item.qty, 0)
  }

  //할인가격 포함된 총가격
  const calculateTotalDiscounted = () => {
    return Goods.reduce((sum, item) => sum + getDiscountedPrice(item) * item.qty, 0)
  }

  //할인 금액 계산
  const calculateSavings = () => {
    return calculateTotalOriginal() - calculateTotalDiscounted()
  }

  //결제
  const doPayment = () => {
    alert("결제되었습니다");
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
  }, [])

  return (
    <div className="max-w-4xl min-w-[600px] mx-auto p-5 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between border-b pb-4 mb-6">
        <button onClick={()=>navigate(-1)} className="flex items-center text-gray-700 hover:text-gray-900">
          <FaArrowLeft className="mr-2" /> 뒤로
        </button>
        <h1 className="text-2xl font-bold text-center flex-1">주문서</h1>
        <button onClick={()=>navigate("/Goods")} className="text-gray-700 hover:text-gray-900">
          <FaHome size={20} />
        </button>
      </header>

      <div className="space-y-8">
        {/* Shipping Information */}
        <section className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-xl font-bold mb-4 flex items-center border-b pb-2">배송지 정보</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">수령인</label>
              <input type="text" name="addressname" value={formData.addressname} onChange={doChange} placeholder="이름을 입력해주세요."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
              <input type="text" name="addressnumber" value={formData.addressnumber} onChange={doChange} placeholder="ex) 010-1234-5678"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">배송지</label>
              <div className="flex gap-2 mb-2">
                <input type="text" name="zipcode" value={formData.zipcode} readOnly placeholder="우편번호"
                  className="w-1/3 px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
                <button type="button" onClick={DeliveryAddress} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  배송지 등록
                </button>
              </div>

              <input type="text" name="addressbasic" value={formData.addressbasic} readOnly placeholder="주소를 입력해주세요."
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 mb-2"
              />

              <input type="text" name="addressdetail" value={formData.addressdetail} onChange={doChange} placeholder="상세 주소를 입력해주세요."
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
            {Goods.length ? (
              Goods.map((cart, idx) => (
                <div key={idx} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
                  <div className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                    <img src={cart.img || "/placeholder.svg"} alt={cart.name} className="w-full h-full object-cover cursor-pointer" onClick={()=>navigate(`/Goods/GoodsDetail/${cart.id}`)}/>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 cursor-pointer" onClick={()=>navigate(`/Goods/GoodsDetail/${cart.id}`)}>{cart.name}</h3>
                        <p className="text-sm text-gray-500">
                          {cart.brand} | {cart.option || "옵션없음"} | {cart.qty}개
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
              <button className="border py-3 rounded-md hover:bg-gray-100 transition-colors flex flex-col items-center justify-center">
                <span>신용 · 체크카드</span>
              </button>
              <button className="border py-3 rounded-md bg-green-100 hover:bg-green-200 transition-colors flex flex-col items-center justify-center">
                <span>N pay</span>
              </button>
              <button className="border py-3 rounded-md bg-yellow-100 hover:bg-yellow-200 transition-colors flex flex-col items-center justify-center">
                <span>카카오페이</span>
              </button>
              <button className="border py-3 rounded-md bg-blue-100 hover:bg-blue-200 transition-colors flex flex-col items-center justify-center">
                <span>토스페이</span>
              </button>
              <button className="border py-3 rounded-md hover:bg-gray-100 transition-colors flex flex-col items-center justify-center">
                <span>SAMSUNG Pay</span>
              </button>
              <button className="border py-3 rounded-md hover:bg-gray-100 transition-colors flex flex-col items-center justify-center">
                <span>SSG PAY</span>
              </button>
              <button className="border py-3 rounded-md hover:bg-gray-100 transition-colors flex flex-col items-center justify-center">
                <span>L PAY</span>
              </button>
            </div>

            <div>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>카드사 선택</option>
                <option>신한카드</option>
                <option>삼성카드</option>
                <option>현대카드</option>
                <option>KB국민카드</option>
                <option>롯데카드</option>
                <option>BC카드</option>
                <option>하나카드</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">신용카드 무이자 할부 안내</p>
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
        <button className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-md text-lg font-bold transition-colors"
        onClick={doPayment}>
          {(calculateTotalDiscounted() - Number.parseInt(formData.point || "0")).toLocaleString()}원 결제하기
        </button>
      </div>
    </div>
  )
}

export default GoodsOrder;
