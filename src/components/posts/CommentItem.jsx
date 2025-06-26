import React, { useState } from "react";

function CommentItem({ comment, depth = 0, userInfo, postId, setPost }) {
  const [replyText, setReplyText] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      const res = await fetch(`http://localhost:8080/posts/comments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyText,
          userId: userInfo.userId,
          postId: parseInt(postId, 10),
          parentId: comment.commentId,
        }),
      });

      if (!res.ok) throw new Error("대댓글 등록 실패");
      const addedReply = await res.json();

      setPost((prev) => ({
        ...prev,
        comments: [...prev.comments, addedReply],
        commentCount: prev.commentCount + 1,
      }));

      setReplyText("");
      setShowReplyBox(false);
    } catch (err) {
      console.error(err);
      alert("대댓글 작성 중 오류");
    }
  };

  const handleEdit = async () => {
    const updated = prompt("댓글 수정:", comment.content);
    if (!updated || updated.trim() === "") return;

    try {
      const res = await fetch(`http://localhost:8080/posts/comments/${comment.commentId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: updated,
          userId: userInfo.userId,
        }),
      });

      if (!res.ok) throw new Error("댓글 수정 실패");

      setPost((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c.commentId === comment.commentId ? { ...c, content: updated } : c
        ),
      }));
    } catch (err) {
      console.error("댓글 수정 오류:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`http://localhost:8080/posts/comments/${comment.commentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("댓글 삭제 실패");

      setPost((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c.commentId !== comment.commentId),
        commentCount: prev.commentCount - 1,
      }));
    } catch (err) {
      console.error("삭제 오류:", err);
    }
  };

  return (
    <div style={{ marginLeft: depth * 20 }} className="mb-2">
      <p className="text-sm text-gray-700">
        <strong>{comment.nickname || "익명"}</strong>: {comment.content}
      </p>

      {userInfo?.userId === comment.userId && (
        <div className="flex gap-2 text-xs text-gray-500 ml-2">
          <button onClick={handleEdit} className="hover:underline">수정</button>
          <button onClick={handleDelete} className="hover:underline text-red-500">삭제</button>
        </div>
      )}

      {userInfo && (
        <button
          onClick={() => setShowReplyBox((prev) => !prev)}
          className="text-xs text-blue-500 hover:underline ml-2"
        >
          답글
        </button>
      )}

      {showReplyBox && (
        <div className="mt-1">
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleReply()}
            placeholder="답글 입력..."
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          />
        </div>
      )}

      {/* 대댓글 재귀 렌더링 */}
      {comment.replies?.length > 0 &&
        comment.replies.map((reply) => (
          <CommentItem
            key={reply.commentId}
            comment={reply}
            depth={depth + 1}
            userInfo={userInfo}
            postId={postId}
            setPost={setPost}
          />
        ))}
    </div>
  );
}

export default CommentItem;
