import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function BoardDetail() {
  const { postId } = useParams(); // /post/:postId 에서 ID 추출
  const [post, setPost] = useState(null);
  const [isFavorited, setIsFavorited] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [replyMap, setReplyMap] = useState({}); // commentId: reply text
  const [activeReplyBox, setActiveReplyBox] = useState(null); // 열린 대댓글 입력창 ID
  const navigate = useNavigate();

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
      console.log("에러");
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
        headers: { "Content-Type": "application/json" },
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

  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말 이 게시글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8080/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("삭제 실패");

      alert("게시글이 삭제되었습니다.");
      navigate(-1); // 이전 페이지로 이동
    } catch (err) {
      console.error("삭제 오류:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    try {
      const res = await fetch(`http://localhost:8080/posts/comments/${commentId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newContent,
          userId: userInfo.userId,
        }),
      });

      if (!res.ok) throw new Error("댓글 수정 실패");

      // 클라이언트 상태 업데이트
      setPost((prev) => ({
        ...prev,
        comments: prev.comments.map((cmt) =>
          cmt.commentId === commentId ? { ...cmt, content: newContent } : cmt
        ),
      }));
    } catch (err) {
      console.error("댓글 수정 오류:", err);
      alert("댓글 수정 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm("정말 이 댓글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8080/posts/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("댓글 삭제 실패");

      // 상태에서 제거
      setPost((prev) => ({
        ...prev,
        comments: prev.comments.filter((cmt) => cmt.commentId !== commentId),
        commentCount: prev.commentCount - 1,
      }));
    } catch (err) {
      console.error("댓글 삭제 오류:", err);
      alert("댓글 삭제 중 오류가 발생했습니다.");
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

          const bookmarkRes = await fetch(
            `http://localhost:8080/posts/${postId}/bookmarked?userId=${data.userId}`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          if (bookmarkRes.ok) {
            const { bookmarked } = await bookmarkRes.json();
            setIsFavorited(bookmarked);
          }
        } else {
          setUserInfo(null);
        }
      } catch {
        setUserInfo(null);
      }
    };
    fetchUser();
    fetchPostDetail();
    console.log(postId);
  }, [postId]);

  if (!post) return <div className="p-10 text-center">불러오는 중...</div>;

  const copyUrlToClipboard = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => alert("게시글 URL이 복사되었습니다!"))
      .catch(() => alert("복사에 실패했습니다."));
  };

  const toggleFavorite = async () => {
    if (!userInfo) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/posts/bookmark", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: parseInt(postId, 10),
          userId: userInfo.userId,
          bookmark: !isFavorited, // true면 등록, false면 해제
        }),
      });

      if (!response.ok) throw new Error("북마크 처리 실패");

      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error("북마크 오류:", error);
      alert("북마크 처리 중 문제가 발생했습니다.");
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
          <strong>{cmt.nickname || "익명"}:</strong> {cmt.content}
        </p>
        {/* 댓글 주인일 때만 수정/삭제 버튼 노출 */}
        {userInfo?.userId === cmt.userId && (
          <div className="flex gap-2 text-xs text-gray-500 ml-2">
            <button
              onClick={() => {
                const updatedContent = prompt("댓글을 수정하세요:", cmt.content);
                if (updatedContent && updatedContent.trim() !== "") {
                  handleEditComment(cmt.commentId, updatedContent);
                }
              }}
              className="hover:underline"
            >
              수정
            </button>
            <button
              onClick={() => handleDeleteComment(cmt.commentId)}
              className="hover:underline text-red-500"
            >
              삭제
            </button>
          </div>
        )}

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
  //좋아요 클릭시 postId와 userId를 서버로 보내주고, 서버에서 해당 값을 가지는 postLike 테이블을 조회, 참/거짓을 리턴
  const handleLike = async () => {
    if (!userInfo) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/posts/like", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: parseInt(postId, 10),
          userId: userInfo.userId,
        }),
      });

      if (!response.ok) throw new Error("서버 응답 오류");

      const result = await response.json();

      // Post에 liked 값이 참/거짓일 경우를 판변에 값을 넣고 계산.
      setPost((prev) => ({
        ...prev,
        likeCount: prev.likeCount + (result.liked ? 1 : -1),
      }));
    } catch (err) {
      console.error("좋아요 처리 오류:", err);
      alert("좋아요 처리 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto p-6 bg-white border rounded-lg shadow">
      {/* 작성자 정보 */}
      <div className="flex justify-between items-center text-sm text-gray-500 mb-1">
        <span>
          <strong>{post.nickname}</strong> · {timeSince(post.createdAt)}
        </span>
        <button
          className={`text-lg ${
            isFavorited
              ? "text-yellow-400 hover:text-yellow-500"
              : "text-gray-400 hover:text-gray-600"
          }`}
          onClick={toggleFavorite}
          aria-label={isFavorited ? "즐겨찾기 해제" : "즐겨찾기"}
          title={isFavorited ? "즐겨찾기 해제" : "즐겨찾기"}
        >
          ★
        </button>
      </div>

      {/* 제목 */}
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

      {/* 미디어 */}
      {post.mediaList?.length > 0 && (
        <div className="mb-6">
          {post.mediaList.map((media, idx) =>
            media.mediaType === "image" ? (
              <img
                key={idx}
                src={media.mediaUrl}
                alt={`image-${idx}`}
                className="w-full max-h-[400px] object-contain rounded mb-3"
              />
            ) : (
              <video
                key={idx}
                src={media.mediaUrl}
                controls
                muted
                autoPlay
                loop
                playsInline
                className="w-full max-h-[400px] rounded mb-3"
              />
            )
          )}
        </div>
      )}

      {/* 내용 */}
      <article className="prose max-w-none mb-6" 
      style={{ minHeight: "300px" }}
      dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* 좋아요, 댓글, 공유 */}
      <div className="flex items-center gap-4 text-sm mb-6">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 text-red-500 hover:text-red-600"
          aria-label="좋아요"
        >
          👍 {post.likeCount}
        </button>
        <button
          onClick={() => {
            const commentInput = document.getElementById("new-comment-input");
            if (commentInput) commentInput.focus();
          }}
          className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
          aria-label="댓글 달기"
        >
          💬 {post.commentCount || 0}
        </button>
        <button
          onClick={copyUrlToClipboard}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
          aria-label="게시글 URL 복사"
        >
          🔗 공유
        </button>
      </div>

      {/* 댓글 입력 */}
      {userInfo && (
        <div className="mb-6">
          <input
            id="new-comment-input"
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddComment();
            }}
            placeholder="댓글을 입력하세요..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
      )}

      {/* 댓글 목록 */}
      <section>
        <h2 className="text-lg font-semibold mb-2">댓글 ({post.commentCount || 0})</h2>
        {post.comments?.length > 0 ? (
          renderComments(buildCommentTree(post.comments))
        ) : (
          <p className="text-gray-500">댓글이 없습니다.</p>
        )}
      </section>

      {/* 수정/삭제 버튼 (게시글 작성자만) */}
      {userInfo?.userId === post.userId && (
        <div className="absolute bottom-4 right-4 flex gap-3">
          <button
            onClick={() => navigate(`/post/${post.postId}/edit`)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded shadow hover:bg-blue-700 transition"
          >
            ✏️ 수정
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white text-sm rounded shadow hover:bg-red-600 transition"
          >
            🗑️ 삭제
          </button>
        </div>
      )}
    </div>
  );
}

export default BoardDetail;
