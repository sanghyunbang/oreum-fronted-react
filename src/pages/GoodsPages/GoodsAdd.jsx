import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaHome, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const GoodsAdd = () => {
  const navigate = useNavigate();
  const dropRef = useRef(null);
  const [Goods, setGoods] = useState({ name: "", brand: "", category: "상의", price: "", salePercent: 0, description: "" });
  const [options, setOptions] = useState([{ optionName: "", stockQty: "" }]);
  const [imageInputs, setImageInputs] = useState([]);
  const [errors, setErrors] = useState({});

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'align': [] }], // 🔥 정렬 옵션 추가
      ['image', 'code-block'],
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline',
    'align', // 🔥 정렬 기능 허용
    'image', 'code-block',
  ];

  const scrollToError = (field) => {
    const el = document.getElementById(field);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const images = files
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setImageInputs((prev) => [...prev, ...images]);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const images = files.map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setImageInputs((prev) => [...prev, ...images]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imageInputs[index].preview);
    setImageInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const doChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (["price", "salePercent"].includes(name)) {
      val = value.replace(/^0+(?=\d)/, "");
      if (name === "salePercent") {
        if (val === "") {
          val = "0"; // 빈 값이면 0 고정
        } else {
          let num = parseInt(val);
          if (num < 0) num = 0;
          if (num > 100) num = 100;
          val = num.toString();
        }
      }
    }
    setGoods((prev) => ({ ...prev, [name]: val }));
  };

  const handleDescriptionChange = (value) => {
    setGoods((prev) => ({ ...prev, description: value }));
  };

  const handleOptionChange = (index, field, value) => {
    const updated = [...options];
    updated[index][field] = field === "stockQty" ? value.replace(/\D/g, "") : value;
    setOptions(updated);
  };

  const addOption = () => setOptions([...options, { optionName: "", stockQty: "" }]);
  const removeOption = (index) => setOptions(options.filter((_, i) => i !== index));

  const validate = () => {
    const errs = {};
    if (!Goods.name) errs.name = "이름을 입력하세요.";
    if (!Goods.brand) errs.brand = "브랜드를 입력하세요.";
    if (!Goods.price || isNaN(Goods.price)) errs.price = "유효한 가격을 입력하세요.";
    if (Goods.salePercent < 0 || Goods.salePercent > 100) errs.salePercent = "0~100 사이의 숫자만 허용됩니다.";
    if (!Goods.description) errs.description = "설명을 입력하세요.";
    if (imageInputs.length === 0) errs.img = "이미지를 최소 1장 업로드하세요.";
    options.forEach((opt, i) => {
      if (!opt.optionName) errs[`optName${i}`] = "옵션명을 입력하세요.";
      if (!opt.stockQty || isNaN(opt.stockQty)) errs[`optQty${i}`] = "유효한 수량을 입력하세요.";
    });
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      scrollToError(Object.keys(errs)[0]);
      return false;
    }
    return true;
  };

  const doSubmit = async () => {
    if (!validate()) return;
    try {
      const formData = new FormData();
      imageInputs.forEach((input) => {
        if (input.file) formData.append("media", input.file);
      });

      formData.append("goods", new Blob([JSON.stringify(Goods)], { type: "application/json" }));

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/goods/insert`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const result = await res.json();
      if (result.id) {
        const optionData = options.map((opt) => ({ ...opt, goodsId: result.id }));
        await fetch(`${process.env.REACT_APP_API_URL}/api/goods/addGoodsItem`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(optionData),
        });
        alert("굿즈가 성공적으로 추가되었습니다.");
        navigate("/Goods");
      }
    } catch (err) {
      console.error(err);
      alert("추가 중 오류 발생");
    }
  };

  useEffect(() => {
    const scrollDiv = document.getElementById('root').scrollTo(0, 0);
    if (scrollDiv) scrollDiv.scrollTo(0, 0);
  }, [])

  return (
    <>
      <style>
        {`
        .ql-editor .ql-align-center {
          text-align: center;
        }
        .ql-editor .ql-align-center img {
          display: inline-block;
          margin: 0 auto;
          float: none;
          max-width: 100%;
          width: auto !important;
        }
      `}
      </style>
      <div className="p-6 max-w-2xl mx-auto text-gray-800">
        <header className="flex items-center justify-between border-b pb-4 mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center text-sm hover:text-black">
            <FaArrowLeft className="mr-1" /> 뒤로
          </button>
          <h1 className="text-2xl font-bold">굿즈 등록</h1>
          <button onClick={() => navigate("/Goods")} className="text-xl">
            <FaHome />
          </button>
        </header>

        <div className="space-y-5">
          <div>
            <label htmlFor="name" className="block font-medium">상품명</label>
            <input id="name" name="name" value={Goods.name} onChange={doChange} className={`mt-1 w-full border p-2 rounded ${errors.name ? "border-red-500" : "border-gray-300"}`} />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="brand" className="block font-medium">브랜드</label>
            <input id="brand" name="brand" value={Goods.brand} onChange={doChange} className={`mt-1 w-full border p-2 rounded ${errors.brand ? "border-red-500" : "border-gray-300"}`} />
            {errors.brand && <p className="text-sm text-red-500 mt-1">{errors.brand}</p>}
          </div>

          <div>
            <label className="block font-medium">카테고리</label>
            <select name="category" value={Goods.category} onChange={doChange} className="mt-1 w-full border p-2 rounded border-gray-300">
              <option value="상의">상의</option>
              <option value="하의">하의</option>
              <option value="신발">신발</option>
              <option value="기타">기타</option>
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block font-medium">가격</label>
            <input id="price" type="number" name="price" value={Goods.price || 0} onChange={doChange} className={`mt-1 w-full border p-2 rounded ${errors.price ? "border-red-500" : "border-gray-300"}`} />
            {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
          </div>

          <div>
            <label htmlFor="salePercent" className="block font-medium">할인율 (%)</label>
            <input id="salePercent" type="number" name="salePercent" value={Goods.salePercent || 0} onChange={doChange} className={`mt-1 w-full border p-2 rounded ${errors.salePercent ? "border-red-500" : "border-gray-300"}`} />
            {errors.salePercent && <p className="text-sm text-red-500 mt-1">{errors.salePercent}</p>}
          </div>

          <div>
            <label className="block font-medium">상품 설명</label>
            <div className={`mt-1 ${errors.description ? "border border-red-500" : ""}`}>
              <ReactQuill value={Goods.description} onChange={handleDescriptionChange} modules={modules} formats={formats} className="h-[500px] mb-2" />
            </div>
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block font-medium mt-[65px]">상품 이미지</label>
            <div ref={dropRef} onDrop={handleDrop} onDragOver={handleDragOver} className="border-2 border-dashed border-gray-300 p-6 rounded text-center cursor-pointer" onClick={() => dropRef.current.querySelector("input").click()}>
              <p className="text-gray-600">클릭하거나 이미지를 드래그해서 업로드하세요.</p>
              <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
            {errors.img && <p className="text-sm text-red-500 mt-1">{errors.img}</p>}
            <div className="flex flex-wrap gap-3 mt-3">
              {imageInputs.map((img, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img src={img.preview} alt={`미리보기 ${index + 1}`} className="w-full h-full object-cover rounded" />
                  <button onClick={() => removeImage(index)} title="이미지 삭제" className="absolute top-0 right-0 bg-black bg-opacity-50 hover:bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    <FaTimes className="w-2 h-2" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-bold mb-2">상품 옵션</h2>
            {options.map((opt, i) => (
              <div key={i} className="flex items-start gap-2 mb-3">
                <div className="flex-1">
                  <input id={`optName${i}`} placeholder="옵션명" value={opt.optionName} onChange={(e) => handleOptionChange(i, "optionName", e.target.value)} className={`w-full border p-2 rounded ${errors[`optName${i}`] ? "border-red-500" : "border-gray-300"}`} />
                  {errors[`optName${i}`] && <p className="text-sm text-red-500 mt-1">{errors[`optName${i}`]}</p>}
                </div>
                <div className="w-28">
                  <input id={`optQty${i}`} placeholder="수량" value={opt.stockQty} onChange={(e) => handleOptionChange(i, "stockQty", e.target.value)} className={`w-full border p-2 rounded ${errors[`optQty${i}`] ? "border-red-500" : "border-gray-300"}`} />
                  {errors[`optQty${i}`] && <p className="text-sm text-red-500 mt-1">{errors[`optQty${i}`]}</p>}
                </div>
                {options.length > 1 && <button onClick={() => removeOption(i)} className="text-red-500 text-sm mt-2">삭제</button>}
              </div>
            ))}
            <button onClick={addOption} className="text-blue-600 hover:underline text-sm">+ 옵션 추가</button>
          </div>

          <button onClick={doSubmit} className="w-full bg-black text-white py-3 rounded-lg mt-6 hover:bg-gray-900 font-medium">굿즈 등록하기</button>
        </div>
      </div>
    </>
  );
};

export default GoodsAdd;
