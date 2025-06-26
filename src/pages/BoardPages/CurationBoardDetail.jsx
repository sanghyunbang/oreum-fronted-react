import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default CurationBoardDetail = () => {

    const { postId } = useParams();
    const navigate = useNavigate();

    const [ post, setPost] = useState(null); // 게시글 불러오는 곳, MySQL이랑 MongoDB 두개에서 가져와서 각각 넣어야
    const [userInfo, setUserInfo] = useState(null); // 유저 정보 불러오기 -> 댓글/좋아요 등에 활용
    const [isFavorited, setIsFavorited] = useState(true); // 좋아요 관련


    return (
        <>
        </>
    );
}