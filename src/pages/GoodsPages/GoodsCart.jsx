import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaArrowLeft } from "react-icons/fa";     // Font Awesome

const GoodsCart = () => {
    const [checkedAll, setCheckedAll] = useState(true);
    const [selectedGoods, setSelectedGoods] = useState([]); // 선택된 상품들
    const [Goods, setGoods] = useState([
        { id: 1, img: "/Goods_img/캠핑가방.jpeg", name: "캠핑가방", category: "기타", brand: "아디다스", price: 15000, salePercent: 20, option: "M", qty: 1 },
        { id: 2, img: "/Goods_img/청바지.jpeg", name: "청바지", category: "하의", brand: "아디다스", price: 35000, salePercent: 10, option: "S", qty: 1 },
        { id: 3, img: "/Goods_img/운동화.jpeg", name: "운동화", category: "신발", brand: "아디다스", price: 65000, option: "S", qty: 1 },
        { id: 4, img: "/Goods_img/등산스틱.jpeg", name: "등산스틱", category: "기타", brand: "아디다스", price: 12000, salePercent: 15, option: "L", qty: 1 },
        { id: 5, img: "/Goods_img/후드티.jpeg", name: "후드티", category: "상의", brand: "아디다스", price: 28000, salePercent: 30, option: "M", qty: 1 },
    ]);
    const navigate = useNavigate();

    // const CartData = async () => {
    //     if (!localStorage.getItem("nickname")) {
    //         alert("로그인이 필요합니다.");
    //         navigate("/");
    //         return;
    //     }
    //     const response = await fetch("http://localhost:8080/goods/cartlist", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         credentials: "include",
    //         body: JSON.stringify({ nickname: localStorage.getItem("nickname") }),
    //     });
    //     if (response.ok) {
    //         const data = await response.json();
    //         setGoods(data);
    //     }
    // };
    // useEffect(() => { CartData(); }, []);

    useEffect(()=>{
        const checked = true;  // 초기값 설정
        setCheckedAll(checked);
        setSelectedGoods(checked ? Goods.map(item => item.id) : []);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    // 전체 선택
    const selectAll = (e) => {
        const checked = e.target.checked;
        setCheckedAll(checked);
        setSelectedGoods(checked ? Goods.map(item => item.id) : []);
    };

    // 개별 선택
    const doSelect = (e, id) => {
        const updated = e.target.checked
            ? [...selectedGoods, id]
            : selectedGoods.filter(i => i !== id);

        setSelectedGoods(updated);
        setCheckedAll(updated.length === Goods.length);
    };

    // 선택 삭제(선택삭제 버튼)
    const doDelete = () => {
        if (window.confirm("선택한 상품을 삭제하시겠습니까?")) {
            setGoods(prev => prev.filter((item) => !selectedGoods.includes(item.id)));
            setSelectedGoods([]);
            setCheckedAll(false);
            alert("삭제되었습니다.");
        }
    };

    //선택 삭제( x 버튼)
    const removeOption = (cart) => {
        if (window.confirm("삭제하시겠습니까?")) {
            setGoods(prev => {
                // 선택된 상품 목록에서 삭제된 항목 제외
                const updated = prev.filter(opt => opt.id !== cart.id);
                // 체크된 항목 수와 삭제된 후 상품 수 같으면 -> 전체 선택 유지
                const updatedSelected = selectedGoods.filter(id => id !== cart.id);
                setSelectedGoods(updatedSelected);
                setCheckedAll(updatedSelected.length === updated.length);
                return updated;
            });
            alert("삭제되었습니다.");
        }
    };

    // 상품 가격 계산 함수 (할인 적용)
    const getDiscountedPrice = (item) => {
        const discount = item.salePercent ? (1 - item.salePercent / 100) : 1;
        return Math.floor(item.price * discount);
    };

    // 총액 계산
    const total = Goods.reduce((acc, item, idx) => {
        if (selectedGoods.includes(idx)) {
            const discounted = getDiscountedPrice(item);
            return acc + discounted * item.qty;
        }
        return acc;
    }, 0);

    const doOrder = ()=>{
        const selectedItems = Goods.filter((_, idx) => selectedGoods.includes(idx));
        navigate("/Goods/GoodsOrder", { state: { items: selectedItems } });
    };
    
    return (
        <div className="max-w-4xl min-w-[600px] mx-auto p-5 font-sans">
            <header className="flex items-center justify-between pb-4 mb-6">
                <button onClick={()=>navigate(-1)} className="flex items-center text-gray-700 hover:text-gray-900">
                <FaArrowLeft className="mr-2" /> 뒤로
                </button>
                <h1 className="text-2xl font-bold text-center flex-1">장바구니</h1>
                <button onClick={()=>navigate("/Goods")} className="text-gray-700 hover:text-gray-900">
                <FaHome size={20} />
                </button>
            </header>

            {/* 상단 전체선택 */}
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

            {/* 상품 리스트 */}
            {Goods.length > 0 ? (
                <div>
                    {Goods.map((cart, idx) => (
                        <div key={idx} className="flex items-center gap-4 border-t py-4">
                            <input
                                type="checkbox"
                                checked={selectedGoods.includes(cart.id)}
                                onChange={(e) => doSelect(e, cart.id)}
                            />
                            <img
                                src={cart.img}
                                alt={cart.name}
                                className="w-[80px] h-[80px] object-cover rounded-md"
                            />
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold">{cart.name}</span>
                                    <button className="text-black text-2xl" onClick={() => removeOption(cart)}>x</button>
                                </div>
                                <div className="text-gray-500 mb-1">{cart.option || "옵션없음"} | {cart.qty}개</div>
                                <div className="flex items-center">
                                    <button className="px-2 py-[2px] border border-gray-400"
                                    onClick={() => setGoods(prev=>prev.map(opt =>opt === cart ? { ...opt, qty: Math.max(1, opt.qty - 1) } : opt))}> - </button>
                                    <input readOnly type="number" value={cart.qty} className="w-12 px-0 py-[2px] text-center border-t border-b border-gray-400 appearance-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
                                    <button className="px-2 py-[2px] border border-gray-400"
                                    onClick={() => setGoods(prev =>prev.map(opt =>opt === cart ? { ...opt, qty: opt.qty + 1 } : opt))}>+</button>
                                    <span className="ml-4 font-semibold">
                                        {cart.salePercent?
                                        <>
                                        <span className="line-through text-gray-400 mr-2">{cart.salePercent ? `${(cart.price * cart.qty).toLocaleString()}원` : ''}</span><br />
                                        <span className="py-1 pr-1 text-base font-bold text-red-600">
                                        {cart.salePercent}%
                                        </span>
                                        {(getDiscountedPrice(cart) * cart.qty).toLocaleString()}원
                                        </>
                                        :
                                        <>
                                        {(getDiscountedPrice(cart) * cart.qty).toLocaleString()}원
                                        </>}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>장바구니에 담은 상품이 없습니다.</p>
            )}

            {/* 하단 결제 정보 */}
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
