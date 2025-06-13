import { useState } from "react" //useEffect
import Slider from "react-slick"
import { FaHeart, FaRegHeart, FaShare, FaStar, FaHome, FaShoppingCart } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const GoodsDetail = () => {
  const [activeTab, setActiveTab] = useState("details")
  const [isLiked, setIsLiked] = useState(false)
  const [selectedOption, setSelectedOption] = useState([])
  // const [product,setProduct] = useState([]);
  const navigate = useNavigate()

  //임시 떠미
  const product = {
    id: 1,
    name: "동산화 파우치",
    price: 15000, 
    salePercent: 20,
    likes: 30,
    images: ["/Goods_img/캠핑가방.jpeg", "/Goods_img/캠핑가방.jpeg"],
    description: `고급스러운 동산화 파우치입니다. \n고품질 소재로 제작된 실용적인 파우치입니다.`,
    shipping: {
      fee: 3000,
      freeShippingMin: 30000,
      estimatedDays: "2-3일",
    },
    reviews: [
      { id: 1, rating: 4, comment: "정말 좋은 상품이에요!", author: "김**" },
      { id: 2, rating: 4, comment: "배송이 빨라요", author: "이**" },
    ],
  }

  // useEffect(() => {
  //       const DetailData = async () => {
  //         const response = await fetch("http://localhost:8080/goods/detailList", {
  //         method: "GET",
  //         headers: { "Content-Type": "application/json" },
  //         credentials: "include",
  //         });
  //         if (response.ok) {
  //         const data = await response.json(); 
  //         setProduct(data);
  //         }
  //       };
  //       DetailData();
  //   }, []);

  //사진
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    customPaging: () => <div className="w-2 h-2 rounded-full bg-gray-300 mx-1" />,
    dotsClass: "slick-dots custom-dots",
  }

  //옵션 추가
  const addOption = (e) => {
    const size = e.target.value
    if (!size) return
    setSelectedOption((prev) => {
      const duplication = prev.find((opt) => opt.size === size)
      if (duplication){
        alert("이미 선택된 옵션입니다.")
        return prev
      }
      else{
        return [...prev, { size, qty: 1 }]
      }
    })
  }

  //삭제
  const removeOption = (size) => {
    setSelectedOption((prev) => prev.filter((opt) => opt.size !== size))
  }

  //갯수감소
  const downQty = (size) => {
    setSelectedOption((prev) =>
      prev.map((opt) =>
        opt.size === size ? { ...opt, qty: Math.max(1, opt.qty - 1) } : opt
      )
    )
  }

  //갯수증가
  const upQty = (size) => {
    setSelectedOption((prev) =>
      prev.map((opt) =>
        opt.size === size ? { ...opt, qty: opt.qty + 1 } : opt
      )
    )
  }

  //장바구니 추가
  const handleAddToCart = () => {
    const getParticle = (word) => {
      const lastChar = word[word.length - 1]
      const code = lastChar.charCodeAt(0)
      const hasFinalConsonant = (code - 44032) % 28 !== 0
      return hasFinalConsonant ? "이" : "가"
    }
    alert(`${product.name}${getParticle(product.name)} 장바구니에 추가되었습니다.`)
  }

  //구매하기
  const handleAdd = () => {
    navigate("/Goods/GoodsOrder")
  }

  const doReturn = () => {
    navigate(-1);
  }

  const doHome = () => {
    navigate("/Goods");
  }

  return (
    <div className="max-w-4xl min-w-[600px] mx-auto p-5 font-sans">
      <header className="flex items-center justify-between px-4 py-2 mb-[80px]">
      <div className="text-2xl cursor-pointer z-10 mr-5" onClick={doReturn}>{"<"}</div>
      <div className="text-2xl cursor-pointer z-10" onClick={doHome}><FaHome /></div>
      <h5 className="text-center flex-1 text-2xl font-bold -ml-6">{product.name}</h5>
      <div className="text-2xl cursor-pointer z-10" onClick={()=>navigate("/Goods/GoodsCart")}><FaShoppingCart /></div>
      <div className="w-6" /> {/* 오른쪽 여백용 (좌우 균형 맞추기 위함) */}
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        <div className="relative mb-5">
          <Slider {...sliderSettings}>
            {product.images.map((image, index) => (
              <div key={index}>
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
              </div>
            ))}
          </Slider>
        </div>

        <div className="py-5">
          <h1 className="text-2xl font-bold mb-3 text-gray-800">{product.name}</h1>

          <div className="mb-5">
            <span className="text-base text-gray-500 line-through mr-2">
              {product.price.toLocaleString()}원
            </span>
            <span className="text-xl text-red-500 font-bold mr-2">{product.salePercent}%</span>
            <span className="text-xl font-semibold text-black">
              {(product.price * (1 - product.salePercent / 100)).toLocaleString()}원
            </span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-5">
            <div>
              <strong>배송비:</strong> {product.shipping.fee.toLocaleString()}원 (
              {product.shipping.freeShippingMin.toLocaleString()}원 이상 무료)
            </div>
            <div>
              <strong>배송일:</strong> 영업일 기준 {product.shipping.estimatedDays} 이내
            </div>
          </div>

          <div className="flex items-center mb-5 gap-3">
            <label className="w-16">사이즈:</label>
            <select name="size" onChange={addOption} className="border border-gray-300 rounded p-2" value="">
              <option value="">사이즈 선택</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
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
                    <button className="text-red-500" onClick={() => removeOption(opt.size)}>
                      X
                    </button>
                  </span>
                  <p className="flex items-center border rounded-md overflow-hidden">
                    <button className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 text-lg font-medium transition-colors duration-200 focus:outline-none border-r\" onClick={() => downQty(opt.size)}>
                      -
                    </button>
                    <input type = "number"
                    className="w-12 h-10 text-center border-none focus:ring-0 focus:outline-none text-gray-800 text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={opt.qty} readOnly />
                    <button className="flex items-center mr-[100px] justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 text-lg font-medium transition-colors duration-200 focus:outline-none border-l" onClick={() => upQty(opt.size)}>
                      +
                    </button>
                    <p>{product.price.toLocaleString()}원</p>
                  </p>
                </div>
              ))}
            </>
          )}

          <div className="flex gap-2 mb-5">
            <div className="flex flex-col items-center justify-center w-[72px] h-[44px] bg-white rounded">
              <button className="flex items-center justify-center" onClick={() => setIsLiked(!isLiked)}>
                {isLiked ? <FaHeart color="red" size={20} /> : <FaRegHeart color="gray" size={20} />}
              </button>
              <span className="text-sm text-gray-700">{product.likes}</span>
            </div>
            <button
              className="w-[124px] h-[44px] bg-white text-black font-medium border rounded border-gray-300 flex items-center justify-center transition-colors"
              onClick={handleAddToCart}
            >
              장바구니
            </button>
            <button
              className="w-[124px] h-[44px] bg-black text-white font-medium rounded flex items-center justify-center"
              onClick={handleAdd}
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
              <pre className="mb-4">{product.description}</pre>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h3 className="text-xl font-bold mb-4">제품후기</h3>
              {product.reviews.map((review) => (
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
