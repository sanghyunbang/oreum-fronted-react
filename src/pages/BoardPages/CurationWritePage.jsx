import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CurationSideBar from '../../components/curation/CurationSidebar';
import MapPolyLine from '../../components/mapForCuration/MapPolyLine';
import CurationPreview from '../../components/curation/CurationPreview';

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

  const [segments, setSegments] = useState({});

  const [markerCounts, setMarkerCounts] = useState(0);



  const [currentSegmentKey, setCurrentSegmentKey] = useState('');
  const [segmentCounter, setSegmentCounter] = useState(1);

  const handlePostResult = (segmentKey, segmentData) => {
    const safeMedia = Array.isArray(segmentData.media) ? segmentData.media : [];
    const processedMedia = safeMedia.map((file) => ({
      ...file,
      url: file.url || URL.createObjectURL(file.file || file),
    }));

    setSegments((prev) => ({
      ...prev,
      [segmentKey]: {
        ...(prev[segmentKey] || {}),
        content: segmentData.content,
        media: processedMedia,
        mountainName: commonData.mountainName,
        pointerFrom: segmentData.pointerFrom,
        pointerTo: segmentData.pointerTo,
        facilities: segmentData.facilities,
        route: segmentData.route || prev[segmentKey]?.route, //  여기 확인 필요[0624 11:50]
      },
    }));
  };


  // 지도에서 포인트 찍으면 segmentCounter 올라가고 -> 이게 구간 키로 작용
  // 지도에 polyline이 생성되는 개수와 연관 -> 나중에 조건부(detail curation 모드 등)로 실행 가능
  const handleRouteResult = (routePoint) => {
    const nextKey = `${segmentCounter}-${segmentCounter + 1}`;
    setCurrentSegmentKey(nextKey);
    setSegmentCounter((prev) => prev + 1);

    setSegments((prev) => ({
      ...prev,
      [nextKey]: {
        ...(prev[nextKey] || {}),
        route: routePoint,
      },
    }));
  };

  // polylineReady -> 사이드 바에서 저장하기 버튼을 누르면 true가 되도록 -
  // -> 이게 false면 polyLine이 안찍혀야 함.
  const [polylineReady, setPolylineReady] = useState(true);

  
  // 현재 내가 작성하고 있는 구간
  const handleSaveSegment = (newPointerFrom) => {
    const nextKey = `${newPointerFrom}-`;
    setCurrentSegmentKey(nextKey);
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

  // marker 갯수 세기 -> 이걸로 seg 키에 향후 사용할 예정
  const handleMarkerCount = () => {

  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex w-full lg:flex-row">
        {/* 사이드바 */}
        <div className="bg-gray-100 w-full lg:w-[450px]">
          <CurationSideBar
            commonData={commonData} // 사이드바에서 한 번만 입력하면 되는 공통 부분
            setCommonData={setCommonData}
            currentSegmentKey={currentSegmentKey}
            onPostResult={handlePostResult}
            onSaveSegment={handleSaveSegment}
            allSegments={segments}
            setPolylineReady={setPolylineReady}

            
            markerCounts = {markerCounts}
          />
        </div>

        {/* 본문 (지도 + 미리보기 위아래로 배치 + 제출 버튼) */}
        <div className="flex-1 w-full flex flex-col">
          <MapPolyLine onRoutesResult={handleRouteResult} setMarkerCounts={setMarkerCounts} />

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