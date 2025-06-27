const GoodsBest = ({ product, rank }) => {
  const discountedPrice = product.salePercent
    ? product.price * (1 - product.salePercent / 100)
    : product.price;

  const rankColors = {
    1: "bg-yellow-400 border border-yellow-200",
    2: "bg-gray-400 border-gray-200",
    3: "bg-orange-500 border-orange-200",
  };

  // ✅ S3 절대 URL 대응 이미지 파싱
  let imgSrc = "/placeholder.svg";
  try {
    const parsed = Array.isArray(product.img)
      ? product.img
      : JSON.parse(product.img || "[]");

    if (Array.isArray(parsed) && parsed.length > 0) {
      imgSrc = parsed[0]; // 절대 URL이거나 상대경로
    }
  } catch (e) {
    if (typeof product.img === "string" && product.img.startsWith("/img/")) {
      imgSrc = `http://localhost:8080${product.img}`;
    }
  }

  return (
    <div className="relative w-[180px] sm:w-[200px] rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow bg-white">
      {rank && (
        <div
          className={`absolute top-2 left-2 ${rankColors[rank]} text-xs font-bold text-white rounded-full px-2 py-1 z-10 shadow`}
        >
          {rank}위
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
