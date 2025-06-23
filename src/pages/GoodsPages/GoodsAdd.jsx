import { useState } from "react";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const GoodsAdd = () => {
    const [Goods, setGoods] = useState({name:"",brand:"",category:"",price:"",salePercent:0,description:""});
    const navigate = useNavigate();
    
    const doChange = (e) =>{
        setGoods(prev=>({...prev,[e.target.name]:e.target.value}))
    }
    return(
        <div>
            <header className="flex items-center justify-between pb-4 border-b mb-10">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-700 hover:text-gray-900">
                    <FaArrowLeft className="mr-2" /> 뒤로
                </button>
                <h1 className="text-3xl font-bold text-center flex-1">굿즈 추가</h1>
                <button onClick={() => navigate("/Goods")} className="text-2xl text-gray-700 hover:text-gray-900">
                    <FaHome />
                </button>
            </header>
            <div>
                이름<input type="text" name="name" value={Goods.name} onChange={doChange} />
                브랜드<input type="text" name="brand" value={Goods.brand} onChange={doChange} />
                카테고리<input type="text" name="category" value={Goods.category} onChange={doChange} />
                가격<input type="number" name="price" value={Goods.price} onChange={doChange} />
                할인율<input type="salePercent" name="salePercent" value={Goods.salePercent} onChange={doChange} />
                제품 설명<input type="text" name="description" value={Goods.description} onChange={doChange} />  
            </div>
        </div>
    );
}
export default GoodsAdd;