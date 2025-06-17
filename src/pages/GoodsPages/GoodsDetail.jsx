import { useEffect, useState } from "react" //useEffect
import Slider from "react-slick"
import { FaHeart, FaRegHeart, FaShare, FaStar, FaHome, FaShoppingCart } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useSelector } from "react-redux"

const GoodsDetail = () => {
  const [activeTab, setActiveTab] = useState("details")
  const [selectedOption, setSelectedOption] = useState([])
  const [goods,setGoods] = useState("");
  const [goodsOpt, setGoodsOpt] = useState("");
  const [isLiked, setIsLiked] = useState(false)
  const userInfo = useSelector((state) => state.user.userInfo);
  const { id } = useParams();  //상품 번호
  const navigate = useNavigate();

  //상품 불러오기
  useEffect(() => {
    const doList = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/goods/detailList?id=${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGoods(data[0]);
      } catch (error) {
        console.error("상품 불러오기 실패:", error);
      }
    };
    doList();
  }, [id]);

  //상품 옵션 불러오기
  useEffect(()=>{
    const doOptionList = async () => {
      try{
        const response = await fetch(`http://localhost:8080/api/goods/detailListOpt?id=${id}`,{
          method: "GET",
          headers: {"Content-Type":"applicationi/json"},
          credentials: "include",
        });
        const data = await response.json();
        setGoodsOpt(data);
      } catch (error){
        console.error("상품 옵션 불러오기 실패:", error);
      }
    }
    doOptionList();
  },[id])

  //사진
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    customPaging: () => <div className="w-2 h-2 rounded-full bg-gray-300 mx-1" />,
    dotsClass: "slick-dots custom-dots",
  }

  //옵션 추가
  const addOption = (e) => {
    if (!e.target.value) return;
    const selected = JSON.parse(e.target.value);
    const exists = selectedOption.some((opt) => opt.id === selected.id);
    if (exists) {
      alert("이미 선택된 옵션입니다.");
      return;
    }
    setSelectedOption((prev) => [...prev, { ...selected, qty: 1 }]);
  }
  useEffect(()=>{
    console.log(selectedOption);
  },[selectedOption])

  //삭제
  const removeOption = (id) => {
    setSelectedOption((prev) => prev.filter((opt) => opt.id !== id))
  }

  //총결제금액 계산
  const totalPrice = selectedOption.reduce((acc, opt) => {
    const unitPrice = Number(goods.price) || 0;
    return acc + unitPrice * opt.qty;
  }, 0);

  //장바구니 추가
  const handleAddToCart = async () => {
    if(!userInfo) {alert("로그인이 필요합니다."); return;}
    if (selectedOption.length === 0) {
      alert("옵션을 선택해주세요.");
      return;
    }
    const response = await fetch("http://localhost:8080/api/goods/cartAdd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 세션 쿠키 등 포함 (로그인 상태 유지)
      body: JSON.stringify({
        userId: userInfo.userId,
        options: selectedOption.map(opt => ({
          id: opt.id,
          qty: opt.qty
        }))
      }),
    });
    const data = await response.text();
    if (data==="0") {
      alert("해당 상품이 이미 장바구니에 존재합니다.");
      return;
    }
    // 성공 처리
    alert("장바구니에 추가되었습니다!");
  };

  return (
    <div className="max-w-4xl min-w-[600px] mx-auto p-5 font-sans">
      <header className="flex items-center justify-between px-4 py-2 mb-[80px]">
      <div className="text-2xl cursor-pointer z-10 mr-5" onClick={()=>navigate(-1)}>{"<"}</div>
      <div className="text-2xl cursor-pointer z-10" onClick={()=>navigate("/Goods")}><FaHome /></div>
      <h5 className="text-center flex-1 text-2xl font-bold -ml-6">{goods.name}</h5>
      <div className="text-2xl cursor-pointer z-10" onClick={()=>navigate("/Goods/GoodsCart")}><FaShoppingCart /></div>
      <div className="w-6" /> {/* 오른쪽 여백용 (좌우 균형 맞추기 위함) */}
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        <div className="relative mb-5">
          <Slider {...sliderSettings}>
            {(Array.isArray(goods.img) ? goods.img : JSON.parse(goods.img || "[]")).map((image, index) => (
              <div key={index}>
                <img
                  src={image}
                  alt={`${goods.name} ${index + 1}`}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
              </div>
            ))}
          </Slider>
        </div>
        <div className="py-5">
          <h1 className="text-2xl font-bold mb-3 text-gray-800">{goods.name}</h1>

          <div className="mb-5">
            <span className="text-base text-gray-500 line-through mr-2">
              {goods.price?.toLocaleString()||0}원
            </span>
            {goods.salePercent ? (
              <>
                <span className="line-through text-gray-400 text-base mr-2">
                  {goods.price?.toLocaleString()||0}원
                </span><br/>
                  <span className="py-1 pr-1 text-base font-bold text-red-600">
                    {goods.salePercent}%
                  </span>
                {(goods.price * (1 - goods.salePercent / 100))?.toLocaleString()||0}원
              </>
            ) : (
              <>
                {goods.price?.toLocaleString()||0}
                <span className="text-sm font-bold text-gray-600 ml-1">원</span>
              </>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-5">
            <div>
              <strong>배송비:</strong> 3000원 (
              30000원 이상 무료)
            </div>
            <div>
              <strong>배송일:</strong> 영업일 기준 2-3일 이내
            </div>
          </div>

          <div className="flex items-center mb-5 gap-3">
            <label className="w-16">사이즈:</label>
            <select name="size" onChange={addOption} className="border border-gray-300 rounded p-2" value="">
              <option value="">사이즈 선택</option>
              {Array.isArray(goodsOpt) &&
                goodsOpt.map((opt) => (
                  <option key={opt.id} value={JSON.stringify({ id: opt.id, size: opt.option_name })}>
                    {opt.option_name}
                  </option>
              ))}
            </select>
          </div>

          {selectedOption.length > 0 && (
            <>
              {selectedOption.map((opt, idx) => (
                <div key={idx} className="border border-gray-200">
                  <span className="ml-5 mr-[100px]">
                    {opt.size} 
                  </span>
                  <span>
                    <button className="text-red-500" onClick={() => removeOption(opt.id)}>
                      X
                    </button>
                  </span>
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <button className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 text-lg font-medium transition-colors duration-200 focus:outline-none border-r" 
                    onClick={() => setSelectedOption((prev) => prev.map((o) => o.size === opt.size ? { ...o, qty: Math.max(1, o.qty - 1) } : o))}>
                      -
                    </button>
                    <input type = "number"
                    className="w-12 h-10 text-center border-none focus:ring-0 focus:outline-none text-gray-800 text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={opt.qty} readOnly />
                    <button className="flex items-center mr-[100px] justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 text-lg font-medium transition-colors duration-200 focus:outline-none border-l" 
                    onClick={() => setSelectedOption((prev) => prev.map((o)=>o.size === opt.size ? { ...o, qty: o.qty + 1 } : o))}>
                      +
                    </button>
                    <p>{(Number(goods.price) * opt.qty)?.toLocaleString()||0}원</p>
                  </div>
                </div>
              ))}
            </>
          )}
          <div>
            {/*총액계산*/}
            <div className="mt-6 mb-6">
              <div className="flex justify-between items-center border-t pt-2 text-lg font-semibold">
                <span className="text-black">총 결제금액</span>
                <span className="text-emerald-500 text-xl">{totalPrice.toLocaleString()}원</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mb-5">
            <div className="flex flex-col items-center justify-center w-[72px] h-[44px] bg-white rounded">
              <button className="flex items-center justify-center" onClick={() => setIsLiked(!isLiked)}>
                {isLiked ? <FaHeart color="red" size={20} /> : <FaRegHeart color="gray" size={20} />}
              </button>
              <span className="text-sm text-gray-700">{goods.likes}</span>
            </div>
            <button
              className="w-[124px] h-[44px] bg-white text-black font-medium border rounded border-gray-300 flex items-center justify-center transition-colors"
              onClick={handleAddToCart}
            >
              장바구니
            </button>
            <button
              className="w-[124px] h-[44px] bg-black text-white font-medium rounded flex items-center justify-center"
              onClick={()=>{if(!userInfo) {alert("로그인이 필요합니다."); return;} navigate("/Goods/GoodsOrder")}}
            >
              구매하기
            </button>
            <button className="w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center">
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
              className={`py-4 px-8 border-b-2 ${
                activeTab === tab ? "border-blue-600 text-blue-600 font-bold" : "border-transparent"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "details" ? "상세정보" : tab === "reviews" ? "제품후기" : "Q&A"}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === "details" && (
            <div>
              <h3 className="text-xl font-bold mb-4">상품 상세정보</h3>
              <pre className="mb-4">{goods.description}</pre>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h3 className="text-xl font-bold mb-4">제품후기</h3>
              {goods.reviews?(
                <>
                {goods.reviews.map((review) => (
                  <div key={review.id} className="p-4 border-b border-gray-200 mb-4">
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"} />
                      ))}
                    </div>
                    <p className="mb-2">{review.comment}</p>
                    <small className="text-gray-500">작성자: {review.author}</small>
                  </div>
                ))}
                </>
              ):(
                <div>
                  <p>리뷰가 없습니다.</p>
                </div>
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
  )
}

export default GoodsDetail
