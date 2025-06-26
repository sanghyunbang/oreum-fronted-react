import MediaDisplay from './MediaDisplay';

export default function FinalPointer({ pointer, pointerIndex }) {
  if (!pointer) return null;

  return (
    <div className="relative pl-10 pb-12">
      {/* 세로줄은 끝나는 지점이므로 조금만 보이게 */}
      {/* <div className="absolute top-5 left-5 h-10 w-0.5 bg-gradient-to-b from-green-300 to-blue-300" /> */}

      {/* 도착지점 동그라미 -> 위 포인터들이랑 양식 통일 */}
      <div className="absolute left-2 top-0 z-10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-lg flex items-center justify-center text-white font-bold text-lg border-2 border-white">
          {pointerIndex}
        </div>
      </div>

      {/* 본문 카드 */}
      <div className="ml-6 bg-white rounded-xl shadow-md p-4 border border-gray-200 z-10 relative">
        <h4 className="text-lg font-semibold text-green-800 mb-2">
          🚩 도착지점 {pointer.pointerName && `: ${pointer.pointerName}`}
        </h4>

        {pointer.description && (
          <div
            className="text-sm text-gray-700 leading-relaxed mb-3"
            dangerouslySetInnerHTML={{ __html: pointer.description }}
          />
        )}

        {Array.isArray(pointer.media) && pointer.media.length > 0 && (
          <MediaDisplay media={pointer.media} />
        )}
      </div>
    </div>
  );
}
