import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FacilitySelector from '../Icons/FacilitySelector';
import MediaPreview from './MediaPreview';

export default function CurationSideBar({ currentSegmentKey, onPostResult, onSaveSegment, allSegments }) {
  const navigate = useNavigate();
  const dropRef = useRef();

  const [segmentContent, setSegmentContent] = useState('');
  const [segmentFiles, setSegmentFiles] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [quillKey, setQuillKey] = useState(0); // for forcing ReactQuill reset
  const [facilityKey, setFacilityKey] = useState(0); // for forcing FacilitySelector reset

  const [postdata, setPostdata] = useState({
    userId: '',
    nickname: '',
    boardId: '',
    type: 'curation',
    title: '',
    mountainName: '',
    pointerFrom: '',
    pointerTo: '',
  });

  const [boards, setBoards] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [facilitiesVersion, setFacilitiesVersion] = useState(0);

  const isFirstSegment = !currentSegmentKey || Object.keys(allSegments).length === 0;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/user', { credentials: 'include' });
        const data = await res.json();
        setPostdata((prev) => ({ ...prev, userId: data.userId, nickname: data.nickname }));
      } catch (err) {
        console.error('유저 정보 가져오기 실패:', err);
      }
    };

    const fetchBoards = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/community/list', { credentials: 'include' });
        const data = await res.json();
        setBoards(data);
      } catch (err) {
        console.error('게시판 불러오기 실패:', err);
      }
    };

    fetchUserInfo();
    fetchBoards();
  }, []);

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    const valid = selected.filter(file => file.type.startsWith('image/') || file.type === 'video/mp4');
    setSegmentFiles((prev) => [...prev, ...valid]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    const valid = dropped.filter(file => file.type.startsWith('image/') || file.type === 'video/mp4');
    setSegmentFiles((prev) => [...prev, ...valid]);
  };

  const removeFile = (index) => {
    setSegmentFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveClick = () => {
    const filesWithUrl = segmentFiles.map(file => ({
      file,
      type: file.type,
      url: file.url || URL.createObjectURL(file),
    }));

    const newSegmentKey = `${postdata.pointerFrom}-${postdata.pointerTo}`;

    try {
      onPostResult(newSegmentKey, {
        content: segmentContent,
        media: filesWithUrl,
        mountainName: postdata.mountainName,
        pointerFrom: postdata.pointerFrom,
        pointerTo: postdata.pointerTo,
        facilities: selectedFacilities,
      });

      const nextPointerFrom = postdata.pointerTo;

      setPostdata((prev) => ({
        ...prev,
        pointerFrom: nextPointerFrom,
        pointerTo: '',
      }));

      setSegmentContent('');
      setSegmentFiles([]);
      setSelectedFacilities([]);
      setFacilitiesVersion(prev => prev + 1);
      setFacilityKey(prev => prev + 1);
      setQuillKey(prev => prev + 1);

      if (onSaveSegment) onSaveSegment(nextPointerFrom);
    } catch (error) {
      console.error("onPostResult 오류:", error);
    }
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    if (type !== 'curation') navigate('/feed/write');
    else setPostdata({ ...postdata, type });
  };

  useEffect(() => {
    const currentSegment = allSegments?.[currentSegmentKey];
    if (currentSegment) {
      setSegmentContent(currentSegment.content || '');
      const media = currentSegment.media;
      const mediaArray = Array.isArray(media) ? media : media ? [media] : [];
      setSegmentFiles(mediaArray.map(file => file?.file || file).filter(Boolean));

      setPostdata((prev) => ({
        ...prev,
        mountainName: currentSegment.mountainName || '',
        pointerFrom: currentSegment.pointerFrom || currentSegmentKey.split('-')[0],
        pointerTo: currentSegment.pointerTo || '',
      }));

      setSelectedFacilities(currentSegment.facilities || []);
      setFacilitiesVersion(prev => prev + 1);
      setFacilityKey(prev => prev + 1);
      setQuillKey(prev => prev + 1);
    } else {
      const prevTo = currentSegmentKey?.split('-')[1] || '';
      setSegmentContent('');
      setSegmentFiles([]);
      setPostdata((prev) => ({
        ...prev,
        mountainName: prev.mountainName,
        pointerFrom: isFirstSegment ? '' : prevTo,
        pointerTo: '',
      }));
      setSelectedFacilities([]);
      setFacilitiesVersion(prev => prev + 1);
      setFacilityKey(prev => prev + 1);
      setQuillKey(prev => prev + 1);
    }
  }, [currentSegmentKey, allSegments]);

  return (
    <div className="max-w-2xl mx-auto p-4 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">게시글 작성</h2>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mb-4 px-3 py-1.5 bg-gradient-to-r from-green-100 via-green-200 to-blue-100 text-gray-800 font-medium rounded-full shadow hover:scale-105 transition-transform text-sm"
      >
        {collapsed ? '공통 정보 펼치기' : '공통 정보 접기'}
      </button>

      {!collapsed && (
        <div className="mb-6 p-4 rounded-lg border border-gray-200 bg-gray-50">
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">[공통 정보] 게시글 유형</label>
            <select
              value={postdata.type}
              onChange={handleTypeChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="general">일반게시글</option>
              <option value="curation">큐레이션게시글</option>
              <option value="meeting">모임/동행</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">[공통 정보] 제목</label>
            <input
              type="text"
              value={postdata.title}
              onChange={(e) => setPostdata({ ...postdata, title: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">[공통 정보] 게시판 선택</label>
            <select
              value={postdata.boardId}
              onChange={(e) => setPostdata({ ...postdata, boardId: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">게시판을 선택하세요</option>
              {boards.map((board) => (
                <option key={board.boardId} value={board.boardId}>
                  {board.thumbnailUrl || '🏕️'} {board.title}
                </option>
              ))}
            </select>
          </div>          
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">산이름</label>
            <input
              type="text"
              value={postdata.mountainName}
              onChange={(e) => setPostdata({ ...postdata, mountainName: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">[공통 정보] 작성자</label>
            <input
              type="text"
              value={postdata.nickname}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">작성된 구간 불러오기</label>
        <select
          value={currentSegmentKey}
          onChange={(e) => navigate(`/curation/write?segment=${e.target.value}`)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          {Object.entries(allSegments).map(([key]) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">포인터명(출발)</label>
        <input
          type="text"
          value={postdata.pointerFrom}
          onChange={(e) => setPostdata({ ...postdata, pointerFrom: e.target.value })}
          readOnly={!isFirstSegment}
          className={`w-full border border-gray-300 rounded px-3 py-2 ${!isFirstSegment ? 'bg-gray-100' : ''}`}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">포인터명(도착)</label>
        <input
          type="text"
          value={postdata.pointerTo}
          onChange={(e) => setPostdata({ ...postdata, pointerTo: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <FacilitySelector
        key={facilityKey}
        selectedFacilities={selectedFacilities}
        setSelectedFacilities={setSelectedFacilities}
        version={facilitiesVersion}
      />
      <label className="block mb-1 font-medium text-gray-700 mt-4">내용 (볼거리, 주의사항 등)</label>
      <div className="bg-white border border-gray-300 rounded overflow-hidden mb-4">
        <ReactQuill
          key={quillKey}
          value={segmentContent}
          onChange={setSegmentContent}
          className="editor-container"
          style={{ height: '300px' }}
        />
      </div>

      <div
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => dropRef.current.querySelector('input').click()}
        className="border-2 border-dashed border-gray-400 p-6 text-center rounded cursor-pointer mb-4"
      >
        <p className="text-gray-500">이미지 또는 영상(mp4)을 드래그하거나 클릭하세요</p>
        <input type="file" accept="image/*,video/mp4" multiple onChange={handleFileSelect} className="hidden" />
      </div>

      <MediaPreview files={segmentFiles} onRemove={removeFile} />

      <div className="flex justify-end space-x-3">
        <button type="button" onClick={handleSaveClick} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          이 구간 저장
        </button>
      </div>
    </div>
  );
}