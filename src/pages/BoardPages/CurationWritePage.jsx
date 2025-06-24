import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import CurationSideBar from '../../components/curation/CurationSidebar';
import MapPolyLine from '../../components/mapForCuration/MapPolyLine';
import CurationPreview from '../../components/curation/CurationPreview';
import useMarkerInfo from '../../hooks/map/useMarkerInfo';

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
    segmentMode:'',
    segmentKey:'',
    difficulty:'',
    caution:'',
    geoJson:[],
    facility:[],
    pointerName:'',
    description:'',
    media:[],
    isEmpty:false
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
  

  const [currentSegmentKey, setCurrentSegmentKey] = useState(''); // 포인터면 단일 정수, 구간이면 "정수1-정수2" 형태
  
  // point는 marketListRef.current.length로 / 
  const handlePointers = (orderKey, newGeoJson) => {
    setSegments((prev) => ({
      ...prev,
      [orderKey]: {
        ...prev[orderKey], // 기존 segment 복사
        geoJson: newGeoJson, // geoJson만 업데이트
      },
    }));
  };
  

  const handleSubmit = async () => {
    const formData = new FormData();

    const finalPost = {
      ...commonData,
      boardId: parseInt(commonData.boardId, 10),
      segments: {},
    };

    Object.entries(segments).forEach(([key, value]) => {
      finalPost.segments[key] = {
        content: value.content,
        route: value.route,
        mountainName: value.mountainName,
        pointerFrom: value.pointerFrom,
        pointerTo: value.pointerTo,
        facilities: value.facilities,
      };

      (value.media || []).forEach((file, idx) => {
        formData.append(`media-${key}-${idx}`, file.file || file);
      });
    });

    formData.append('post', new Blob([JSON.stringify(finalPost)], { type: 'application/json' }));

    try {
      const res = await fetch('http://localhost:8080/posts/insert', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const result = await res.text();
      alert(`응답: ${result}`);
    } catch (e) {
      console.error(e);
      alert('글 등록 실패');
    }
  };

  // 세부 수정할 구간 정하기기


  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex w-full lg:flex-row">
        {/* 사이드바 */}
        <div className="bg-gray-100 w-full lg:w-[450px]">
          <CurationSideBar
            commonData={commonData} // 사이드바에서 한 번만 입력하면 되는 공통 부분
            segments={segments}
            setSegments = {setSegments}
            markerCounts = {markerCounts}
            segObj={segObj}
          />
        </div>

        {/* 본문 (지도 + 미리보기 위아래로 배치 + 제출 버튼) */}
        <div className="flex-1 w-full flex flex-col">
          <MapPolyLine setMarkerCounts={setMarkerCounts} setPointers ={handlePointers} /> 
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