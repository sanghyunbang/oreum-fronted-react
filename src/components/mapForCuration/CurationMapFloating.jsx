import { useEffect, useRef } from "react";

const categories = [
  { label: "음식점", keyword: "음식점" },
  { label: "카페", keyword: "카페" },
  { label: "지하철", keyword: "지하철역" },
  { label: "숙박", keyword: "호텔" },
  { label: "은행", keyword: "은행" },
  { label: "편의점", keyword: "편의점" },
];

export default function CurationMapFloating({ coordinates }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef([]);
  const infoWindowRef = useRef([]);
  const markerClusterRef = useRef(null);
  const kakaoKey = process.env.REACT_APP_KAKAO_MAP_KEY;

  useEffect(() => {
    if (!coordinates || coordinates.length === 0) return;
  
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false&libraries=services,clusterer`; // 수정
    script.async = true;
    script.onload = () => window.kakao.maps.load(initMap);
    document.head.appendChild(script);
  }, [coordinates]);
  

  const initMap = () => {
    const centerCoord = coordinates[Math.floor(coordinates.length / 2)];
    const center = new window.kakao.maps.LatLng(centerCoord[1], centerCoord[0]);

    const map = new window.kakao.maps.Map(mapRef.current, {
      center,
      level: 6,
    });
    mapInstanceRef.current = map;

    // 클러스터러 초기화
    markerClusterRef.current = new window.kakao.maps.MarkerClusterer({
      map,
      averageCenter: true,
      minLevel: 7,
    });

    // Polyline
    const path = coordinates.map(([lng, lat]) => new window.kakao.maps.LatLng(lat, lng));
    new window.kakao.maps.Polyline({
      map,
      path,
      strokeWeight: 4,
      strokeColor: "#28a745",
      strokeOpacity: 0.85,
      strokeStyle: "solid",
    });

    // 번호 오버레이
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

  const clearMarkers = () => {
    markerRef.current.forEach((m) => m.setMap(null));
    infoWindowRef.current.forEach((win) => win.setMap(null));
    markerClusterRef.current?.clear(); // 클러스터러 마커 제거
    markerRef.current = [];
    infoWindowRef.current = [];
  };

  const handleCategorySearch = (keyword) => {
    const map = mapInstanceRef.current;
    if (!map || !window.kakao.maps.services) return;

    const ps = new window.kakao.maps.services.Places();
    const center = map.getCenter();

    ps.keywordSearch(keyword, (results, status) => {
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

        const infowindow = new window.kakao.maps.InfoWindow({
          content,
          removable: true,
        });

        window.kakao.maps.event.addListener(marker, 'click', () => {
          infoWindowRef.current.forEach(win => win.close());
          infowindow.open(map, marker);
        });

        markerRef.current.push(marker);
        infoWindowRef.current.push(infowindow);

        return marker;
      });

      markerClusterRef.current.addMarkers(markers); // 클러스터링
    }, {
      location: center,
      radius: 1000,
    });
  };

  return (
    <div
      className="fixed top-24 right-10 w-[25%] h-[25%] z-50 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
      style={{ backdropFilter: 'blur(6px)', transition: 'all 0.3s ease-in-out' }}
    >
      <div className="w-full h-full relative">
        <div ref={mapRef} className="w-full h-full" />

        {/* 버튼 영역 */}
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
      </div>
    </div>
  );
}
