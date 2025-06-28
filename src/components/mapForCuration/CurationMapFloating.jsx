import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";

// 카테고리 버튼 목록
const categories = [
  { label: "음식점", keyword: "음식점" },
  { label: "카페", keyword: "카페" },
  { label: "지하철", keyword: "지하철역" },
  { label: "숙박", keyword: "호텔" },
  { label: "은행", keyword: "은행" },
  { label: "편의점", keyword: "편의점" },
];

export default function CurationMapFloating({ coordinates }) {
  const mapRef = useRef(null); // 지도 컨테이너 참조
  const mapInstanceRef = useRef(null); // kakao map 객체 참조
  const markerRef = useRef([]); // 생성된 마커들
  const infoWindowRef = useRef([]); // 생성된 정보창들
  const markerClusterRef = useRef(null); // 클러스터러 객체

  const kakaoKey = process.env.REACT_APP_KAKAO_MAP_KEY;
  const [isCollapsed, setIsCollapsed] = useState(false); // 지도 접힘 여부

  // 마커 및 정보창 초기화
  const clearMarkers = () => {
    markerRef.current.forEach((m) => m.setMap(null));
    infoWindowRef.current.forEach((win) => win.setMap(null));
    markerClusterRef.current?.clear();
    markerRef.current = [];
    infoWindowRef.current = [];
  };

  // 카테고리 검색 실행
  const handleCategorySearch = (keyword) => {
    const map = mapInstanceRef.current;
    if (!map || !window.kakao.maps.services) return;

    const ps = new window.kakao.maps.services.Places();
    const center = map.getCenter();
    const level = map.getLevel();

    // 줌 레벨에 따라 반경 설정
    let radius;
    if (level <= 4) radius = 300;
    else if (level <= 6) radius = 700;
    else if (level <= 8) radius = 1200;
    else radius = 2000;

    ps.keywordSearch(
      keyword,
      (results, status) => {
        if (status !== window.kakao.maps.services.Status.OK) return;

        clearMarkers();

        const markers = results.map((place) => {
          const position = new window.kakao.maps.LatLng(place.y, place.x);
          const marker = new window.kakao.maps.Marker({ position });

          const content = `
            <div style="padding:5px;font-size:14px;">
              <strong>${place.place_name}</strong><br/>
              <a href="${place.place_url}" target="_blank" style="color:blue;">카카오맵에서 보기</a>
            </div>
          `;

          const infowindow = new window.kakao.maps.InfoWindow({ content, removable: true });

          // 클릭 시 정보창 열기
          window.kakao.maps.event.addListener(marker, "click", () => {
            infoWindowRef.current.forEach((win) => win.close());
            infowindow.open(map, marker);
          });

          markerRef.current.push(marker);
          infoWindowRef.current.push(infowindow);

          return marker;
        });

        markerClusterRef.current.addMarkers(markers);
      },
      {
        location: center,
        radius,
      }
    );
  };

  // 지도 초기화
  const initializeMap = () => {
    const centerCoord = coordinates[Math.floor(coordinates.length / 2)];
    const center = new window.kakao.maps.LatLng(centerCoord[1], centerCoord[0]);

    const map = new window.kakao.maps.Map(mapRef.current, {
      center,
      level: 6,
    });

    mapInstanceRef.current = map;

    markerClusterRef.current = new window.kakao.maps.MarkerClusterer({
      map,
      averageCenter: true,
      minLevel: 7,
    });

    // 경로 표시
    const path = coordinates.map(
      ([lng, lat]) => new window.kakao.maps.LatLng(lat, lng)
    );

    new window.kakao.maps.Polyline({
      map,
      path,
      strokeWeight: 4,
      strokeColor: "#28a745",
      strokeOpacity: 0.85,
      strokeStyle: "solid",
    });

    // 각 위치마다 숫자 오버레이 표시
    coordinates.forEach(([lng, lat], index) => {
      const position = new window.kakao.maps.LatLng(lat, lng);
      const overlayContent = `
        <div style="
          width: 30px;
          height: 30px;
          background: #ff7b37;
          border-radius: 50%;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          transform: translate(-50%, -50%);
        ">
          ${index + 1}
        </div>
      `;
      new window.kakao.maps.CustomOverlay({
        map,
        position,
        content: overlayContent,
        yAnchor: 0.5,
        xAnchor: 0.5,
      });
    });
  };

  // Kakao Maps SDK 로딩 및 초기화
  useEffect(() => {
    if (!coordinates || coordinates.length === 0) return;

    const scriptAlreadyLoaded = document.querySelector('script[src*="kakao.com"]');

    if (window.kakao && window.kakao.maps && window.kakao.maps.Map) {
      window.kakao.maps.load(() => initializeMap());
    } else if (!scriptAlreadyLoaded) {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false&libraries=services,clusterer`;
      script.async = true;
      script.onload = () => {
        window.kakao.maps.load(() => initializeMap());
      };
      document.head.appendChild(script);
    } else {
      const waitForLoad = setInterval(() => {
        if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
          clearInterval(waitForLoad);
          window.kakao.maps.load(() => initializeMap());
        }
      }, 100);
    }
  }, [coordinates]);

  // 접기 상태가 풀릴 때 지도 리사이징
  useEffect(() => {
    if (!isCollapsed) {
      setTimeout(() => {
        mapInstanceRef.current?.relayout();
      }, 300); // transition 끝난 후 relayout 호출
    }
  }, [isCollapsed]);

  return (
    <Draggable handle=".drag-handle">
      <div
        className={`fixed top-[150px] right-8 w-[28%] z-50 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200
        transition-all duration-300
        ${isCollapsed ? "h-12" : "h-[35%]"}`}
        style={{ backdropFilter: "blur(6px)" }}
      >
        <div className="w-full h-full relative">
          {/* 드래그 가능한 상단 바 */}
          <div className="drag-handle cursor-move absolute top-0 left-0 right-0 h-6 bg-green-300 text-xs text-gray-700 text-center leading-6 font-semibold z-40 border-b border-gray-300">
            경로
          </div>

          {/* 지도 접기/펼치기 토글 버튼 */}
          <div className="absolute top-1 right-2 z-50">
            <button
              onClick={() => setIsCollapsed(prev => !prev)}
              className="text-[11px] px-3 py-[3px]  text-gray-600 hover:bg-gray-200 transition rounded-full shadow-sm"
              >
              {isCollapsed ? "펼치기" : "접기"}
            </button>
          </div>

          {/* 지도 컨테이너 */}
          <div ref={mapRef} className="w-full h-full pt-6" />

          {/* 카테고리 검색 버튼들 (접혔을 땐 숨김) */}
          {!isCollapsed && (
            <div className="absolute bottom-2 left-1 right-1 flex flex-wrap justify-center gap-2 bg-white/80 p-2 rounded-xl shadow-md z-30">
              {categories.map(({ label, keyword }) => (
                <button
                  key={label}
                  onClick={() => handleCategorySearch(keyword)}
                  className="text-xs px-3 py-1 bg-white hover:bg-gray-100 border rounded-full shadow-sm"
                >
                  {label}
                </button>
              ))}
              <button
                onClick={clearMarkers}
                className="text-xs px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 border rounded-full shadow-sm"
              >
                초기화
              </button>
            </div>
          )}
        </div>
      </div>
    </Draggable>
  );
}
