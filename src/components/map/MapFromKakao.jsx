import React, { useEffect, useRef } from 'react';

export default function MapFromKakao({ trails, center, minDistance = 0 }) {
  const mapRef = useRef(null);
  const kakaoKey = process.env.REACT_APP_KAKAO_MAP_KEY;

  const getColorByCatNam = (catNam) => {
    const colors = { '하': '#33CC33', '중': '#FF9900', '상': '#CC0000' };
    return colors[catNam] || '#888888';
  };

  const parseAgGeom = (geometry) => {
    if (!geometry) return null;
    const coords = geometry.coordinates;
    if (geometry.type === 'LineString') return `LINESTRING(${coords.map(c => c.join(' ')).join(',')})`;
    if (geometry.type === 'MultiLineString') return `LINESTRING(${coords[0].map(c => c.join(' ')).join(',')})`;
    return null;
  };

const initializeProfileCustomOverlays = (map, centerCoord) => {
  // 중심 좌표 기준으로 랜덤 좌표 생성 (테스트용)
  const generateRandomLatLng = (center, radiusInMeters) => {
    const rd = radiusInMeters / 111300;
    const u = Math.random();
    const v = Math.random();
    const w = rd * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);
    return { lat: center.lat + y, lng: center.lng + x };
  };

  // 무작위 색상 생성 (프로필 마커 외곽선에 사용)
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    return '#' + Array.from({ length: 6 }, () => letters[Math.floor(Math.random() * 16)]).join('');
  };

  // 마커에 부드러운 떠오름 애니메이션을 부여하는 CSS 추가 (중복 삽입 방지)
  const addAnimationStyle = () => {
    if (document.getElementById('floating-style')) return;
    const style = document.createElement('style');
    style.id = 'floating-style';
    style.innerHTML = `
      @keyframes float {
        0% { transform: translate(-50%, -50%) translateY(0); }
        50% { transform: translate(-50%, -50%) translateY(-8px); }
        100% { transform: translate(-50%, -50%) translateY(0); }
      }
      .floating-marker {
        animation: float 3s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
  };

  addAnimationStyle();

  // 테스트용

  // for (let i = 0; i < 50; i++) {
  //   const coord = generateRandomLatLng({ lat: centerCoord[0], lng: centerCoord[1] }, 3000);
  //   const profileUrl = `https://picsum.photos/seed/${i}/60/60`;

  //   const content = document.createElement('div');
  //   content.className = 'floating-marker';
  //   content.style.cssText = `
  //     width: 54px;
  //     height: 54px;
  //     border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; /* 물방울 느낌 */
  //     overflow: hidden;
  //     border: 3px solid ${getRandomColor()};
  //     box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  //     background: #fff;
  //     transform: translate(-50%, -50%);
  //     position: absolute;
  //   `;

  //   const img = document.createElement('img');
  //   img.src = profileUrl;
  //   img.alt = 'img';
  //   img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
  //   content.appendChild(img);

  //   new window.kakao.maps.CustomOverlay({
  //     map,
  //     position: new window.kakao.maps.LatLng(coord.lat, coord.lng),
  //     content,
  //     yAnchor: 0.5,
  //     xAnchor: 0.5,
  //   });
  // }

  // 여기에서 테스트 용 말고 실제로 만든걸 어떻게 표출할지 
  // prop으로 검색에 의해서 center가 정해짐 -> 그 center을 기준으로 특정 delta내에 있는 프로필 표출 (프로필 위에 좋아요 숫자도 띄우기)
  // 해당 글 링크 걸어 놓기

  // 서버에서 프로필 리스트를 받아오는 함수
  const fetchProfiles = async (baseLat, baseLon) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/profilesForMap/getProfiles?baseLat=${baseLat}&baseLon=${baseLon}`, {
      method: "GET",
      credentials: "include"
    });

    if (!res.ok) throw new Error('프로필 가져오기 실패');

    return await res.json(); // 데이터: [{ lat, lon, nickname, profileUrl, postId }, ...]
  };

  // 받아온 프로필들을 지도 위에 마커로 표시
  const displayProfiles = async () => {
    try {
      const data = await fetchProfiles(centerCoord[0], centerCoord[1]);

      data.forEach((profile) => {
        const { lat, lon, profileUrl, nickname, postId } = profile;

        const container = document.createElement('div');
        container.className = 'floating-marker';
        container.style.cssText = `
          width: 54px;
          height: 54px;
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          overflow: hidden;
          border: 3px solid ${getRandomColor()};
          background: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transform: translate(-50%, -50%);
          position: absolute;
        `;

        const img = document.createElement('img');
        img.src = profileUrl || 'https://via.placeholder.com/60'; 
        img.alt = nickname;
        img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
        container.appendChild(img);

        container.onclick = () => {
          window.location.href = `/post/${postId}`; // 프로필 클릭 시 해당 글로 이동
        };

        new window.kakao.maps.CustomOverlay({
          map,
          position: new window.kakao.maps.LatLng(lat, lon),
          content: container,
          yAnchor: 0.5,
          xAnchor: 0.5,
        });
      });

    } catch (error) {
      console.error("프로필 마커 표시 실패:", error);
    }
  };

  displayProfiles(); // 실행
};


  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false&libraries=services`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(center[0], center[1]),
          level: 7,
        });

        initializeProfileCustomOverlays(map, center);

        const sharedInfoWindow = new window.kakao.maps.InfoWindow();

        trails.forEach((trail, idx) => {
          const geom = trail.ag_geom || parseAgGeom(trail.geometry);
          if (!geom) return;

          let coords;
          try {
            coords = geom
              .replace('LINESTRING(', '')
              .replace(')', '')
              .split(',')
              .map((pt) => {
                const [x, y] = pt.trim().split(/\s+/).map(Number);
                return new window.kakao.maps.LatLng(y, x);
              });
            console.log(`trail[${idx}] 좌표 수: ${coords.length}`, coords);
          } catch (e) {
            console.error(`좌표 파싱 실패:`, e);
            return;
          }

          if (coords.length < 2) {
            console.warn(`[!] trail[${idx}] 좌표가 너무 적음`);
            return;
          }

          const polyline = new window.kakao.maps.Polyline({
            path: coords,
            strokeWeight: 4,
            strokeColor: getColorByCatNam(trail.cat_nam),
            strokeOpacity: 0.9,
            strokeStyle: 'solid',
          });

          const length = Math.round(polyline.getLength());
          if (length < minDistance) return;

          polyline.setMap(map);

          new window.kakao.maps.Marker({
            position: coords[0],
            map,
            title: `${trail.mntn_nm || '등산로'} 시작점`,
          });

          const mid = coords[Math.floor(coords.length / 2)];
          const content = `
            <div style="padding:6px; font-size:13px; line-height:1.5">
              <b>🏞 ${trail.mntn_nm || `등산로 ${idx + 1}`}</b><br/>
              📏 거리: ${length}m<br/>
              🔼 상행: ${trail.up_min || '-'}분<br/>
              🔽 하행: ${trail.down_min || '-'}분<br/>
              💪 난이도: ${trail.cat_nam || '정보 없음'}
            </div>`;

          window.kakao.maps.event.addListener(polyline, 'click', () => {
            sharedInfoWindow.setContent(content);
            sharedInfoWindow.setPosition(mid);
            sharedInfoWindow.open(map);
            map.setCenter(mid);
          });

          const tooltip = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:3px; font-size:12px;">${trail.mntn_nm || `등산로 ${idx + 1}`}</div>`,
          });

          window.kakao.maps.event.addListener(polyline, 'mouseover', () => {
            tooltip.setPosition(mid);
            tooltip.open(map);
          });
          window.kakao.maps.event.addListener(polyline, 'mouseout', () => {
            tooltip.close();
          });
        });
      });
    };

    return () => {
      const existing = document.querySelector('script[src*="kakao.com/v2/maps/sdk.js"]');
      if (existing) existing.remove();
    };
  }, [trails, kakaoKey, center, minDistance]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}