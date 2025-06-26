import MediaDisplay from './MediaDisplay';

export default function FinalPointer({ pointer, pointerIndex }) {
  if (!pointer) return null;

  return (
    <div className="relative flex items-start space-x-4 z-10">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white font-bold flex items-center justify-center shadow">
        {pointerIndex}
      </div>

      <div className="flex-1 border-l-4 border-green-400 pl-4">
        <h4 className="text-md font-bold text-green-700 mb-2">
          도착지점 {pointer.pointerName && `: ${pointer.pointerName}`}
        </h4>

        {pointer.description && (
          <div
            className="text-sm text-gray-800 mb-2"
            dangerouslySetInnerHTML={{ __html: pointer.description }}
          />
        )}

        {Array.isArray(pointer.media) && pointer.media.length > 0 && (
          <>
            <MediaDisplay media={pointer.media} />
            <p className="text-xs text-gray-500">첨부 파일: {pointer.media.length}개</p>
          </>
        )}
      </div>
    </div>
  );
}
