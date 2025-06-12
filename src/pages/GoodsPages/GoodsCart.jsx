import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GoodsOrder = () => {
    const [checked,setChecked] = useState(false);
    const [products,setProducts] = useState([]);
    const [showOption,setShowOption] = useState(false);
    const navigate = useNavigate();

    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (!localStorage.getItem("nickname")) {
    //         alert("로그인이 필요합니다.");
    //         navigate("/");return;
    //         }
    //         const response = await fetch("http://localhost:8080/goods/orderlist", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         credentials: "include",
    //         body: JSON.stringify({nickname: localStorage.getItem("nickname")}),
    //         });
    //         if (response.ok) {
    //         const data = await response.json(); 
    //         setProducts(data);
    //         }
    //     };
    //     fetchData();
    // }, []);

    const selectAll = (e)=>{
        setChecked(prev=>({...prev,[e.target.name]:e.target.checked}));
    }

    return(
        <div>
            <header>장바구니</header>
            <div>
                <input type="checkbox" checked={checked} onChange={selectAll}/>
                <span>전체 선택</span>
            </div>
            {products.length>0?
            <div>
                w
            </div>
            :
            <>
            <div>
                <p>장바구니에 담은 상품이 없습니다.</p><br/>
                <button onClick={()=>setShowOption(prev=>!prev)}>좋아요한 상품보기</button>
            </div>
            </>
            }
        </div>
    )
}
export default GoodsOrder;