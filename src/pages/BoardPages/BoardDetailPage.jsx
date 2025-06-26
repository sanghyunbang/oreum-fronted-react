import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PostHeader from "../../components/posts/PostHeader";
import PostMedia from "../../components/posts/PostMedia";
import PostContent from "../../components/posts/PostContent";
import PostActions from "../../components/posts/PostActions";
import CommentInput from "../../components/posts/CommentInput";
import CommentList from "../../components/posts/CommentList";
import PostControls from "../../components/posts/PostControls";

function BoardDetailPage() {

  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isFavorited, setIsFavorited] = useState(true);

  const fetchPostDetail = async () => {
    try {
      const res = await fetch(`http://localhost:8080/posts/${postId}`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("게시글 불러오기 실패");
      const data = await res.json();
      setPost(data);
    } catch (err) {
      console.error("게시글 로딩 오류:", err);
    }
  };

  const fetchUserInfo = async () => {
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
          { method: "GET", credentials: "include" }
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

  useEffect(() => {
    fetchUserInfo();
    fetchPostDetail();
  }, [postId]);

  const handleToggleFavorite = async () => {
    if (!userInfo) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/posts/bookmark", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: parseInt(postId, 10),
          userId: userInfo.userId,
          bookmark: !isFavorited,
        }),
      });

      if (!res.ok) throw new Error("북마크 실패");
      setIsFavorited(!isFavorited);
    } catch (err) {
      console.error("북마크 오류:", err);
      alert("북마크 처리 실패");
    }
  };

  const handleLike = async () => {
    if (!userInfo) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/posts/like", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: parseInt(postId, 10),
          userId: userInfo.userId,
        }),
      });

      if (!res.ok) throw new Error("좋아요 실패");

      const result = await res.json();
      setPost((prev) => ({
        ...prev,
        likeCount: prev.likeCount + (result.liked ? 1 : -1),
      }));
    } catch (err) {
      console.error("좋아요 오류:", err);
    }
  };

  const handleShare = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => alert("URL이 복사되었습니다!"))
      .catch(() => alert("복사 실패"));
  };

  if (!post) return <div className="p-10 text-center">불러오는 중...</div>;

  return (
    <div className="relative max-w-3xl mx-auto p-6 bg-white border rounded-lg shadow">
      <PostHeader
        post={post}
        userInfo={userInfo}
        isFavorited={isFavorited}
        onToggleFavorite={handleToggleFavorite}
      />
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <PostMedia mediaList={post.mediaList} />
      <PostContent content={post.content} />
      <PostActions
        post={post}
        onLike={handleLike}
        onCommentFocus={() => document.getElementById("new-comment-input")?.focus()}
        onShare={handleShare}
      />
      <CommentInput postId={post.postId} userInfo={userInfo} setPost={setPost} />
      <CommentList comments={post.comments} userInfo={userInfo} postId={post.postId} setPost={setPost} />
      <PostControls post={post} userInfo={userInfo} navigate={navigate} />
    </div>
  );
}

export default BoardDetailPage;
