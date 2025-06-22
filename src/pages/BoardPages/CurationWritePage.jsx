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
        route: segmentData.route || prev[segmentKey]?.route,
      },
    }));
  };

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

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex w-full lg:flex-row">
        {/* 사이드바 */}
        <div className="bg-gray-100 w-full lg:w-[450px]">
          <CurationSideBar
            commonData={commonData}
            setCommonData={setCommonData}
            currentSegmentKey={currentSegmentKey}
            onPostResult={handlePostResult}
            onSaveSegment={handleSaveSegment}
            allSegments={segments}
          />
        </div>

        {/* 본문 (지도 + 미리보기 위아래로 배치 + 제출 버튼) */}
        <div className="flex-1 w-full flex flex-col">
          <MapPolyLine onRoutesResult={handleRouteResult} />

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