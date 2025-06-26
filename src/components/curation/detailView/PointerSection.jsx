import MediaDisplay from './MediaDisplay';

export default function PointerSection({ index, keyId, pointerName, section }) {
  if (!section) return null;

  return (
    <div className="relative pl-10 pb-12">
      {/* 각 섹션마다 줄 추가 */}
      {/* <div className="absolute top-5 left-5 bottom-0 w-0.5 bg-gradient-to-b from-green-300 to-blue-300" /> */}

      {/* 포인터 동그라미 */}
      <div className="absolute left-2 top-0 z-10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 shadow-lg flex items-center justify-center text-white font-bold text-lg border-2 border-white">
          {index + 1}
        </div>
      </div>

      {/* 본문 */}
      <div className="ml-6 bg-white rounded-xl shadow-md p-4 border border-gray-200 z-10 relative">
        {pointerName && (
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            📍 {pointerName}
          </h4>
        )}

        {section.description && (
          <div
            className="text-sm text-gray-700 leading-relaxed mb-3"
            dangerouslySetInnerHTML={{ __html: section.description }}
          />
        )}

        {Array.isArray(section.media) && section.media.length > 0 && (
          <MediaDisplay media={section.media} />
        )}
      </div>
    </div>
  );
}
