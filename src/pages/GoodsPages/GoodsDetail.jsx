import { useParams } from "react-router-dom";

const GoodsDetail = ({ product }) => {
    const { id } = useParams();

    // const discountedPrice = (product.price * (1 - product.salePercent / 100));
    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-xl">
            {/* 상품 이미지 및 요약 정보 */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* 왼쪽 - 이미지 */}
                <div className="w-full md:w-1/2">
                <img
                    src="/Goods_img/캠핑가방.jpeg"
                    alt="캠핑가방"
                    className="w-full h-auto object-cover rounded-lg border"
                />
                </div>

                {/* 오른쪽 - 텍스트 정보 */}
                <div className="w-full md:w-1/2 flex flex-col justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">캠핑가방</h1>
                    <p className="text-gray-600 text-sm mb-4">기타 {">"} 가방</p>

                    {/* 가격 */}
                    <div className="mb-4">
                    <p className="text-xl font-semibold text-gray-800">
                        <span className="line-through text-gray-400 text-base mr-2">20,000원</span>
                        <span className="text-red-600 text-2xl font-bold">15,000원</span>
                        <span className="ml-2 text-sm text-red-500 bg-red-100 px-2 py-1 rounded-full font-medium">25% 할인</span>
                    </p>
                    </div>

                    {/* 간단 설명 */}
                    <p className="text-gray-700 mb-6">
                    야외 활동에 적합한 내구성 좋은 캠핑 가방입니다. 다용도로 사용 가능하며, 방수 처리되어 장기간 사용에 적합합니다.
                    </p>
                </div>

                {/* 구매 버튼 */}
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200">
                    장바구니에 담기
                </button>
                </div>
            </div>

            {/* 상세 설명 영역 */}
            <div className="mt-12 border-t pt-8">
                <h2 className="text-2xl font-semibold mb-4">상품 상세 정보</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                이 캠핑가방은 경량 설계로 휴대가 간편하며, 넉넉한 수납공간과 다양한 포켓이 있어 캠핑용품을 효율적으로 정리할 수 있습니다.
                또한 방수 소재로 제작되어 비 오는 날에도 안심하고 사용할 수 있습니다.
                </p>
                <img src="/Goods_img/캠핑가방.jpeg" alt="상세 이미지" className="w-full rounded-lg border" />
            </div>
        </div>
    );
};

export default GoodsDetail;
