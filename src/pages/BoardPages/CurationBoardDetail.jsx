import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usePostDetail from "../../hooks/post/usePostDetail";

export default CurationBoardDetail = () => {

    const { postId } = useParams();
    const navigate = useNavigate();

    // sql에서 불러오는 정보
    const {
        post,
        setPost,
        userInfo,
        isFavorited,
        handleToggleFavorite,
        handleLike,
        handleShare,
    } = usePostDetail(postId);

    // MongoDB 에서 정보 불러오기

    // MapPolyline그려진거 가져오는 것도 필요!
    // prop으로 pointer좌표 받으면 그걸로 자동 polyLine그리는 컴포넌트 만들어 놓기

    const [segments, setSegments] = useState({});

    useEffect(() => {
    const getMongoSegments = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/mongo/curationSegments/${postId}`, {
        method: 'GET',
        credentials: 'include',
        });
        const rawSegments = await response.json();

        // segmentKey 기준으로 객체로 변환
        const segmentMap = {};
        rawSegments.forEach(seg => {
        segmentMap[seg.segmentKey] = seg;
        });

        setSegments(segmentMap);
    };

    getMongoSegments();
    }, [postId]);


    /** 받아온 segments가 이런 형태
     * [
        {
            "_id": "685cb0a984823b6ac3d1e512",
            "segmentKey": "1",
            "geometry": { "type": "Point", "coordinates": [...] },
            ...
        },
        {
            "_id": "685cb0a984823b6ac3d1e513",
            "segmentKey": "2",
            ...
        }
       ]
     */


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