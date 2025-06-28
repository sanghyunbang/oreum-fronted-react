import MediaDisplay from './MediaDisplay';
import { facilityMap } from '../../Icons/FacilitySelector'; // 아이콘 정보 불러오기

export default function FinalPointer({ pointer, pointerIndex }) {
  if (!pointer) return null;

  return (
    <div className="relative pl-10 pb-12">
      {/* 도착지점 세로줄 (선택 사항) */}
      {/* <div className="absolute top-5 left-5 h-10 w-0.5 bg-gradient-to-b from-green-300 to-blue-300" /> */}

      {/* 도착지점 동그라미 */}
      <div className="absolute left-2 top-0 z-10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-lg flex items-center justify-center text-white font-bold text-lg border-2 border-white">
          {pointerIndex}
        </div>
      </div>

      {/* 본문 카드 */}
      <div className="ml-6 bg-white rounded-xl shadow-md p-4 border border-gray-200 z-10 relative">
        {/* 포인터 이름 */}
        <h4 className="text-lg font-semibold text-green-800 mb-2">
          🚩 도착지점 {pointer.pointerName && `: ${pointer.pointerName}`}
        </h4>

        {/* 시설 아이콘들 */}
        {Array.isArray(pointer.facility) && pointer.facility.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {pointer.facility.map((value, i) => {
              const facility = facilityMap[value];
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
                  {/* SVG 아이콘 형태에 따라 다르게 처리 */}
                  {typeof Icon === 'function' ? <Icon className="w-4 h-4" /> : Icon}
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* 설명 */}
        {pointer.description && (
          <div
            className="text-sm text-gray-700 leading-relaxed mb-3"
            dangerouslySetInnerHTML={{ __html: pointer.description }}
          />
        )}

        {/* 첨부 이미지/비디오 */}
        {Array.isArray(pointer.media) && pointer.media.length > 0 && (
          <MediaDisplay media={pointer.media} />
        )}
      </div>
    </div>
  );
}
