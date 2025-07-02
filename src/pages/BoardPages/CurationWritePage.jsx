import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import CurationSideBar from '../../components/curation/CurationSidebar';
import MapPolyLine from '../../components/mapForCuration/MapPolyLine';
import CurationPreview from '../../components/curation/CurationPreview';
import useMarkerInfo from '../../hooks/map/useMarkerInfo';
import transformForMongoDB from '../../hooks/DBPreprocess/transformForMongoDB.js';
export default function CurationWritePage() {
  const navigate = useNavigate();

  const [commonData, setCommonData] = useState({
    userId: '',
    nickname: '',
    boardId: '',
    type: 'curation',
    title: '',
  });

  const segObj = {
    order:1,
    difficulty:'',
    caution:'',
    geoJson:[],
    facility:[],
    pointerName:'',
    description:'',
    media:[],
    isEmpty:false,
    isUpward:true,
    mountainName: '',
  };


  const [markerCounts, setMarkerCounts] = useState(0);

  const [segments, setSegments] = useState({});

  // segments를 마커 개수에 따라서 셋팅해놓기
  useEffect(() => {
    setSegments((prevSegments) => {
      const newSegments = { ...prevSegments };
  
      const totalCount = markerCounts + (markerCounts - 1); // 전체 세그먼트 개수
  
      // 1. 추가 또는 업데이트
      for (let i = 0; i < totalCount; i++) {
        const order = i + 1;
  
        if (!newSegments[order]) {
          const isPointer = i % 2 === 0;
          newSegments[order] = {
            ...segObj,
            order,
            segmentMode: isPointer ? "pointer" : "path",
          };
        }
      }
  
      // 2. 제거 (markerCount 줄어든 경우)
      Object.keys(newSegments).forEach((key) => {
        if (parseInt(key) > totalCount) {
          delete newSegments[key];
        }
      });
  
      return newSegments;
    });
  }, [markerCounts]);
  
  /**
   * 예시)
   * segments = {
        1: { order: 1, segmentMode: 'pointer', ... },
        2: { order: 2, segmentMode: 'path', ... },
        3: { order: 3, segmentMode: 'pointer', ... },
        4: { order: 4, segmentMode: 'path', ... },
        5: { order: 5, segmentMode: 'pointer', ... },
      }
   */

  // 최종 제출 -> common 사항은 MySQL로 보냄 -> 이후에 오는 PrimaryKey 받아서 이거까지 반영한 데이터를 MongoDB로 보내기

  const handleSubmit = async () => {

    console.log("Segments전체 검사: ", segments);

    // 여기선 MySQL로 공통 사항 보내기
    // curationInsert 백 api 만들 예정 -> insert와 동시에 해당 프라이머리키 보내줘야

    try {

      // [0630] 검색좌표 추가 -> segments에서 제일 마지막에 좌표가 누적적으로 있고, 그 좌표를 평균으로 한걸 대표값
      const lastKey = Math.max(...Object.keys(segments).map(Number)); // 가장 높은 숫자 키 구하기

      console.log(" lastKey:", lastKey);
      console.log(" segments[lastKey]:", segments[lastKey]);
      const accGeoList = segments[lastKey]?.geoJson;
      console.log(" accGeoList (좌표 리스트):", accGeoList);

      // const geoNum = accGeoList.length;

      let accLat = 0;
      let accLng = 0;
      let validCount = 0;

      for (let i = 0; i < accGeoList.length; i++) {
        const coord = accGeoList[i];
        if (coord && typeof coord.lat === "number" && typeof coord.lng === "number") {
          accLat += coord.lat;
          accLng += coord.lng;
          validCount++;
        } else {
          console.warn("좌표 포맷이 잘못됨:", coord);
        }
      }


      const searchLat = accLat / validCount;
      const searchLng = accLng / validCount;


      // const searchGeo = [searchLat, searchLng];


      // 1. MYSQL 글 공통 먼저 전송 + [0630] searchGeo추가
      const sqlPost = {
        userId: commonData.userId,
        nickname: commonData.nickname,
        boardId: parseInt(commonData.boardId, 10),
        type: commonData.type,
        title: commonData.title,
        mountainName: commonData.mountainName,
        searchGeo:  `${searchLat},${searchLng}`
      };

      // 1-1. insert가 FormData형식을 받는걸로 돼 있어서 파일이 없더라도 FormData로 보내야
      const SqlData = new FormData();

      SqlData.append(
        "post",
        new Blob([JSON.stringify(sqlPost)], { type: "application/json "})
      )

      // fetch 전송
      const sqlRes = await fetch(`${process.env.REACT_APP_API_URL}/posts/insert`, {
        method: 'POST',
        body: SqlData,
        credentials: 'include',
      });

      if(!sqlRes.ok) throw new Error('MySQL 등록 실패');

      const result = await sqlRes.json(); // 백에서 이런식 -> { message: "...", postId: ..., curationId: ... }
      const PrimaryKeyOfDB = result.postId;
      alert(`글 등록이 성공했습니다. 아이디: ${PrimaryKeyOfDB}`);

      // 2. mongoDB로 보내기
      const mongoSegments = transformForMongoDB(segments);
      
      // 2-1 FormData 생성
      const mongoFormData = new FormData();

      // 2-2 segments(JSON)을 하나의 필드로 담기
      mongoFormData.append(
        'segments',
        new Blob([JSON.stringify(mongoSegments)], {type: 'application/json'})
      );

      // 2-3 curationId 도 함께 전송
      mongoFormData.append('postId', PrimaryKeyOfDB);


      // 2-4 각 segment별 media도 FormData에 첨부
      Object.entries(segments).forEach(([segmentKey, segment]) => {
        (segment.media || []).forEach((mediaObj, idx) => {
          const file = mediaObj.file; 
          if(!file) return;
          mongoFormData.append(`media-${segmentKey}-${idx}`, file); // 이름 지정
        });
      });

      // 2-5 백으로 요청 전송
      const mongoRes = await fetch(`${process.env.REACT_APP_API_URL}/mongo/curationSegments`,{
        method: 'POST',
        body: mongoFormData,
        credentials: 'include',
      });

      if(!mongoRes.ok) throw new Error('MongoDB 저장 실패')

    } catch (error) {
      console.error(error);
      alert('글 등록이 실패했습니다.');    
    }

  }
  
  // 세부 수정할 구간 정하기

  useEffect(() => {
    console.log('🧩 segments 업데이트됨:', segments);
  }, [segments]);

  // mapPolyLine에서 좌표 받아와서 해당 seg에 넣기

  const handleSetGeoForSegment = (segmentKey, coords) => {
    setSegments((prev) => ({
      ...prev,
      [segmentKey]: {
        ...prev[segmentKey],
        geoJson: coords,
      },
    }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex w-full lg:flex-row">
        {/* 사이드바 */}
        <div className="bg-gray-100 w-full lg:w-[450px]">
          <CurationSideBar
            commonData={commonData} // 사이드바에서 한 번만 입력하면 되는 공통 부분
            setCommonData = {setCommonData}
            segments={segments}
            setSegments = {setSegments}
            markerCounts = {markerCounts}
            segObj={segObj}
          />
        </div>

        {/* 본문 (지도 + 미리보기 위아래로 배치 + 제출 버튼) */}
        <div className="flex-1 w-full flex flex-col">
          <MapPolyLine
            setMarkerCounts={setMarkerCounts}
            setGeoForSegment={handleSetGeoForSegment}
          /> 
          {/* focusSection={}  이거 넣어야 하는데 */}

          <div className="bg-white shadow-lg rounded p-4 mt-4">
            <CurationPreview segments={segments} />

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                전체 제출
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}