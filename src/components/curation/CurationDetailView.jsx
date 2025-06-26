export default function CurationDetailView({ segments }) {
  if (!segments || Object.entries(segments).length === 0) {
    return <p className="text-sm text-gray-500">작성된 큐레이션이 없습니다.</p>;
  }

  const entries = Object.entries(segments || {}).sort((a, b) => Number(a[0]) - Number(b[0]));
  const pointersCount = Math.ceil((entries.length + 1) / 2);
  const lastPointerKey = (2 * pointersCount - 1).toString();
  const lastPointer = segments[lastPointerKey];

  return (
    <div className="relative ml-5">
      <div className="absolute top-4 bottom-0 left-3 w-1 bg-green-400 z-0" />

      <div className="space-y-10">
        {[...Array(Math.max(0, pointersCount - 1))].map((_, idx) => {
          const [key, seg] = entries[idx];
          if (!seg) return null;

          const pointerName = segments[2 * Number(key) - 1]?.pointerName;
          const section = segments[2 * Number(key)];

          return (
            <div key={key} className="relative flex items-start space-x-4 z-10">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white font-bold flex items-center justify-center shadow">
                {idx + 1}
              </div>

              <div className="flex-1 border-l-4 border-green-400 pl-4">
                <h4 className="text-md font-bold text-green-700 mb-2">
                  포인터 {key} {pointerName && `: ${pointerName}`}
                </h4>

                {section?.description && (
                  <div
                    className="text-sm text-gray-800 mb-2"
                    dangerouslySetInnerHTML={{ __html: section.description }}
                  />
                )}

                {Array.isArray(section?.media) && section.media.length > 0 && (
                  <>
                    <div className="flex flex-wrap gap-3 mb-2">
                      {section.media.map((file, idx) => {
                        const type = file.type || file.file?.type || "";
                        const url = file.url || (file.file && URL.createObjectURL(file.file));
                        if (!url) return null;

                        return type.startsWith("image/") ? (
                          <img
                            key={idx}
                            src={url}
                            alt={`image-${idx}`}
                            className="w-36 h-24 object-cover rounded border border-gray-300"
                          />
                        ) : type === "video/mp4" ? (
                          <video
                            key={idx}
                            src={url}
                            controls
                            className="w-36 h-24 object-cover rounded border border-gray-300"
                          />
                        ) : null;
                      })}
                    </div>
                    <p className="text-xs text-gray-500">첨부 파일: {section.media.length}개</p>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* 마지막 도착지점 렌더링 */}
        <div className="relative flex items-start space-x-4 z-10">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white font-bold flex items-center justify-center shadow">
            {pointersCount}
          </div>

          <div className="flex-1 border-l-4 border-green-400 pl-4">
            <h4 className="text-md font-bold text-green-700 mb-2">
              도착지점 {lastPointer?.pointerName && `: ${lastPointer.pointerName}`}
            </h4>

            {lastPointer?.description && (
              <div
                className="text-sm text-gray-800 mb-2"
                dangerouslySetInnerHTML={{ __html: lastPointer.description }}
              />
            )}

            {Array.isArray(lastPointer?.media) && lastPointer.media.length > 0 && (
              <>
                <div className="flex flex-wrap gap-3 mb-2">
                  {lastPointer.media.map((file, idx) => {
                    const type = file.type || file.file?.type || "";
                    const url = file.url || (file.file && URL.createObjectURL(file.file));
                    if (!url) return null;

                    return type.startsWith("image/") ? (
                      <img
                        key={idx}
                        src={url}
                        alt={`image-${idx}`}
                        className="w-36 h-24 object-cover rounded border border-gray-300"
                      />
                    ) : type === "video/mp4" ? (
                      <video
                        key={idx}
                        src={url}
                        controls
                        className="w-36 h-24 object-cover rounded border border-gray-300"
                      />
                    ) : null;
                  })}
                </div>
                <p className="text-xs text-gray-500">첨부 파일: {lastPointer.media.length}개</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
