import React, { useEffect, useRef, useState } from 'react';
import { IoHandLeftSharp } from 'react-icons/io5';

export default function MapPolyLine({ setMarkerCounts, setPointers}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const searchMarkerRef = useRef(null);

  const overlayListRef = useRef([]); // 마커 위에 숫자
  const markerListRef = useRef([]);
  const polylineListRef = useRef([]);
  
  
  const clickedCoordsRef = useRef([]); // 실시간 좌표 기록

  const [searchQuery, setSearchQuery] = useState("");
  const [clickedCoords, setClickedCoords] = useState([]); // UI에 보여줄 좌표 목록
  const colorList = ['#007bff', '#28a745', '#ffc107', '#e83e8c', '#17a2b8'];

  const kakaoKey = process.env.REACT_APP_KAKAO_MAP_KEY;

  // 사용자에게 안내 포커스 띄우는 셋팅 [안내 0]
  const inputRef = useRef(null);
  const [showGuide, setShowGuide] = useState(true);

  // 검색 창에 포커스 가게
  useEffect(()=>{
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [])
  
  const [readyForMapGuide, setReadyForMapGuide] = useState(false); // '확인' 누른 후 상태 
  const [showMapGuide, setShowMapGuide] = useState(false); // 경로 안내창


  // 1. 지도 로딩
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => window.kakao.maps.load(initializeMap);
    document.head.appendChild(script);
  }, []);

  // 2. 지도 초기화
  const initializeMap = () => {
    const container = mapRef.current;
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울
      level: 5,
    };

    const map = new window.kakao.maps.Map(container, options);
    mapInstanceRef.current = map;

    // 검색용 마커
    const searchMarker = new window.kakao.maps.Marker({ map });
    searchMarkerRef.current = searchMarker;


    // 지도 클릭 이벤트 --> 위의 조건을 만족해야 가능
    window.kakao.maps.event.addListener(map, "click", (mouseEvent) => {


      const latlng = mouseEvent.latLng;
      const lat = latlng.getLat();
      const lng = latlng.getLng();
      const coord = { lat, lng };

      // 커스텀 오버레이 생성: N번째 포인터 표시
      const markerIndex = markerListRef.current.length;
      const overlayContent = `
        <div style="
          background: rgba(255, 123, 55, 0.9);  /* 반투명 파란색 */
          color: white;
          font-weight: bold;
          padding: 4px 8px;
          font-size: 12px;
          border-radius: 999px;  /* 완전 둥근 원 */
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          white-space: nowrap;
          border: 2px solid white;
          transform: translate(-50%, -120%);  /* 마커 중심에서 위쪽으로 위치 보정 */
          position: relative;
          display: inline-block;
        ">
          ${markerIndex+1}
        </div>`;

      const customOverlay = new window.kakao.maps.CustomOverlay({
        map: map,
        position: latlng,
        content: overlayContent,
        yAnchor: 1,
        zIndex: 50
      });
      overlayListRef.current.push(customOverlay); // 이 줄 추가


      // 화면 표시용
      setClickedCoords((prev) => [...prev, coord]);

      // 상위 컴포넌트로 값 넘겨주기(CurationWritePage로) 
      // ------> 사이드 바에서 허락을 해줘야 이게 실행(즉, 그전에 폴리라인 찍히는 여부 부터 컨트롤해야 함.)
      // onRoutesResult((prev) => [...prev, coord]);


      // 내부 추적용
      clickedCoordsRef.current.push(coord);

      // 마커 찍기
      const marker = new window.kakao.maps.Marker({
        map,
        position: latlng,
      });
      markerListRef.current.push(marker);

      // 마커 수 반영
      setMarkerCounts(markerListRef.current.length);

      // 여기에서 geoJson 업데이트 하기
      setPointers(2*markerListRef.current.length-1, [lat, lng]);
      

 
      // 폴리라인 그리기
      const len = clickedCoordsRef.current.length;
      if (len > 1) {
        const prev = clickedCoordsRef.current[len - 2];
        const polyline = new window.kakao.maps.Polyline({
          map,
          path: [
            new window.kakao.maps.LatLng(prev.lat, prev.lng),
            new window.kakao.maps.LatLng(lat, lng),
          ],
          strokeWeight: 4,
          strokeColor: colorList[(polylineListRef.current.length) % colorList.length],
          strokeOpacity: 0.8,
          strokeStyle: "solid",
        });
        polylineListRef.current.push(polyline);
        // setPolylineReady(false);
      }

    });
  };

  // 3. 장소 검색
  const handleSearch = () => {
    if (!searchQuery.trim() || !mapInstanceRef.current) return;

    const places = new window.kakao.maps.services.Places();
    places.keywordSearch(searchQuery, (results, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const first = results[0];
        const lat = parseFloat(first.y);
        const lng = parseFloat(first.x);
        const moveLatLng = new window.kakao.maps.LatLng(lat, lng);

        mapInstanceRef.current.setCenter(moveLatLng);
        searchMarkerRef.current.setPosition(moveLatLng);
      } else {
        alert("검색 결과가 없습니다.");
      }
    });

    // 확인을 눌렀던 경우에만 showMapGuide 실행
    if (readyForMapGuide) {
      setShowMapGuide(true);
      setReadyForMapGuide(false); // 다시 초기화
    };
  };


  // 마커 되돌리기

  const handleUndo = () => {
    // 1. 마커 삭제
    const lastMarker = markerListRef.current.pop();
    if (lastMarker) lastMarker.setMap(null);

    const lastOverlay = overlayListRef.current.pop();
    if (lastOverlay) lastOverlay.setMap(null);

    // 2. 폴리라인 삭제 (마커가 2개 이상일 때만)
    if (clickedCoordsRef.current.length > 1) {
      const lastPolyline = polylineListRef.current.pop();
      if (lastPolyline) lastPolyline.setMap(null);
    }

    // 3. 좌표 상태 업데이트
    clickedCoordsRef.current.pop(); // ref 내부 좌표 제거
    setClickedCoords([...clickedCoordsRef.current]); // 상태 반영

    // 4. 상위 컴포넌트에도 반영 --> 자동으로 삭제 (상위 컴포넌트에서?)
    // onRoutesResult((prev) => prev.slice(0, -1));

    // 마커 수 반영
    setMarkerCounts(markerListRef.current.length);
  };


  return (
    <div className="w-full flex flex-col items-center p-4">

      <div className="relative w-full flex flex-col items-center p-4">

        {/* 안내 문구: 우측 상단 고정 */}
        {showGuide && (
          <div className="absolute top-4 right-4 z-50 w-[380px] bg-white/80 border border-gray-300 text-gray-800 px-5 py-4 rounded-lg shadow-xl backdrop-blur-md">
            <div className="flex justify-between items-start">
              <div className="pr-4">
                <p className="font-semibold mb-1">💡 안내</p>
                <p>큐레이팅하고 싶은 산을 검색해 주세요!</p>
              </div>
              <button
                  onClick={() => {
                    setShowGuide(false);
                    setReadyForMapGuide(true); // 검색하면 오버레이 뜨도록 설정
                  }}
                className="min-w-[60px] px-4 py-1 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded transition"
              >
                확인
              </button>
            </div>
          </div>
        )}

        {/* 검색창 */}
        <div className="flex mb-2 w-full max-w-xl z-10 relative">
          <input
            type="text"
            ref={inputRef}
            placeholder="산 이름을 입력하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
          >
            검색
          </button>
        </div>
      </div>



      {/* 지도 */}
      <div ref={mapRef} className="w-full max-w-4xl h-[600px] rounded shadow-lg" />

      {/* 클릭 좌표 목록 */}
      <div className="mt-4 w-full max-w-4xl text-sm text-gray-700">
        <div className="flex justify-end items-center mb-2">
          <button onClick={handleUndo} className="text-sm px-3 py-1 bg-red-100 hover:bg-red-200 rounded">
            🔙 되돌리기
          </button>
        </div>
        <h2 className="font-bold mb-2">📍 클릭한 위치 좌표:</h2>
        <ul className="list-disc pl-5">
          {clickedCoords.map((coord, index) => (
            <li key={index}>
              {index + 1}. 위도: {coord.lat.toFixed(6)}, 경도: {coord.lng.toFixed(6)}
            </li>
          ))}
        </ul>
      </div>



      {/* 경로 안내 오버레이 */}
      {showMapGuide && (
        <>
          {/* 전체 어둡게 */}
          <div className="fixed inset-0 bg-black/40 z-40 pointer-events-none"></div>

          {/* 안내 메시지 */}
          <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-4 rounded-lg shadow-xl text-center text-gray-800 w-[360px]">
            <p className="font-bold text-lg mb-2">🗺️ 경로 입력 안내</p>
            <p>내가 등산한 경로의 주요 포인터를 순서대로 클릭해 주세요!</p>
            <button
              onClick={() => setShowMapGuide(false)}
              className="mt-4 px-4 py-1 text-sm text-white bg-green-500 hover:bg-green-600 rounded"
            >
              시작하기
            </button>
          </div>
        </>
      )}

    </div>

    
  );
}
