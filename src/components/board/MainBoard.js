import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MainBoard() {
  const [postlist, setPostlist] = useState([]);
  const [openComments, setOpenComments] = useState({}); // 댓글창 상태

  const navigate = useNavigate();

  const toggleComments = (postId) => {
    setOpenComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const loadPost = async () => {
    try {
      const response = await fetch("http://localhost:8030/", {
        method: "post",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!response.ok) throw new Error("응답 없음");

      const data = await response.json();
      setPostlist(data);
    } catch (error) {
      setPostlist([
        {
          id: 1,
          title: "임시 테스트 게시글",
          content: "서버 연결 전 더미 데이터입니다.",
          author: "테스트유저",
          createdAt: new Date().toISOString(),
          upvotes: 5,
          commentCount: 3,
          comments: ["재밌네요!", "좋은 글입니다."],
        },
      ]);
    }
  };

  useEffect(() => {
    loadPost();
  }, []);

  const formatTimeSince = (createdAt) => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now - created;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffDay >= 1) {
    return `${diffDay}일 전`;
  } else if (diffHr >= 1) {
    return `${diffHr}시간 전`;
  } else if (diffMin >= 1) {
    return `${diffMin}분 전`;
  } else {
    return `방금 전`;
  }
};


  return (
    <div className="max-w-2xl mx-auto p-5">
      <h2 className="text-xl font-bold mb-4">게시글</h2>
      {postlist.map((post) => (
        <div
          key={post.id}
          onClick={() => navigate(`/post/${post.id}`)}
          className="cursor-pointer border border-gray-300 rounded-lg p-4 mb-4 bg-white shadow min-h-[352px] flex flex-col justify-between hover:bg-gray-50 transition"
        >
          {/* 작성자 및 날짜 + 북마크 */}
          <div className="flex justify-between items-center text-sm text-gray-500 mb-1">
            <span>
              <strong>{post.author || "익명"}</strong> · {formatTimeSince(post.createdAt)}
            </span>

            <button
              className="text-yellow-400 text-lg hover:text-yellow-500"
              onClick={(e) => e.stopPropagation()}
            >
              ⭐
            </button>
          </div>

          {/* 제목 */}
          <h3 className="font-semibold text-base text-gray-800 mb-4">
            {post.title}
          </h3>

          {/* 내용 */}
          <p className="text-sm text-gray-700 mb-4">
            {post.content?.length > 100
              ? post.content.slice(0, 100) + "..."
              : post.content}
          </p>

          {/* 좋아요/댓글 */}
          <div className="flex justify-between text-sm text-gray-600 mt-auto pt-2 border-t border-gray-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log("좋아요");
              }}
              className="hover:text-red-500"
            >
              👍 {post.upvotes || 0}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleComments(post.id); // 댓글창 토글
              }}
              className="hover:text-blue-500"
            >
              💬 {post.commentCount || 0} 댓글
            </button>
          </div>

          {/* 댓글 영역 (토글) */}
          {openComments[post.id] && (
            <div
              className="mt-4 p-3 border rounded bg-gray-50 text-sm text-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 댓글 리스트 */}
              {post.comments?.map((cmt, idx) => (
                <p key={idx} className="mb-1">
                  - {cmt}
                </p>
              ))}
              {/* 댓글 입력창 */}
              <input
                type="text"
                placeholder="댓글 달기..."
                className="w-full mt-2 px-3 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default MainBoard;
