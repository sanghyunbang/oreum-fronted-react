import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GoodsCategory = ({ product, soldOutIds = [] }) => {
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
      {/* 필터 버튼 */}
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

      {/* 상품 리스트 */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            let imgSrc = "/placeholder.svg";
            try {
              const parsed = JSON.parse(product.img);
              if (Array.isArray(parsed) && parsed.length > 0) {
                imgSrc = `http://localhost:8080${parsed[0]}`;
              }
            } catch (e) {
              if (typeof product.img === "string" && product.img.startsWith("/img/")) {
                imgSrc = `http://localhost:8080${product.img}`;
              }
            }

            const isSoldOut = soldOutIds.includes(product.id);

            return (
              <div
                key={product.id}
                className={`relative bg-white border border-gray-200 overflow-hidden shadow-sm transition-shadow duration-200 ${
                  isSoldOut
                    ? "opacity-50 cursor-pointer" // 👈 pointer-events 제거, 클릭 가능
                    : "hover:shadow-md cursor-pointer"
                }`}
                onClick={() => productsClick(product)}
              >
                {/* 품절 배지 */}
                {isSoldOut && (
                  <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded z-10">
                    품절
                  </div>
                )}

                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
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
                      <>{product.price.toLocaleString()}원</>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">해당 카테고리에 상품이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default GoodsCategory;
