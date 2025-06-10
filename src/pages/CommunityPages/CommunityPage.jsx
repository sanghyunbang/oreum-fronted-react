import{ useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import CommunityHeader from "../../components/community/CommunityHeader";
import CommunityStats from "../../components/community/CommunityStats";
import PostPreviewCard from "../../components/community/PostPreviewCard";

const CommunityPage = () => {
    const { communityName } = useParams();
    const [community, setCommunity] = useState(null);
    const [ posts, setPosts ] = useState([]);

    useEffect(()=>{
        // 서버에서 해당 커뮤니티 정보를 요청하기
        axios.get(`http://localhost:8080/api/community/${communityName}`,{
            withCredentials: true
        })
             .then(res => setCommunity(res.data))
             .catch(err => console.error("커뮤니티 정보를 불러올 수 없습니다."));


        // axios.get(`http://localhost:8080/api/posts?boardName=${communityName}`)
        //      .then(res => setPosts(res.data))
        //      .catch(err => console.error("게시글 정보를 불러올 수 없습니다."));
    }, [communityName]);

    if (community) {
        console.log("커뮤니티 정보:", community);
    }

    if (!community) return <p>Loading...</p>;

    return(
        <div className="max-w-5xl mx-auto p-4">
            <CommunityHeader community={community}/>
            <CommunityStats community={community}/>
      
            {/* <div className="space-y-4 mt-6">
                <PostPreviewCard key={posts.post_id} post={posts}/>
            </div>             */}
        </div>
    )

}

export default CommunityPage;