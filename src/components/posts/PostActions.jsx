import React from "react";

function PostActions({ post, onLike, onCommentFocus, onShare }) {
  return (
    <div className="flex items-center gap-4 text-sm mb-6">
      <button
        onClick={onLike}
        className="flex items-center gap-1 text-red-500 hover:text-red-600"
        aria-label="좋아요"
      >
        👍 {post.likeCount}
      </button>
      <button
        onClick={onCommentFocus}
        className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
        aria-label="댓글 달기"
      >
        💬 {post.commentCount || 0}
      </button>
      <button
        onClick={onShare}
        className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
        aria-label="게시글 URL 복사"
      >
        🔗 공유
      </button>
    </div>
  );
}

export default PostActions;
