import { type } from "@testing-library/user-event/dist/type";
import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom"; 

function WritePost() {
  
  const navigate = useNavigate();
 
  const [mountainName, setMountainName] = useState("");  // 산 이름 상태 추가
  const [hikingCourse, setHikingCourse] = useState("");  // 등산코스 상태 추가
  const [files, setFiles] = useState([]);
  const dropRef = useRef();
  const [formdata, setFormdata] = useState({title : "", 
    content : "", 
    type : "general", 
    userId : localStorage.getItem("nickname")});

  // 드래그 앤 드롭 핸들링
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => 
      file.type.startsWith("image/") || file.type === "video/mp4"
    );
    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_,i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
        
    // if (category === "curation") {
    //   formData.append("mountainName", mountainName);
    //   formData.append("hikingCourse", hikingCourse);
    // }

    files.forEach(file => formdata.append("mediaFiles",file));

    try {
      const res = await fetch("http://localhost:8080/api/posts/insert", {
        method: "POST",
        body: formdata,
        credentials: "include",
        headers:{"Content-Type" : "application/json", 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` }
      });      
      console.log(formdata)
      const result = await res.text();
      alert(`응답: ${result}`);
      navigate("/mainboard");

    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">게시글 작성</h2>

      {/* 게시글 유형 */}
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">게시글 유형</label>
        <select
          value={formdata.type}
          onChange={(e) => setFormdata({ ...formdata, type: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="general">일반게시글</option>
          <option value="curation">큐레이션게시글</option>
        </select>
      </div>

      {/* 제목 입력 */}
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">제목</label>
        <input
          type="text"
          value={formdata.title}
          onChange={(e) => setFormdata({ ...formdata, title: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      {/* 유저 아이디 */}
      <div>
        <p>작성자</p>
        <input
        type="text"
        value={localStorage.getItem("nickname")}
        readOnly
        className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>



      {/* 큐레이션 게시글일 때만 노출되는 추가 입력란 */}
      {formdata.type === "큐레이션게시글" && (
        <>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">산 이름</label>
            <input
              type="text"
              value={mountainName}
              onChange={(e) => setMountainName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required={formdata.type === "큐레이션게시글"}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">등산 코스</label>
            <input
              type="text"
              value={hikingCourse}
              onChange={(e) => setHikingCourse(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required={formdata.type === "큐레이션게시글"}
            />
          </div>
        </>
      )}

      {/* 에디터 */}
      <div className="mb-12">
        <label className="block mb-2 font-medium text-gray-700">내용</label>
        <ReactQuill
          value={formdata.content}
          onChange={(value) => setFormdata({ ...formdata, content: value })}
          className="bg-white"
          style={{ height: "300px", marginBottom: "1rem" }}
        />
      </div>

      {/* 드래그앤드롭 */}
      <div
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => dropRef.current.querySelector("input").click()}
        className="border-2 border-dashed border-gray-400 p-6 text-center rounded cursor-pointer mb-4"
      >
        <p className="text-gray-500">이미지 또는 영상(mp4)을 드래그하거나 클릭하세요</p>
        <input
          type="file"
          accept="image/*,video/mp4"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* 미리보기 */}
      <div className="flex flex-wrap gap-3 mb-6">
        {files.map((file, index) => {
          const url = URL.createObjectURL(file);
          return (
            <div key={index} className="relative">
              {file.type.startsWith("image/") ? (
                <img
                  src={url}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded"
                />
              ) : (
                <video
                  src={url}
                  controls
                  className="w-24 h-24 rounded object-cover"
                />
              )}
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-0 right-0 bg-white text-red-500 font-bold px-1 py-0.5 rounded"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          등록
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
        >
          취소
        </button>
        
      </div>
    </div>
  );
}

export default WritePost;
