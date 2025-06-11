const GoodsBest = ({ product }) => {
    const discountedPrice = (product.price * (1 - product.salePercent / 100));

  return (
    <div className="w-[180px] sm:w-[200px] rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow bg-white">
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {product.img?(
        <img
          src={product.img || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=300&width=300";
          }}
        />
        ):<span>이미지 없음</span>}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-900 truncate">{product.name}</h3>
        <div className="mt-1 text-sm text-gray-700">
          {product.salePercent ? (
            <>
              <span className="line-through text-gray-400 mr-2">
                {product.price.toLocaleString()}원
              </span>
              <div>
                <span className="py-1 pr-1 text-red-600 font-bold text-base">{product.salePercent}%</span>
                <span className="text-base font-bold text-gray-900">{discountedPrice.toLocaleString()}원</span>
              </div>
            </>
          ) : (
            <>
            <span className="text-gray-900 font-bold">{product.price.toLocaleString()}원</span>
            <div>
                <span className="py-1 pr-1 text-red-600 font-bold text-base invisible">{product.salePercent}%</span>
                <span className="text-base font-bold text-gray-900 invisible">{discountedPrice.toLocaleString()}원</span>
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoodsBest;
