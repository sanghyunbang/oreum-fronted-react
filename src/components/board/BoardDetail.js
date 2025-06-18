import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function BoardDetail() {
  const { postId } = useParams(); // /post/:postId 에서 ID 추출
  const [post, setPost] = useState(null);
  const [isFavorited, setIsFavorited] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [replyMap, setReplyMap] = useState({}); // commentId: reply text
  const [activeReplyBox, setActiveReplyBox] = useState(null); // 열린 대댓글 입력창 ID

  const fetchPostDetail = async () => {
    try {
      const response = await fetch(`http://localhost:8080/posts/${postId}`, {
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

  const handleAddReply = async (parentId) => {
  const replyContent = replyMap[parentId];
  if (!replyContent?.trim()) return;
  if (!userInfo) {
    alert("로그인이 필요합니다.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/posts/comments`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: replyContent,
        userId: userInfo.userId,
        postId: parseInt(postId, 10),
        parentId, // 대댓글이므로 parentId 포함
      }),
    });

    if (!response.ok) throw new Error("대댓글 등록 실패");

    const addedReply = await response.json();

    // 새로 받은 대댓글을 post.comments에 추가
    setPost((prev) => ({
      ...prev,
      comments: [...prev.comments, addedReply],
      commentCount: prev.commentCount + 1,
    }));

    // 입력 초기화
    setReplyMap((prev) => ({ ...prev, [parentId]: "" }));
    setActiveReplyBox(null);
  } catch (error) {
    console.error(error);
    alert("대댓글 작성 중 오류 발생");
  }
};

  const handleAddComment = async () => {
  if (!newComment.trim()) return; // 빈 댓글 방지
  if (!userInfo) {
    alert("로그인이 필요합니다.");
    return;
  }
  
  try {
    const response = await fetch(`http://localhost:8080/posts/comments`, {
      method: "POST",
      credentials: "include",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ 
        content: newComment, 
        userId: userInfo.userId,
        postId: parseInt(postId, 10),
       }),
    });

    if (!response.ok) throw new Error("댓글 등록 실패");

    const addedComment = await response.json();

    // 댓글 목록에 추가
    setPost((prevPost) => ({
      ...prevPost,
      comments: [...(prevPost.comments || []), addedComment], // 혹은 댓글 객체로 받으면 맞게 변경
      commentCount: (prevPost.commentCount || 0) + 1,
    }));

    setNewComment(""); // 입력창 초기화
  } catch (error) {
    alert("댓글 작성 중 오류가 발생했습니다.");
    console.error(error);
  }
};


  useEffect(() => {
    const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/user", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUserInfo(data);
      } else {
        setUserInfo(null);
      }
    } catch {
      setUserInfo(null);
    }
  };
    fetchUser();
    fetchPostDetail();
    console.log(postId)
  }, [postId]);

  if (!post) return <div className="p-10 text-center">불러오는 중...</div>;

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert("게시글 URL이 복사되었습니다!"))
      .catch(() => alert("복사에 실패했습니다."));
  };

  const toggleFavorite = async () => {
  if (!userInfo) {
    alert("로그인이 필요합니다.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/posts/like", {
      method: isFavorited ? "DELETE" : "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId: parseInt(postId, 10),
        userId: userInfo.userId,
      }),
    });

    if (!response.ok) throw new Error("좋아요 처리 실패");

    setIsFavorited(!isFavorited);
    setPost((prev) => ({
      ...prev,
      upvotes: prev.upvotes + (isFavorited ? -1 : 1),
    }));
  } catch (err) {
    console.error(err);
    alert("좋아요 처리 중 오류 발생");
  }
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

  // 댓글을 parentId 기반으로 트리로 정리
const buildCommentTree = (comments) => {
  const map = {};
  const roots = [];

  comments.forEach((comment) => {
    comment.replies = [];
    map[comment.commentId] = comment;
  });

  comments.forEach((comment) => {
    if (comment.parentId) {
      map[comment.parentId]?.replies.push(comment);
    } else {
      roots.push(comment);
    }
  });
  return roots;
};
const renderComments = (comments, depth = 0) => {
  return comments.map((cmt) => (
    <div key={cmt.commentId} style={{ marginLeft: depth * 20 }} className="mb-2">
      <p className="text-sm text-gray-700">
       <strong>{cmt.nickname || '익명'}:</strong> {cmt.content}
      </p>

      {userInfo && (
        <button
          onClick={() => setActiveReplyBox(cmt.commentId)}
          className="text-xs text-blue-500 hover:underline ml-2"
        >
          답글
        </button>
      )}

      {activeReplyBox === cmt.commentId && (
        <div className="mt-2">
          <input
            type="text"
            value={replyMap[cmt.commentId] || ""}
            onChange={(e) =>
              setReplyMap((prev) => ({
                ...prev,
                [cmt.commentId]: e.target.value,
              }))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddReply(cmt.commentId);
            }}
            placeholder="답글 입력..."
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          />
        </div>
      )}

      {cmt.replies?.length > 0 && renderComments(cmt.replies, depth + 1)}
    </div>
  ));
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
      <div
        className="text-base text-gray-700 whitespace-pre-wrap mb-6 min-h-[300px]"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

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
        {renderComments(buildCommentTree(post.comments || []))}
      </div>

        {/* 댓글 입력창 */}
        {userInfo ? (
          <input
            type="text"
            placeholder="댓글 달기..."
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddComment();
              }
            }}
          />
        ) : (
          <p className="text-sm text-gray-500">댓글을 작성하려면 로그인 해주세요.</p>
        )}
      </div>
    </div>
  );
}

export default BoardDetail;
