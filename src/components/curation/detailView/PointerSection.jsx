import MediaDisplay from './MediaDisplay';
import { facilityMap } from '../../Icons/FacilitySelector';

export default function PointerSection({ index, pointerName, section, pointer }) {
  console.log("📍 PointerSection facility:", pointer?.facility);

  if (!section) return null;

  return (
    <div className="relative pl-10 pb-12">
      {/* 각 섹션마다 줄 추가 (생략 가능) */}
      {/* <div className="absolute top-5 left-5 bottom-0 w-0.5 bg-gradient-to-b from-green-300 to-blue-300" /> */}

      {/* 포인터 순번 동그라미 */}
      <div className="absolute left-2 top-0 z-10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 shadow-lg flex items-center justify-center text-white font-bold text-lg border-2 border-white">
          {index + 1}
        </div>
      </div>

      {/* 본문 카드 */}
      <div className="ml-6 bg-white rounded-xl shadow-md p-4 border border-gray-200 z-10 relative">

        {/* 포인터 이름 */}
        {pointerName && (
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            📍 {pointerName}
          </h4>
        )}

        {/* 주요 시설 출력: pointer.facility */}
        {Array.isArray(pointer?.facility) && pointer.facility.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {pointer.facility.map((value, i) => {
              const facility = facilityMap[value]; // 아이콘/라벨 정보 가져오기
              if (!facility) {
                console.warn(`알 수 없는 facility 값: ${value}`);
                return null;
              }

              const { label, icon: Icon } = facility;

              return (
                <div
                  key={value + i}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm"
                >
                  {/* SVG 아이콘이 함수 컴포넌트 형태일 경우 이렇게 사용 */}
                  {typeof Icon === 'function' ? <Icon className="w-4 h-4" /> : Icon}
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* 설명 */}
        {section.description && (
          <div
            className="text-sm text-gray-700 leading-relaxed mb-3"
            dangerouslySetInnerHTML={{ __html: section.description }}
          />
        )}

        {/* 미디어 이미지/영상 */}
        {Array.isArray(section.media) && section.media.length > 0 && (
          <MediaDisplay media={section.media} />
        )}
      </div>
    </div>
  );
}
