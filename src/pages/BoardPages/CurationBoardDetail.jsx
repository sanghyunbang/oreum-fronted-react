import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default CurationBoardDetail = () => {

    const { postId } = useParams();
    const [ post, setPost] = useState(null); // 게시글 불러오는 곳, MySQL이랑 MongoDB 두개에서 가져와서 각각 넣어야
    
    const [isFavorited, setIsFavorited] = useState(true); // 좋아요 관련
    const [newComment, setNewComment] = useState(""); // 댓글 관련
    const [userInfo, setUserInfo] = useState(null); // 유저 정보 불러오기 -> 댓글/좋아요 등에 활용
    const [replyMap, setReplyMap] = useState({}); // commentId: reply text -> 무한 댓글 생성을 위한 구조 잡는 부분

    const [activeReplyBox, setActiveReplyBox] = useState(null); // 여러 댓글 중 어디에 열렸는지 열린 댓글 id
    const navigate = useNavigate();

    return (
        <>
        </>
    );
}