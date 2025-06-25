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
    mountainName: '',
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
    isUpward:true
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

    // 여기선 MySQL로 공통 사항 보내기
    // curationInsert 백 api 만들 예정 -> insert와 동시에 해당 프라이머리키 보내줘야

    try {
      // 1. MYSQL 글 공통 먼저 전송
      const sqlPost = {
        userId: commonData.userId,
        nickname: commonData.nickname,
        boardId: parseInt(commonData.boardId, 10),
        type: commonData.type,
        title: commonData.title,
        mountainName: commonData.mountainName
      };

      const sqlRes = await fetch('http://localhost:8080/posts/curationInsert', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify(sqlPost),
        credentials: 'include',
      });

      if(!sqlRes.ok) throw new Error('MySQL 등록 실패');

      const PrimaryKeyOfDB = await sqlRes.text(); // 프라이머리 키로 받을건데 text로 받아서 나중에 변환할듯
      alert(`글 등록이 성공했습니다. 글 ID :`, PrimaryKeyOfDB);

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
      mongoFormData.append('curationId', PrimaryKeyOfDB);

      // 2-4 각 segment별 media도 FormData에 첨부
      Object.entries(segments).forEach(([segmentKey, segment]) => {
        (segment.media || []).forEach((mediaObj, idx) => {
          const file = mediaObj.file; 
          if(!file) return;
          mongoFormData.append(`media-${segmentKey}-${idx}`,file)
        });
      });

      // 2-5 백으로 요청 전송

      const mongoRes = await fetch('http://localhost:8080/mongo/curationSegments',{
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


  // const handleSubmit = async () => {
  //   const formData = new FormData();

  //   const finalPost = {
  //     ...commonData,
  //     boardId: parseInt(commonData.boardId, 10),
  //     segments: {},
  //   };

  //   Object.entries(segments).forEach(([key, value]) => {
  //     finalPost.segments[key] = {
  //       content: value.content,
  //       route: value.route,
  //       mountainName: value.mountainName,
  //       pointerFrom: value.pointerFrom,
  //       pointerTo: value.pointerTo,
  //       facilities: value.facilities,
  //     };

  //     (value.media || []).forEach((file, idx) => {
  //       formData.append(`media-${key}-${idx}`, file.file || file);
  //     });
  //   });

  //   formData.append('post', new Blob([JSON.stringify(finalPost)], { type: 'application/json' }));

  //   try {
  //     const res = await fetch('http://localhost:8080/posts/insert', {
  //       method: 'POST',
  //       body: formData,
  //       credentials: 'include',
  //     });

  //     const result = await res.text();
  //     alert(`응답: ${result}`);
  //   } catch (e) {
  //     console.error(e);
  //     alert('글 등록 실패');
  //   }
  // };