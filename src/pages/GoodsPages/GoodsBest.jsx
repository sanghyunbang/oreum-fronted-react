const GoodsBest = ({ product, rank }) => {
  const discountedPrice = product.salePercent
    ? product.price * (1 - product.salePercent / 100)
    : product.price;

  // 순위별 색상 지정
  const rankColors = {
    1: "bg-yellow-400 border border-yellow-200", // 금
    2: "bg-gray-400 border-gray-200",   // 은
    3: "bg-orange-500 border-orange-200", // 동
  };

  return (
    <div className="relative w-[180px] sm:w-[200px] rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow bg-white">

      {/* 🥇 순위 뱃지 (왼쪽 상단 + 색상별) */}
      {rank && (
        <div
          className={`absolute top-2 left-2 ${rankColors[rank]} text-xs font-bold text-white rounded-full px-2 py-1 z-10 shadow`}
        >
          {rank}위
        </div>
      )}

      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {product.img ? (
          <img
            src={product.img || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=300&width=300";
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

      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-900 truncate">
          {product.name}
        </h3>
        <div className="mt-1 text-sm text-gray-700">
          {product.salePercent ? (
            <>
              <span className="line-through text-gray-400 mr-2">
                {product.price.toLocaleString()}원
              </span>
              <div>
                <span className="py-1 pr-1 text-red-600 font-bold text-base">
                  {product.salePercent}%
                </span>
                <span className="text-base font-bold text-gray-900">
                  {Math.round(discountedPrice).toLocaleString()}원
                </span>
              </div>
            </>
          ) : (
            <>
              <span className="text-gray-900 font-bold">
                {product.price.toLocaleString()}원
              </span>
              <div>
                <span className="py-1 pr-1 text-red-600 font-bold text-base invisible">
                  {product.salePercent}%
                </span>
                <span className="text-base font-bold text-gray-900 invisible">
                  {Math.round(discountedPrice).toLocaleString()}원
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoodsBest;
