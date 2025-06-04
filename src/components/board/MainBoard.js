const { useEffect, useState } = require("react");


function MainBoard(){

const [postlist, setPostlist] = useState([]);

const loadPost = async () =>{
    try{
const response = await fetch("http://localhost:8000/postlist",
    {
        method:"post", credentials:"include",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({})
    }
);
if (!response.ok) throw new Error("응답 없음");

const data = await response.json();
setPostlist(data);
}catch(error){
    setPostlist([
      {
        id: 1,
        title: "임시 테스트 게시글",
        content: "서버 연결 전 더미 데이터입니다.",
        author: "테스트유저",
        createdAt: new Date().toISOString(),
        upvotes: 5,
      },
    ]);
}
}

useEffect(()=>{
    loadPost();
},[]);

return(
    
  <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
    <h2>🔥 최신 게시글</h2>
    {postlist.length === 0 ? (
      <p>게시글이 없습니다.</p>
    ) : (
      postlist.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: "16px",
            marginBottom: "16px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
            {/* 추천 버튼 모양 */}
            <div style={{ marginRight: 12, textAlign: "center" }}>
              <div style={{ cursor: "pointer", fontSize: 20 }}>🔺</div>
              <div style={{ fontSize: 14, color: "#666" }}>{post.upvotes || 0}</div>
              <div style={{ cursor: "pointer", fontSize: 20 }}>🔻</div>
            </div>

            {/* 게시글 제목 및 내용 */}
            <div>
              <h3 style={{ margin: "0 0 4px" }}>{post.title}</h3>
              <p style={{ margin: 0, color: "#555", fontSize: 14 }}>
                {post.content?.length > 100
                  ? post.content.slice(0, 100) + "..."
                  : post.content}
              </p>
              <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                by <strong>{post.author || "익명"}</strong> |{" "}
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
)

}


export default MainBoard;