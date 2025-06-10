import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function BoardDetail() {
  const { postId } = useParams(); // /post/:postId 에서 ID 추출
  const [post, setPost] = useState(null);
  const [isFavorited, setIsFavorited] = useState(true);

  const fetchPostDetail = async () => {
    try {
      const response = await fetch(`http://localhost:8000/post/${postId}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("응답 없음");
      const data = await response.json();
      setPost(data);
    } catch (error) {
      // 더미 데이터 (서버 없을 때용)
      setPost({
        id: postId,
        title: "임시 상세 게시글",
        content: "이곳은 게시글의 전체 내용을 보여주는 상세 페이지입니다.",
        author: "테스트유저",
        createdAt: "2025/6/9 13:54",
        upvotes: 12,
        commentCount: 2,
        comments: ["좋은 정보 감사합니다!", "재밌게 읽었어요."],
      });
    }
  };

  useEffect(() => {
    fetchPostDetail();
  }, [postId]);

  if (!post) return <div className="p-10 text-center">불러오는 중...</div>;

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert("게시글 URL이 복사되었습니다!"))
      .catch(() => alert("복사에 실패했습니다."));
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const timeSince = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past; // 밀리초 차이

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return `${diffSeconds}초 전`;
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    return `${diffDays}일 전`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border rounded-lg shadow">
      {/* 작성자 정보 */}
      <div className="flex justify-between items-center text-sm text-gray-500 mb-1">
        <span>
          <strong>{post.author}</strong> ·{" "}
          {timeSince(post.createdAt)}
        </span>
        <button
          className={`text-lg ${
            isFavorited ? "text-yellow-400 hover:text-yellow-500" : "text-gray-400 hover:text-gray-600"
          }`}
          onClick={toggleFavorite}
          aria-label={isFavorited ? "즐겨찾기 해제" : "즐겨찾기"}
          title={isFavorited ? "즐겨찾기 해제" : "즐겨찾기"}
          type="button"
        >
          {isFavorited ? "⭐" : "☆"}
        </button>
      </div>

      {/* 제목 */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{post.title}</h2>

      {/* 본문 내용 */}
      <p className="text-base text-gray-700 whitespace-pre-wrap mb-6 min-h-[300px]">
        {post.content}
      </p>

      {/* 좋아요 / 댓글 수 */}
      <div className="flex gap-2 text-sm text-gray-600 mb-4">
        <button className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded hover:bg-gray-100">
          👍 {post.upvotes}
        </button>
        <span className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded bg-gray-50 cursor-default">
          💬 {post.commentCount} 댓글
        </span>
        <button
          onClick={copyUrlToClipboard}
          className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
          title="게시글 URL 복사"
        >
          🔗URL
        </button>
      </div>

      {/* 댓글 목록 */}
      <div className="mt-4 p-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold mb-2 text-gray-700">댓글</h4>
        <div className="space-y-2 mb-4">
          {post.comments?.map((cmt, idx) => (
            <p key={idx} className="text-sm text-gray-700">
              - {cmt}
            </p>
          ))}
        </div>

        {/* 댓글 입력창 */}
        <input
          type="text"
          placeholder="댓글 달기..."
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
        />
      </div>
    </div>
  );
}

export default BoardDetail;
