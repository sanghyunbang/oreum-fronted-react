import React from "react";

function PostControls({ post, userInfo, navigate }) {
  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말 이 게시글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/${post.postId}`, {
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

  if (userInfo?.userId !== post.userId) return null;

  return (
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
  );
}

export default PostControls;
