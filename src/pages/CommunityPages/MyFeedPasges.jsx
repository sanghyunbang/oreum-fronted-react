import { useNavigate,useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const MyFeedPages = () => {
  const { feedname } = useParams();
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [openComments, setOpenComments] = useState({});
  const navigate = useNavigate();

  // 시간 포맷
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

  useEffect(() => {
    const fetchfeedsAndPosts = async () => {
      try {
        const FeedRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/community/feeds/${feedname}`,
          { withCredentials: true }
        );
        setPosts(FeedRes.data);
      } catch (err) {
        console.error("커뮤니티 또는 게시글 정보를 불러오는 데 실패했습니다.", err);
      }
    };

    const getUserInfo = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user`, {
          withCredentials: true,
        });
        setUserId(res.data.userId);
      } catch (err) {
        console.error("유저 정보 가져오기 실패", err);
      }
    };

    fetchfeedsAndPosts();
    getUserInfo();
  }, [feedname]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        if (!userId) return;
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/posts/bookmarks/${userId}`,
          { withCredentials: true }
        );
        setBookmarkedPosts(res.data);
      } catch (err) {
        console.error("북마크 가져오기 실패", err);
      }
    };

    fetchBookmarks();
    console.log(feedname);
  }, [userId]);

  const toggleBookmark = async (postId) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/posts/bookmark`,
        { userId, postId },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const data = res.data;
      setBookmarkedPosts((prev) =>
        data.bookmarked ? [...prev, postId] : prev.filter((id) => id !== postId)
      );
    } catch (err) {
      console.error("북마크 토글 실패", err);
    }
  };

  if (!posts) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      
      <div className="space-y-6 mt-8">
        {posts.length === 0 ? (
          <p className="text-gray-500">게시글이 없습니다.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.postId}
              onClick={() => navigate(`/post/${post.postId}`)}
              className="border border-gray-300 rounded-lg p-4 shadow bg-white hover:bg-gray-50 transition cursor-pointer"
            >
              <div className="flex justify-between text-sm text-gray-600 mb-1">
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

              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {post.title}
              </h3>

              {post.mediaList?.length > 0 && (
                <div className="mb-4">
                  {post.mediaList.slice(0, 1).map((media, idx) =>
                    media.mediaType === "image" ? (
                      <img
                        key={idx}
                        src={media.mediaUrl}
                        alt={`media-${idx}`}
                        className="w-full h-48 object-cover rounded"
                      />
                    ) : (
                      <video
                        key={idx}
                        src={media.mediaUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-48 object-cover rounded"
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
                <span>👍 {post.likeCount}</span>
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
          ))
        )}
      </div>
    </div>
  );
};

export default MyFeedPages;
