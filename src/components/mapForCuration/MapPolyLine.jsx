import React, { useEffect, useRef, useState } from 'react';

export default function MapWithSearch() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const searchMarkerRef = useRef(null);
  const markerListRef = useRef([]);
  const polylineListRef = useRef([]);
  const clickedCoordsRef = useRef([]); // 실시간 좌표 기록

  const [searchQuery, setSearchQuery] = useState("");
  const [clickedCoords, setClickedCoords] = useState([]); // UI에 보여줄 좌표 목록
  const colorList = ['#007bff', '#28a745', '#ffc107', '#e83e8c', '#17a2b8'];

  const kakaoKey = process.env.REACT_APP_KAKAO_MAP_KEY;

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

    // 지도 클릭 이벤트
    window.kakao.maps.event.addListener(map, "click", (mouseEvent) => {
      const latlng = mouseEvent.latLng;
      const lat = latlng.getLat();
      const lng = latlng.getLng();
      const coord = { lat, lng };

      // 화면 표시용
      setClickedCoords((prev) => [...prev, coord]);
      // 내부 추적용
      clickedCoordsRef.current.push(coord);

      // 마커 찍기
      const marker = new window.kakao.maps.Marker({
        map,
        position: latlng,
      });
      markerListRef.current.push(marker);

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
  };

  return (
    <div className="w-full h-screen flex flex-col items-center p-4">
      {/* 검색창 */}
      <div className="flex mb-2 w-full max-w-xl">
        <input
          type="text"
          placeholder="산 이름을 입력하세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-l-md"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
        >
          검색
        </button>
      </div>

      {/* 지도 */}
      <div ref={mapRef} className="w-full max-w-4xl h-[600px] rounded shadow-lg" />

      {/* 클릭 좌표 목록 */}
      <div className="mt-4 w-full max-w-4xl text-sm text-gray-700">
        <h2 className="font-bold mb-2">📍 클릭한 위치 좌표:</h2>
        <ul className="list-disc pl-5">
          {clickedCoords.map((coord, index) => (
            <li key={index}>
              {index + 1}. 위도: {coord.lat.toFixed(6)}, 경도: {coord.lng.toFixed(6)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
