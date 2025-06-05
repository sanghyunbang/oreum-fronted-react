import React from "react";

export default function PostCard({ post }) {
  return (
    <div className="bg-white shadow rounded p-4 mb-4">
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>
          <strong>{post.author || "익명"}</strong> ·{" "}
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
        <span className="text-yellow-400">⭐</span>
      </div>
      <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="post"
          className="w-full max-h-[300px] object-cover mb-2 rounded"
        />
      )}
      <p className="text-sm text-gray-700 mb-2 line-clamp-3">{post.content}</p>
      <div className="flex gap-4 text-sm text-gray-500">
        <span>👍 {post.upvotes || 0}</span>
        <span>💬 {post.commentCount || 0} 댓글</span>
      </div>
    </div>
  );
}
