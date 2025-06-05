import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; 

function WritePost() {
  const [category, setCategory] = useState("등산큐레이팅");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
    category,
    title,
    content,
    // 이미지 파일은 보통 별도 처리 필요
  };
  try {
    const response = await fetch("http://localhost:8030/wpost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",  // 쿠키 보낼 때 필요하면 추가
      body: JSON.stringify(postData),
    });

    const result = await response.text();
    alert(`서버 응답: ${result}`);
  } catch (error) {
    console.error("에러 발생:", error);
  }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <h2>Create Post</h2>

      <form onSubmit={handleSubmit}>
        <label>
          카테고리:
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ marginLeft: 8 }}>
            <option value="등산큐레이팅">등산큐레이팅</option>
            <option value="등산모집">등산모집</option>
          </select>
        </label>

        <br /><br />

        <label>
          제목:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
            required
          />
        </label>

        <br />

        <label>
          내용:
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            style={{ height: 250, marginTop: 4, marginBottom: 20 }}
            placeholder="내용을 입력하세요"
          />
        </label>

        <label>
          이미지 업로드:
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "block", marginTop: 4 }} />
        </label>

        <br />

        <button type="submit" style={{ padding: "8px 16px", fontSize: 16 }}>
          등록
        </button>
      </form>
    </div>
  );
}

export default WritePost;
