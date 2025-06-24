import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FacilitySelector from '../Icons/FacilitySelector';
import MediaPreview from './MediaPreview';
import useMarkerInfo from '../../hooks/map/useMarkerInfo';

export default function CurationSideBar({ commonData, segments, setSegments, markerCounts, segObj}) {

  // 훅 불러와서 사용 -> 포인터 및 구간 생성 (찍어놓은 마커 갯수에 따라서서) 

    const {pointerCount,
    pathsCount,
    pointerOptions,
    pathOptions
  } = useMarkerInfo(markerCounts);

  // 특정 키에 대한 정보 담기
  const [sectionData, setSectionData] = useState(segObj);


  // 해당 구간을 선택 관련
  const [selectedPath, setSelectedPath] = useState('');
  const [selectedPointer, setSelectedPointer] = useState('');


  // 포인트 글쓸지, 구간 글 쓸지
  const [selectedMode, setSelectedMode] = useState("pointer"); // 'path' 또는 'pointer' - 키값 홀짝이 있으면 되는데 굳이 필요한가

  // 키값 저장하기
  const [segmentKey, setSegmentKey] = useState(1);


  const navigate = useNavigate();
  const dropRef = useRef();

  const [segmentContent, setSegmentContent] = useState('');
  const [segmentFiles, setSegmentFiles] = useState([]);
  const [collapsed, setCollapsed] = useState(false); // 사이드바 공통정보 숨기기 여부 설정
  const [quillKey, setQuillKey] = useState(0); // for forcing ReactQuill reset
  const [facilityKey, setFacilityKey] = useState(0); // for forcing FacilitySelector reset


  const [postdata, setPostdata] = useState(commonData); // 공통사항 (유저id, 닉네임, boardId, 타입, title, 산이름)

  // 이건 boards 표출과 관련
  const [boards, setBoards] = useState([]);
  // 이것도 시설표시 표출과 관련 
  const [selectedFacilities, setSelectedFacilities] = useState([]);

  //시작하자 마자 -> 유저 닉네임이랑, boards(내가 등록한 커뮤니티 표출 해주는 곳)
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

  // 미디어 관련 처리
  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    const valid = selected.filter(file => file.type.startsWith('image/') || file.type === 'video/mp4');
    setSegmentFiles((prev) => [...prev, ...valid]);
  };

  // 미디어 관련 처리2
  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    const valid = dropped.filter(file => file.type.startsWith('image/') || file.type === 'video/mp4');
    setSegmentFiles((prev) => [...prev, ...valid]);
  };

  // 미디어 관련 처리3 (삭제)
  const removeFile = (index) => {
    setSegmentFiles((prev) => {
      const fileToRemove = prev[index];
      //blob:은 브라우저가 메모리에 만든 임시 URL임을 의미
      if (fileToRemove?.url?.startsWith('blob:')) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  // 지금 구간 저장하기 버튼 눌렀을 때 실행되는 함수
  const handleSaveClick = () => {

    // 파일 관련 -> 미리보기에 사용할 url생성

    const filesWithUrl = segmentFiles.map(file => ({
      file,
      type: file.type,
      url: file.url || URL.createObjectURL(file), // 브라우저에서 제공해주는 URL객체 메서드 -> File이나 Blob객체를 가리키는 임시 URL을 생성
    }));

    const identityKey = segmentKey;    


  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    if (type !== 'curation') navigate('/feed/write');
    else setPostdata({ ...postdata, type });
  };


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
            <label className="block mb-1 font-medium text-gray-700">[공통 정보] 산이름</label>
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

      {/* 모드 선택 탭 */}  
      <div className="mb-6 flex justify-center space-x-4">
        <button
          onClick={() => setSelectedMode("pointer")}
          className={`px-4 py-2 rounded-full text-sm font-medium border 
            ${selectedMode === "pointer" ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"}`}
        >
          포인터 작성
        </button>
        <button
          onClick={() => setSelectedMode("path")}
          className={`px-4 py-2 rounded-full text-sm font-medium border 
            ${selectedMode === "path" ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"}`}
        >
          구간 작성
        </button>

      </div>

      {/* 선택된 모드에 따라 필드 출력 */}
      {selectedMode === "path" && (
        <>
          {/* 구간 선택 */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">작성할 구간</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              
              onChange={(e) => {
                const selectedValue = e.target.value;
                setSelectedPath(selectedValue);
            
                // value로 다시 pathOptions 배열에서 찾아서 key 추출
                const matched = pathOptions.find((path) => path.value === selectedValue);
                if (matched) {
                  setSegmentKey(matched.key); // 여기서 path.key가 setSegmentKey로 들어감!
                }
              }}
              
              value={selectedPath}
            >
              {pathOptions.map((path) => (
                <option key={path.key} value={path.value}>{path.value}</option>
              ))}
            </select>

              {/* {showGuide && (
                <div className="absolute top-1/2 left-full ml-2 transform -translate-y-1/2 z-50">
                  <div className="relative bg-blue-50 border border-blue-300 text-blue-900 text-sm px-3 py-2 rounded shadow-lg w-64">
                    <p className="font-semibold mb-1">👣 큐레이션 안내</p>
                    <p className="leading-snug">
                      지도에서 클릭한 포인터 또는 경로를 선택한 뒤<br />
                      내용을 작성해 주세요.
                    </p>
                    <button
                      onClick={() => {
                        setShowGuide(false);
                        localStorage.setItem("curationGuideSeen", "true");
                      }}
                      className="absolute top-1 right-1 text-xs text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-blue-50" />
                  </div>
                </div>
              )} */}

          </div>

          {/* 경로 난이도 */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">경로 난이도</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              onChange={(e) => setSectionData({ ...sectionData, difficulty: e.target.value })}
              value={sectionData.difficulty || ""}
            >
              <option value="">선택하세요</option>
              <option value="easy">쉬움</option>
              <option value="moderate">보통</option>
              <option value="hard">어려움</option>
            </select>
          </div>

          {/* 위험 요소 */}
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">위험 요소</label>
            <input
              type="text"
              placeholder="예: 낙석, 미끄러운 경사"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={sectionData.caution || ""}
              onChange={(e) => setSectionData({ ...sectionData, caution: e.target.value })}
            />
          </div>
        </>
      )}


      {selectedMode === "pointer" && (
        <>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">작성할 포인터</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              onChange={(e) => {
                const selectedValue = e.target.value;
                setSelectedPointer(selectedValue);
            
                const matched = pointerOptions.find((p) => p.value === selectedValue);
                if (matched) {
                  setSegmentKey(matched.key); // key값 (1, 3, 5...)이 들어감!
                }
              }}
            
              value={selectedPointer}
            >
              {pointerOptions.map((pointer) => (
                <option key={pointer.key} value={pointer.value}>{pointer.value}</option>
              ))}
            </select>
          </div>

          
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">포인터명</label>
          <input
            type="text"
            value={postdata.pointerTo}
            onChange={(e) => setSectionData({ ...sectionData, pointerName: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </>

      )}


      <FacilitySelector
        key={facilityKey}
        selectedFacilities={selectedFacilities}
        setSelectedFacilities={setSelectedFacilities}
        // version={facilitiesVersion}
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