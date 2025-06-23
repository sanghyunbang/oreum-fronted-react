import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaArrowLeft } from "react-icons/fa";
import { useSelector } from "react-redux";

const GoodsCart = () => {
    const [checkedAll, setCheckedAll] = useState(true);
    const [selectedGoods, setSelectedGoods] = useState([]);
    const [Goods, setGoods] = useState([]);
    const userInfo = useSelector((state) => state.user.userInfo);
    const navigate = useNavigate();

    //유저의 장바구니 리스트
    useEffect(() => {
        window.scrollTo(0, 0);
        const CartData = async () => {
            if (!userInfo) { alert("로그인이 필요합니다."); navigate(-1); return; }
            const response = await fetch(`http://localhost:8080/api/goods/cartList`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ id: userInfo.userId }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setGoods(data);
            }
        };
        CartData();
    }, [userInfo, navigate]);

    //처음 화면 로딩시 전체 선택되게끔
    useEffect(() => {
        const checked = true;
        setCheckedAll(checked);
        setSelectedGoods(checked ? Goods.map(item => item.cart_id) : []);
    }, [Goods]);
    
    //전체 선택
    const selectAll = (e) => {
        const checked = e.target.checked;
        setCheckedAll(checked);
        setSelectedGoods(checked ? Goods.map(item => item.cart_id) : []);
    };

    //개별 선택
    const doSelect = (e, id) => {
        const updated = e.target.checked ? [...selectedGoods, id] : selectedGoods.filter(i => i !== id);
        setSelectedGoods(updated);
        setCheckedAll(updated.length === Goods.length);
    };

    //삭제 함수(여러개)
    const doDelete = async () => {
        if (window.confirm("선택한 상품을 삭제하시겠습니까?")) {
            const res = await fetch("http://localhost:8080/api/goods/selRemoveCart",{
                method:"POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ id: selectedGoods }),  // 배열 전송
            })
            if(!res.ok){ alert("삭제 실패"); return; };
            setGoods(prev => prev.filter(item => !selectedGoods.includes(item.cart_id)));
            setSelectedGoods([]);
            setCheckedAll(false);
            alert("삭제되었습니다.");
        }
    };

    //삭제 함수(단일)
    const removeOption = async (cart) => {
        if (window.confirm("삭제하시겠습니까?")) {
            const res = await fetch("http://localhost:8080/api/goods/removeCart",{
                method:"POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({id:cart.cart_id}),
            })
            if(!res.ok){ alert("삭제 실패"); return; };
            setGoods(prev => {
                const updated = prev.filter(opt => opt.cart_id !== cart.cart_id);
                const updatedSelected = selectedGoods.filter(id => id !== cart.cart_id);
                setSelectedGoods(updatedSelected);
                setCheckedAll(updatedSelected.length === updated.length);
                return updated;
            });
            alert("삭제되었습니다.");
        }
    };

    //할인 가격
    const getDiscountedPrice = (item) => {
        const discount = item.salePercent ? (1 - item.salePercent / 100) : 1;
        return Math.floor(item.price * discount);
    };

    //총 가격
    const total = Goods.reduce((acc, item) => {
        if (selectedGoods.includes(item.cart_id)) {
            const discounted = getDiscountedPrice(item);
            return acc + discounted * item.qty;
        }
        return acc;
    }, 0);

    //선택한 상품 구매 이동
    const doOrder = () => {
        const selectedItems = Goods.filter(item => selectedGoods.includes(item.cart_id)).map(item => ({
        ...item, goods_options_id: item.goods_options_id ?? item.option_id,}));;
        navigate("/Goods/GoodsOrder", { state: { items: selectedItems } });
    };

    return (
        <div className="max-w-4xl min-w-[600px] mx-auto p-5 font-sans">
            <header className="flex items-center justify-between pb-4 mb-6">
                <button onClick={() => navigate(-1)} className="flex items-center text-1xl hover:text-gray-900">
                    <FaArrowLeft className="mr-2" /> 뒤로
                </button>
                <h1 className="text-3xl font-bold text-center flex-1">장바구니</h1>
                <button onClick={() => navigate("/Goods")} className="text-2xl hover:text-gray-900">
                    <FaHome size={20} />
                </button>
            </header>

            <div className="flex items-center justify-between pb-2 mb-4">
                <div>
                    <input
                        type="checkbox"
                        checked={checkedAll}
                        onChange={selectAll}
                    />
                    <span className="ml-2">전체 선택</span>
                </div>
                <button onClick={doDelete} className="text-gray-500 hover:text-red-500">선택삭제</button>
            </div>

            {Goods.length > 0 ? (
                <div>
                    {Goods.map((cart) => (
                        <div key={cart.cart_id} className="flex items-center gap-4 border-t py-4">
                            <input type="checkbox" className="scale-100" checked={selectedGoods.includes(cart.cart_id)} onChange={(e) => doSelect(e, cart.cart_id)} />
                            <img src={cart.img} alt={cart.goods_name} onClick={()=>navigate(`/Goods/GoodsDetail/${cart.goods_id}`)} className="w-[80px] h-[80px] object-cover rounded-md cursor-pointer" />
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold cursor-pointer" onClick={()=>navigate(`/Goods/GoodsDetail/${cart.goods_id}`)}>{cart.goods_name}</span>
                                    <button className="text-black text-2xl" onClick={() => removeOption(cart)}>x</button>
                                </div>
                                <div className="text-gray-500 mb-1">{cart.option_name || "옵션없음"} | {cart.qty}개</div>
                                <div className="flex items-center">
                                    <button
                                        className="px-2 py-[2px] border border-gray-400"
                                        onClick={() =>
                                            setGoods(prev => prev.map(opt =>
                                                opt.cart_id === cart.cart_id ? { ...opt, qty: Math.max(1, opt.qty - 1) } : opt
                                            ))
                                        }
                                    > - </button>
                                    <p type="number" className="w-12 px-0 py-[2px] text-center border-t border-b border-gray-400 appearance-none">
                                        {cart.qty}
                                    </p>
                                    <button
                                        className="px-2 py-[2px] border border-gray-400"
                                        onClick={() =>
                                            setGoods(prev => prev.map(opt =>
                                                opt.cart_id === cart.cart_id ? { ...opt, qty: opt.qty + 1 } : opt
                                            ))
                                        }
                                    >+</button>
                                    <span className="ml-4 font-semibold">
                                        {cart.salePercent ? (
                                            <>
                                                <span className="line-through text-gray-400 mr-2">
                                                    {(cart.price * cart.qty).toLocaleString()}원
                                                </span><br />
                                                <span className="py-1 pr-1 text-base font-bold text-red-600">
                                                    {cart.salePercent}%
                                                </span>
                                                {(getDiscountedPrice(cart) * cart.qty).toLocaleString()}원
                                            </>
                                        ) : (
                                            <>
                                                {(getDiscountedPrice(cart) * cart.qty).toLocaleString()}원
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>장바구니에 담은 상품이 없습니다.</p>
            )}

            <div className="border-t mt-6 pt-4 space-y-2 text-right">
                <div className="flex justify-between">
                    <span className="text-gray-500">총 상품금액</span>
                    <span>{total.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">배송비</span>
                    <span>0원</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                    <span>최종 결제금액</span>
                    <span className="text-green-600">{total.toLocaleString()}원</span>
                </div>
                <button className="w-full py-3 mt-4 bg-green-500 text-white rounded-md hover:bg-green-600" onClick={doOrder}>
                    {selectedGoods.length}건 구매하기
                </button>
            </div>
        </div>
    );
};

export default GoodsCart;
