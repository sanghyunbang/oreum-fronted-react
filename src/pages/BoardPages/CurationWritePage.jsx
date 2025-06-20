import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import CurationSideBar from '../../components/curation/CurationSidebar';

import MapPolyLine from '../../components/mapForCuration/MapPolyLine';

export default function CurationWritePage() {

    const navigate = useNavigate();


    // 백과 통신할 내용들 묶어 놓은 부분
    const [postdata, setPostdata] = useState({
    userId: "",
    nickname: "",
    boardId: "",
    type: "curation",
    title: "",
    content: "",
    mountainName: "",
    route: "",
    caution: "",
    nearbyAttraction: "",
    meetingDate: "",
    meetingLocation: ""
    });

    // 검색 산 이름 정보 상태 변환[wp 동일]
    const [mountainName, setMountainName] = useState("");
  
    // route 좌표 받을 곳 -> 마커 표시 찍히는 지점들 받는 곳[wp 동일]
    const [hikingCourse, setHikingCourse] = useState("");


    // 미디어 정보 담는 칸
    const [files, setFiles] = useState();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [trails, setTrails] = useState([]);

    // [FROM1: CurationSidebar => 서버에 보낼 기본 정보들 받아오는 부분 (postdata 정보)]
    const handlePostResult = async (postInfo) => {
        setPostdata(postInfo);
    }

    // [FROM2: MapPolyLine => 찍어놓은 좌표 정보 받아오는 부분 (routes 정보)]
    const handleRouteResult = async (routesInfo) => {
        setTrails(routesInfo); // 이러면 업데이트 된거 찍히나?
    }

    // 이 부분은 curation만 관련 -> [글 등록]
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        files.forEach((file) => formData.append("media",file));

        // 산이름 추가
        postdata.mountainName = mountainName;
        // 좌표 정보 추가
        postdata.route = hikingCourse;

        // 서브커뮤니티 등록 확인 및 id타입 변환(string->정수)
        if (!postdata.boardId){
            alert("게시판을 선택하세요.")
            return;
        }

        const finalPost = {
            ...postdata,
            boardId: parseInt(postdata.boardId, 10),
        };

        formData.append("post", new Blob([JSON.stringify(finalPost)], { type: "application/json "}));

        try {
            const res = await fetch("http://localhost:8080/posts/insert", {
                method: "POST",
                body: formData,
                credentials: "include",
            })

            const result = await res.text();
            alert(`응답: ${result}`);
            
            // navigate를 본인이 쓴 글의 상세 페이지로?--> 수정할 듯
            // navigate("/mainboard");
        } catch (e) {
            console.error(e);
            alert("글 등록 실패");
        }
    }  


  return (
    <div className="flex h-screen relative">
      {/* 토글 버튼 */}
      <button
        className={`absolute top-4 z-50 bg-gray-300 px-2 py-1 rounded-r text-sm transition-all duration-300
          ${isSidebarOpen ? 'left-[300px]' : 'left-0'}`}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? '◀' : '▶'}
      </button>

      {/* 사이드바 */}
      <div
        className={`bg-gray-100 h-full overflow-hidden transition-all duration-300
          ${isSidebarOpen ? 'w-[300px]' : 'w-0'}`}
      >
        {/* <div className="w-[300px] h-full">{isSidebarOpen && <Search onSearchResult={handleSearchResult} />}</div> */}
        <div className="w-[300px] h-full">{isSidebarOpen && <CurationSideBar onPostResult={handlePostResult} />}</div>
      </div>

      {/* 지도 영역 */}
      <div className="flex-1 h-full">
        <div className="w-full h-full">
          <MapPolyLine onRouesResult={handleRouteResult}/>
        </div>
      </div>
    </div>
  );
};