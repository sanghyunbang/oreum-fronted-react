// src/hooks/usePostDetail.js
import { useEffect, useState } from "react";

export default function usePostDetail(postId) {
  const [post, setPost] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isFavorited, setIsFavorited] = useState(true);

  useEffect(() => {
    fetchUserInfo();
    fetchPostDetail();
  }, [postId]);

  const fetchPostDetail = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/${postId}`, {
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
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/user`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUserInfo(data);

        const bookmarkRes = await fetch(
          `${process.env.REACT_APP_API_URL}/posts/${postId}/bookmarked?userId=${data.userId}`,
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

  const handleToggleFavorite = async () => {
    if (!userInfo) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/bookmark`, {
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
      const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/like`, {
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

  return {
    post,
    setPost,
    userInfo,
    isFavorited,
    handleToggleFavorite,
    handleLike,
    handleShare,
  };
}
