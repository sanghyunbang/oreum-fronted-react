import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; 

function WritePost() {
  const [category, setCategory] = useState("등산큐레이팅");

  const [title, setTitle] = useState("");
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
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <h2>Create Post</h2><br />
      <form onSubmit={handleSubmit}>
        제목 : 
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <ReactQuill value={content} onChange={setContent} 
        style={{ minHeight: '300px', marginBottom: '1rem' }} />

        <div
          ref={dropRef}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => dropRef.current.querySelector("input").click()}
          style={{
            border: "2px dashed #aaa",
            padding: 20,
            marginTop: 20,
            textAlign: "center",
          }}
        >
          <p>이미지 또는 영상(mp4)을 드래그 하세요</p>
          <input
            type="file"
            accept="image/*,video/mp4"
            multiple
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
          {files.map((file, index) => {
            const url = URL.createObjectURL(file);
            return (
              <div key={index} style={{ position: "relative" }}>
                {file.type.startsWith("image/") ? (
                  <img src={url} alt="preview" style={{ width: 100, height: 100, objectFit: "cover" }} />
                ) : (
                  <video src={url} controls style={{ width: 100, height: 100 }} />
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  style={{ position: "absolute", top: 0, right: 0 }}
                >
                  ❌
                </button>
              </div>
            );
          })}
        </div>

        <br />
        <button type="submit">등록</button>
      </form>
    </div>
  );
}

export default WritePost;
