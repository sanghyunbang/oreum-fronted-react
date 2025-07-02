import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PostEditPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/${postId}`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("게시글 불러오기 실패");
        const data = await res.json();
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
      } catch (error) {
        console.error(error);
        alert("게시글을 불러오는 중 문제가 발생했습니다.");
        navigate(-1);
      }
    };

    fetchPost();
  }, [postId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/${postId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          userId: post.userId,
        }),
      });

      if (!res.ok) throw new Error("수정 실패");

      alert("게시글이 수정되었습니다.");
      navigate(`/post/${postId}`);
    } catch (error) {
      console.error("수정 오류:", error);
      alert("게시글 수정 중 문제가 발생했습니다.");
    }
  };

  if (!post) return <p className="p-6 text-center">게시글 정보를 불러오는 중...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white border border-gray-200 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">게시글 수정</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">제목</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">내용</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded h-60 resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            저장
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostEditPage;