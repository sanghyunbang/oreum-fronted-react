import { useEffect, useRef } from 'react';

export default function({trails = []}) {
    const mapRef = useRef(null);
    const kakaoKey = process.env.REACT_APP_KAKAO_MAP_KEY;

    useEffect(() => {
        const script = document.createElement('script') // script가 뭐지? createElement는 추가로 만드는거
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false&libraries=services`;
        script.async = true;
        document.head.appendChild(script); // DOM에 직접 붙이기

        script.onload = () => {
            window.kakao.maps.load(()=>{
                const map = new window.kakao.maps.Map(mapRef.current, {
                    center: new window.kakao.maps.LatLng(37.5665, 126.9780),
                    level: 7,
                });

                trails.forEach((trail, idx) => {
                    if (!trail.ag_geom) {
                        console.warn(`trail[${idx}]에 ag_geom 없음`);
                        return;
                    }

                    console.log(` trail[${idx}] geometry:`, trail.ag_geom);

                    // 좌표를 선택하는데 전처리??
                    const coords = trail.ag_geom
                        .replace('LINESTRING(','')
                        .replace(')','')
                        .split(',')
                        .map((pt) => {
                            const [x, y] = pt.trim().split(/\s+/).map(Number);
                            return new window.kakao.maps.LatLng(y, x);
                        });

                    if (coords.length <2) {
                        console.warn(`trail[${idx}] 좌표 부족`, coords);
                        return;
                    }

                    const polyline = new window.kakao.map.polyline({
                        path: coords,
                        strokeWeight: 4,
                        strokeColor: `#FF5500`,
                        strokeOpacity: 0.8,
                        strokeStyle: 'solid'
                    });

                    polyline.setMap(map);
                    console.log(`trail[${idx}] 등산로 표시됨`);
                });
            
            });
        };
    }, [trails, kakaoKey]);

    return <div ref={mapRef} style={{width: '100%', height: '500px'}} />;

};