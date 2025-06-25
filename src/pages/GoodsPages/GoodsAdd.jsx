import { useState } from "react";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const GoodsAdd = () => {
  const navigate = useNavigate();

  const [Goods, setGoods] = useState({
    name: "",
    brand: "",
    category: "상의",
    price: "",
    salePercent: 0,
    description: "",
  });

  const [options, setOptions] = useState([{ optionName: "", stockQty: 0 }]);
  const [imageInputs, setImageInputs] = useState([{ file: null }]);

  // 상품 기본 정보 변경
  const doChange = (e) => {
    const { name, value } = e.target;
    setGoods((prev) => ({ ...prev, [name]: value }));
  };

  // ReactQuill
  const handleDescriptionChange = (value) => {
    setGoods((prev) => ({ ...prev, description: value }));
  };

  // 옵션 관련
  const handleOptionChange = (index, field, value) => {
    const updated = [...options];
    updated[index][field] = value;
    setOptions(updated);
  };

  const addOption = () => setOptions([...options, { optionName: "", stockQty: 0 }]);
  const removeOption = (index) => {
    const updated = [...options];
    updated.splice(index, 1);
    setOptions(updated);
  };

  // 이미지 관련
  const addImageInput = () => setImageInputs([...imageInputs, { file: null }]);
  const removeImageInput = (index) => {
    const updated = [...imageInputs];
    updated.splice(index, 1);
    setImageInputs(updated);
  };
  const handleImageChange = (index, file) => {
    const updated = [...imageInputs];
    updated[index].file = file;
    setImageInputs(updated);
  };

  // 제출
  const doSubmit = async () => {
    try {
      // 1. 이미지 업로드
      const formData = new FormData();
      imageInputs.forEach((input) => {
        if (input.file) formData.append("images", input.file);
      });
      const uploadRes = await fetch("http://localhost:8080/api/goods/upload", {
        method: "POST",
        body: formData,
      });

      const imgPaths = await uploadRes.json(); // ex: ["img/1.jpg", "img/2.jpg"]

      // 2. Goods 저장
      const goodsData = {
        ...Goods,
        img: JSON.stringify(imgPaths), // DB에 JSON 배열 문자열로 저장
      };

      const goodsRes = await fetch("http://localhost:8080/api/goods/addGoods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(goodsData),
      });

      const result = await goodsRes.json();

      // 3. 옵션 저장
      if (result.id) {
        const optionData = options.map((opt) => ({
          ...opt,
          goodsId: result.id,
        }));
        console.log(optionData);
        await fetch("http://localhost:8080/api/goods/addGoodsItem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(optionData),
        });

        alert("굿즈가 성공적으로 추가되었습니다.");
        // navigate("/Goods");
      }
    } catch (err) {
      console.error(err);
      alert("추가 중 오류 발생");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <header className="flex items-center justify-between pb-4 border-b mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-700 hover:text-gray-900">
          <FaArrowLeft className="mr-2" /> 뒤로
        </button>
        <h1 className="text-3xl font-bold text-center flex-1">굿즈 추가</h1>
        <button onClick={() => navigate("/Goods")} className="text-2xl text-gray-700 hover:text-gray-900">
          <FaHome />
        </button>
      </header>

      <div className="space-y-4">
        <input type="text" name="name" value={Goods.name} onChange={doChange} placeholder="이름" className="w-full border p-2 rounded" />
        <input type="text" name="brand" value={Goods.brand} onChange={doChange} placeholder="브랜드" className="w-full border p-2 rounded" />
        <select name="category" value={Goods.category} onChange={doChange} className="w-full border p-2 rounded">
          <option value="상의">상의</option>
          <option value="하의">하의</option>
          <option value="신발">신발</option>
          <option value="기타">기타</option>
        </select>
        <input type="number" name="price" value={Goods.price} onChange={doChange} placeholder="가격" className="w-full border p-2 rounded" />
        <input type="number" name="salePercent" value={Goods.salePercent} onChange={doChange} placeholder="할인율" className="w-full border p-2 rounded" />

        <ReactQuill value={Goods.description} onChange={handleDescriptionChange} />

        {/* 이미지 업로드 */}
        <div className="mt-6">
          <h2 className="font-bold">이미지</h2>
          {imageInputs.map((input, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(i, e.target.files[0])}
              />
              {imageInputs.length > 1 && (
                <button onClick={() => removeImageInput(i)} className="text-red-500">삭제</button>
              )}
            </div>
          ))}
          <button onClick={addImageInput} className="text-blue-500 mt-2">+ 이미지 추가</button>
        </div>

        {/* 옵션 추가 */}
        <div className="mt-6">
          <h2 className="font-bold">상품 옵션</h2>
          {options.map((opt, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <input
                type="text"
                placeholder="옵션명"
                value={opt.optionName}
                onChange={(e) => handleOptionChange(i, "optionName", e.target.value)}
                className="border p-1"
              />
              <input
                type="number"
                placeholder="수량"
                value={opt.stockQty}
                onChange={(e) => handleOptionChange(i, "stockQty", e.target.value)}
                className="border p-1"
              />
              {options.length > 1 && (
                <button onClick={() => removeOption(i)} className="text-red-500">삭제</button>
              )}
            </div>
          ))}
          <button onClick={addOption} className="text-blue-500 mt-2">+ 옵션 추가</button>
        </div>

        <button onClick={doSubmit} className="mt-6 w-full bg-black text-white py-2 rounded">
          제출
        </button>
      </div>
    </div>
  );
};

export default GoodsAdd;
