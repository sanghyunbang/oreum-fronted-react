import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PostHeader from "../../components/posts/PostHeader";
import PostMedia from "../../components/posts/PostMedia";
import PostContent from "../../components/posts/PostContent";
import PostActions from "../../components/posts/PostActions";
import CommentInput from "../../components/posts/CommentInput";
import CommentList from "../../components/posts/CommentList";
import PostControls from "../../components/posts/PostControls";
import usePostDetail from "../../hooks/post/usePostDetail";

import CurationDetailView from "../../components/curation/CurationDetailView";
import CurationMapFloating from "../../components/mapForCuration/CurationMapFloating";


function BoardDetailPage() {

  const { postId } = useParams();
  const navigate = useNavigate();

  const {
    post,
    setPost,
    userInfo,
    isFavorited,
    handleToggleFavorite,
    handleLike,
    handleShare,
  } = usePostDetail(postId);

  const [segments, setSegments] = useState({});

  useEffect(() => {
    if (post?.type === "curation") {
      const getMongoSegments = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/mongo/curationSegments/${postId}`, {
            method: 'GET',
            credentials: 'include',
          });

          if (!response.ok) throw new Error("Mongo fetch 실패");

          const rawSegments = await response.json();
          const segmentMap = {};
          rawSegments.forEach(seg => {
            console.log("개별 seg 내용:", seg); // 여기에서 facility 있는지 확인
            segmentMap[seg.segmentKey] = seg;
          });

          setSegments(segmentMap);
        } catch (err) {
          console.error("MongoDB segments 가져오기 실패:", err);
        }
      };

      getMongoSegments();
    }
  }, [post?.type, postId]);



  if (!post) return <div className="p-10 text-center">불러오는 중...</div>;

  return post.type === "curation" ? (
    <div className="relative w-[75%] ml-4 p-6 bg-white border rounded-lg shadow">
      <PostHeader
        post={post}
        userInfo={userInfo}
        isFavorited={isFavorited}
        onToggleFavorite={handleToggleFavorite}
      />
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
  
      <CurationDetailView segments={segments} />
  
      {(() => {
        const segmentList = Object.values(segments)
          .filter((seg) => seg.geometry?.type === "LineString")
          .sort((a, b) => Number(a.segmentKey) - Number(b.segmentKey));
  
        const lastSegment = segmentList.at(-1);
        return lastSegment ? (
          <CurationMapFloating coordinates={lastSegment.geometry.coordinates} />
        ) : null;
      })()}
  
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
  ) : (
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
