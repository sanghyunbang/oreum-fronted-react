import React, { useEffect, useRef } from 'react';

export default function MapFromKakao({ trails , center, minDistance = 0 }) {
  const mapRef = useRef(null);
  const kakaoKey = process.env.REACT_APP_KAKAO_MAP_KEY;

  const getColorByCatNam = (catNam) => {
    switch (catNam) {
      case '하': return '#33CC33';
      case '중': return '#FF9900';
      case '상': return '#CC0000';
      default: return '#888888';
    }
  };

  const parseAgGeom = (geometry) => {
    if (!geometry) return null;
    if (geometry.type === 'LineString') {
      return `LINESTRING(${geometry.coordinates.map((c) => c.join(' ')).join(',')})`;
    }
    if (geometry.type === 'MultiLineString') {
      const firstLine = geometry.coordinates[0];
      return `LINESTRING(${firstLine.map((c) => c.join(' ')).join(',')})`;
    }
    return null;
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false&libraries=services`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      console.log('Kakao Map SDK 로딩 완료');
      window.kakao.maps.load(() => {
        console.log('Kakao Maps API 로딩 완료');
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(center[0], center[1]),
          level: 7,
        });

        const sharedInfoWindow = new window.kakao.maps.InfoWindow();

        trails.forEach((trail, idx) => {
          console.log(`trail[${idx}] 정보`, trail);
          const geom = trail.ag_geom || parseAgGeom(trail.geometry);
          if (!geom) {
            console.warn(`[X] trail[${idx}] ag_geom 없음`);
            return;
          }

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
          console.log(`[V] trail[${idx}] 선 그리기 완료`)

          // 시작마커 -> 이게 어디 쓰이지?
          const startMarker = new window.kakao.maps.Marker({
            position: coords[0],
            map,
            title: `${trail.mntn_nm || '등산로'} 시작점`,
          });

          //info WINDOW

          const mid = coords[Math.floor(coords.length / 2)];
          const content = `
            <div style="padding:5px; font-size:13px;">
              🏔️ <b>${trail.mntn_nm || `등산로 ${idx + 1}`}</b><br/>
              📏 거리: ${length}m<br/>
              🔼 상행: ${trail.up_min || '-'}분<br/>
              🔽 하행: ${trail.down_min || '-'}분<br/>
              💪 난이도: ${trail.cat_nam || '정보 없음'}
            </div>
          `;

          // Click → InfoWindow
          window.kakao.maps.event.addListener(polyline, 'click', () => {
            console.log(`trail[${idx}] 클릭됨`);
            sharedInfoWindow.setContent(content);
            sharedInfoWindow.setPosition(mid);
            sharedInfoWindow.open(map);
            map.setCenter(mid);
          });

          // Hover Tooltip
          const tooltip = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:2px; font-size:12px;">${trail.mntn_nm || `등산로 ${idx + 1}`}</div>`,
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
