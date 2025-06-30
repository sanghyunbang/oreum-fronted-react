import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function MainBoard() {
  const [postlist, setPostlist] = useState([]);
  const [openComments, setOpenComments] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const observerRef = useRef(null);

  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/user", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("사용자 정보 불러오기 실패");
      const data = await res.json();
      setUserId(data.userId);
    } catch (error) {
      console.error("로그인 사용자 정보 가져오기 실패:", error);
    }
  };

  const loadPost = async () => {
    try {
      const response = await fetch("http://localhost:8080/posts/list", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("응답 없음");

      const data = await response.json();
      setPostlist(
        data.map((post) => ({
          userId: post.userId,
          postId: post.postId,
          title: post.title,
          content: post.content,
          nickname: post.nickname || "익명",
          createdAt: post.createdAt,
          likeCount: post.likeCount || 0,
          commentCount: post.commentCount || 0,
          comments: post.comments || [],
          mediaList: post.mediaList || [], // 미디어 관련 추가 사항
        }))
      );
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
    }
  };

  const loadBookmarks = async (uid) => {
    try {
      const res = await fetch(`http://localhost:8080/posts/bookmarks/${uid}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("북마크 불러오기 실패");
      const data = await res.json();
      setBookmarkedPosts(data);
    } catch (error) {
      console.error("북마크 불러오기 에러:", error);
    }
  };

  const toggleBookmark = async (postId) => {
    try {
      const res = await fetch("http://localhost:8080/posts/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, postId }),
      });
      if (!res.ok) throw new Error("북마크 처리 실패");

      const data = await res.json();
      setBookmarkedPosts((prev) =>
        data.bookmarked
          ? [...prev, postId]
          : prev.filter((id) => id !== postId)
      );
    } catch (err) {
      console.error("북마크 토글 실패:", err);
    }
  };

  useEffect(() => {
    getUserInfo(); // 먼저 userId를 받아와야 함
    loadPost();
  }, []);

  useEffect(() => {
    if (userId) {
      loadBookmarks(userId);
    }
  }, [userId]);
  useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => Math.min(prev + 10, postlist.length));
      }
    },
    {
      threshold: 1.0,
    }
  );

  if (observerRef.current) {
    observer.observe(observerRef.current);
  }

  return () => {
    if (observerRef.current) {
      observer.unobserve(observerRef.current);
    }
  };
}, [postlist]);


  const formatTimeSince = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffDay >= 1) return `${diffDay}일 전`;
    if (diffHr >= 1) return `${diffHr}시간 전`;
    if (diffMin >= 1) return `${diffMin}분 전`;
    return `방금 전`;
  };

  const handleLike = async (postId) => {
  if (!userId) {
    alert("로그인이 필요합니다.");
    return;
  }

  try {
    const res = await fetch("http://localhost:8080/posts/like", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId,
        userId,
      }),
    });

    if (!res.ok) throw new Error("좋아요 처리 실패");

    const result = await res.json();

    setPostlist((prev) =>
      prev.map((post) =>
        post.postId === postId
          ? {
              ...post,
              likeCount: post.likeCount + (result.liked ? 1 : -1),
            }
          : post
      )
    );
  } catch (err) {
    console.error("좋아요 처리 오류:", err);
    alert("좋아요 처리 중 오류가 발생했습니다.");
  }
};


  return (
    <div className="max-w-2xl mx-auto p-5">
      <h2 className="text-xl font-bold mb-4">홈 게시글</h2>
      {postlist.slice(0, visibleCount).map((post, idx) => {
        const isLast = idx === visibleCount - 1;
        return(
        <div
          key={post.postId}
          ref={isLast ? observerRef : null}
          onClick={() => navigate(`/post/${post.postId}`)}
          className="cursor-pointer border border-gray-300 rounded-lg p-4 mb-4 bg-white shadow min-h-[352px] flex flex-col justify-between hover:bg-gray-50 transition"
        >
          <div className="flex justify-between items-center text-sm text-gray-500 mb-1">
            <span>
              <strong>{post.nickname}</strong> · {formatTimeSince(post.createdAt)}
            </span>
            <button
              className={`text-lg ${
                bookmarkedPosts.includes(post.postId)
                  ? "text-yellow-400 hover:text-yellow-500"
                  : "text-gray-400 hover:text-yellow-400"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(post.postId);
              }}
            >
              {bookmarkedPosts.includes(post.postId) ? "⭐" : "☆"}
            </button>
          </div>

          <h3 className="font-semibold text-base text-gray-800 mb-4">
            {post.title}
          </h3>

          {/* 썸네일 미디어 위치 ! */}
          {post.mediaList?.length > 0 && (
            <div className="mb-4">
              {post.mediaList.slice(0, 1).map((media, idx) =>
                media.mediaType === "image" ? (
                  <img
                    key={idx}
                    src={media.mediaUrl}
                    alt={`media-${idx}`}
                    className="w-[95%] h-[95%] mx-auto object-cover rounded mb-2"
                  />
                ) : (
                  <video
                    key={idx}
                    src={media.mediaUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-[95%] h-[95%] mx-auto object-cover rounded mb-2"
                  />
                )
              )}
            </div>
          )}


          {post.content && (
            <div
              className="text-sm text-gray-700 mb-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          <div className="flex justify-between text-sm text-gray-600 mt-auto pt-2 border-t border-gray-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLike(post.postId);
              }}
              className="hover:text-red-500"
            >
              👍 {post.likeCount}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenComments((prev) => ({
                  ...prev,
                  [post.postId]: !prev[post.postId],
                }));
              }}
              className="hover:text-blue-500"
            >
              💬 {post.commentCount} 댓글
            </button>
          </div>

          {openComments[post.postId] && (
            <div
              className="mt-4 p-3 border rounded bg-gray-50 text-sm text-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              {post.comments?.length > 0 ? (
                post.comments.map((cmt, idx) => (
                  <p key={idx} className="mb-1">
                    - {cmt.content}
                  </p>
                ))
              ) : (
                <p className="text-gray-400">댓글이 없습니다.</p>
              )}
            </div>
          )}
        </div>
        )
})}
    </div>
  );
}

export default MainBoard;