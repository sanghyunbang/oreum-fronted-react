import { useNavigate } from "react-router-dom";
import GoodsLiked from "../../components/goods/GoodsLike";
import { FaArrowLeft, FaHome } from "react-icons/fa";

const GoodsLike = () => {
    const navigate = useNavigate();
    return (
        <div className="w-full max-w-3xl min-w-[600px] mx-auto px-4 border">
            <header className="flex items-center justify-between pb-4 mb-6 mt-10">
                <button onClick={() => navigate(-1)} className="flex items-center text-1xl hover:text-gray-900 ">
                    <FaArrowLeft className="mr-2" /> 뒤로
                </button>
                <h1 className="text-3xl font-bold text-center flex-1">좋아요</h1>
                <button onClick={() => navigate("/Goods")} className="text-2xl hover:text-gray-900">
                    <FaHome size={20} />
                </button>
            </header>
            <GoodsLiked />
        </div>
    )
}
export default GoodsLike;