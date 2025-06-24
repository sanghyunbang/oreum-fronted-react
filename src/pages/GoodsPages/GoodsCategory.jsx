import { useState } from "react"
import { useNavigate } from "react-router-dom"

const GoodsCategory = ({ product }) => {
  const navigate = useNavigate();
  const filters = ["전체", "상의", "하의", "신발", "기타"];
  const [activeFilter, setActiveFilter] = useState("전체");

  const filteredProducts =
    activeFilter === "전체"
      ? product
      : product.filter((p) => p.category === activeFilter);

  const productsClick = (p) => {
    navigate(`/Goods/GoodsDetail/${p.id}`);
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4">
      {/* 필터 버튼들 */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={
              activeFilter === filter
                ? "px-[22px] py-[7px] rounded-full border-2 font-medium bg-blue-600 text-white border-blue-600 shadow-md transition-all duration-200"
                : "px-[22px] py-[7px] rounded-full border-2 font-medium bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            }
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 상품 표시 */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => productsClick(product)}
            >
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                {product.img ? (
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm">이미지 없음</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4">
                <span className="text-xs text-gray-600">{product.brand}</span>
                <br />
                <h3 className="font-semibold text-base text-gray-900">{product.name}</h3>
                <div className="text-base font-bold text-gray-900 mt-1">
                  {product.salePercent ? (
                    <>
                      <span className="line-through text-gray-400 text-sm mr-2">
                        {product.price.toLocaleString()}원
                      </span>
                      <br />
                      <span className="text-red-600 mr-1">{product.salePercent}%</span>
                      {(product.price * (1 - product.salePercent / 100)).toLocaleString()}원
                    </>
                  ) : (
                    <>
                      {product.price.toLocaleString()}원
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3"
              />
            </svg>
          </div>
          <p className="text-lg">해당 카테고리에 상품이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default GoodsCategory;
