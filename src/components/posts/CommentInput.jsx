import React, { useState } from "react";

function CommentInput({ postId, userInfo, setPost }) {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

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

      setPost((prevPost) => ({
        ...prevPost,
        comments: [...(prevPost.comments || []), addedComment],
        commentCount: (prevPost.commentCount || 0) + 1,
      }));

      setNewComment(""); // 입력창 초기화
    } catch (error) {
      alert("댓글 작성 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  if (!userInfo) return null;

  return (
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
  );
}

export default CommentInput;
