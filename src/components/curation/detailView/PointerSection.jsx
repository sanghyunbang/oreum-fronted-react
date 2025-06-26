import MediaDisplay from './MediaDisplay';

export default function PointerSection({ index, keyId, pointerName, section }) {
  if (!section) return null;

  return (
    <div key={keyId} className="relative flex items-start space-x-4 z-10">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white font-bold flex items-center justify-center shadow">
        {index + 1}
      </div>

      <div className="flex-1 border-l-4 border-green-400 pl-4">
        <h4 className="text-md font-bold text-green-700 mb-2">
          포인터 {keyId} {pointerName && `: ${pointerName}`}
        </h4>

        {section.description && (
          <div
            className="text-sm text-gray-800 mb-2"
            dangerouslySetInnerHTML={{ __html: section.description }}
          />
        )}

        {Array.isArray(section.media) && section.media.length > 0 && (
          <>
            <MediaDisplay media={section.media} />
            <p className="text-xs text-gray-500">첨부 파일: {section.media.length}개</p>
          </>
        )}
      </div>
    </div>
  );
}
