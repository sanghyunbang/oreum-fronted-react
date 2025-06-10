import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom"; 

function WritePost() {
  const [category, setCategory] = useState("일반게시글");
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [mountainName, setMountainName] = useState("");  // 산 이름 상태 추가
  const [hikingCourse, setHikingCourse] = useState("");  // 등산코스 상태 추가
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const dropRef = useRef();

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
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);

    if (category === "큐레이션게시글") {
      formData.append("mountainName", mountainName);
      formData.append("hikingCourse", hikingCourse);
    }

    files.forEach(file => formData.append("mediaFiles",file));

    try {
      const res = await fetch("http://localhost:8080/api/posts", {
        method: "POST",
        body: formData,
        credentials: "include"
      });      

      const result = await res.text();
      alert(`응답: ${result}`);

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
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="일반게시글">일반게시글</option>
          <option value="큐레이션게시글">큐레이션게시글</option>
        </select>
      </div>

      {/* 제목 입력 */}
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      {/* 큐레이션 게시글일 때만 노출되는 추가 입력란 */}
      {category === "큐레이션게시글" && (
        <>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">산 이름</label>
            <input
              type="text"
              value={mountainName}
              onChange={(e) => setMountainName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required={category === "큐레이션게시글"}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">등산 코스</label>
            <input
              type="text"
              value={hikingCourse}
              onChange={(e) => setHikingCourse(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required={category === "큐레이션게시글"}
            />
          </div>
        </>
      )}

      {/* 에디터 */}
      <div className="mb-12">
        <label className="block mb-2 font-medium text-gray-700">내용</label>
        <ReactQuill
          value={content}
          onChange={setContent}
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
          type="submit"
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
