// 실제 상세 페이지에서도 재사용 하기 위해서 mode 추가[0625]

export default function CurationPreview({ segments, mode = "preview"}) {

  if (!segments || Object.entries(segments).length === 0) {
    return <p className="text-sm text-gray-500">작성한 구간이 없습니다.</p>;
  }
  
  const isPreview = mode === "preview"; // [0625] 추가: mode에 따라 preview 여부 판단

  // 키값을 숫자로 변환해놔야 -> 2*key해도 문자열로 갑자기 바뀌는 일이 안생김

  const entries = Object.entries(segments || {}).sort((a, b) => Number(a[0]) - Number(b[0]));

  // 1단계: entries의 길이를 통해서 pointer와 구간의 개수를 추출해 낼 수 있음 -> 
  // entries의 길이가 n이면 m개의 포인터와 m-1개의 구간이 합해져서 n이 생김 -> 즉, n=2m-1 이므로 -> m = n+1/2 하면됨
  
  const pointersCount = Math.ceil((entries.length + 1) / 2); // 항상 정수로

  // 마지막 도착지점 렌더링 추가
  const lastPointerKey = (2 * pointersCount - 1).toString();
  const lastPointer = segments[lastPointerKey];


  return (
    <div className="relative ml-5">
      <div className="absolute top-4 bottom-0 left-3 w-1 bg-green-400 z-0"></div>

      <div className="space-y-10">
        {[...Array(Math.max(0, pointersCount - 1))].map((_, idx) => {
          const [key, seg] = entries[idx];
          if (!seg) return null;

          return (
            <div key={key} className="relative flex items-start space-x-4 z-10">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white font-bold flex items-center justify-center shadow">
                {idx + 1}
              </div>



              <div className="flex-1 border-l-4 border-green-400 pl-4">
                <h4 className="text-md font-bold text-green-700 mb-1">포인터 {key}. {segments[2*Number(key)-1]?.pointerName}</h4>

                {segments[2 * key]?.description && (
                  <div
                    className={`text-sm text-gray-800 mb-2 ${
                      isPreview ? "overflow-hidden line-clamp-3" : ""
                    }`}
                    dangerouslySetInnerHTML={{ __html: `${segments[2 * Number(key)].description}` }}
                  />
                )}

                {segments[2 * Number(key)]?.media && Array.isArray(segments[2 * Number(key)].media) && segments[2 * Number(key)].media.length > 0 && (
                  <>
                    <div className="flex flex-wrap gap-3 mb-2">
                      {segments[2 * Number(key)].media.map((file, idx) => {
                        const type = file.type || file.file?.type || '';
                        const url = file.url || (file.file && URL.createObjectURL(file.file));
                        if (!url) return null;

                        return type.startsWith('image/') ? (
                          <img
                            key={idx}
                            src={url}
                            alt={`image-${idx}`}
                            className="w-36 h-24 object-cover rounded border border-gray-300"
                          />
                        ) : type === 'video/mp4' ? (
                          <video
                            key={idx}
                            src={url}
                            controls
                            className="w-36 h-24 object-cover rounded border border-gray-300"
                          />
                        ) : null;
                      })}
                    </div>
                    <p className="text-xs text-gray-500">첨부 파일: {segments[2 * Number(key)].media.length}개</p>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* 마지막 도착지점 */}
        <div className="relative flex items-start space-x-4 z-10">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white font-bold flex items-center justify-center shadow">
            {pointersCount}
          </div>
          <div className="flex-1 border-l-4 border-green-400 pl-4">
            <h4 className="text-md font-bold text-green-700 mb-1">
              도착지점 {lastPointer?.pointerName && `: ${lastPointer.pointerName}`}
            </h4>
                              
            {lastPointer?.description && 
              <div
                className={`text-sm text-gray-800 mb-2 ${
                  isPreview ? "overflow-hidden line-clamp-3" : ""
                }`}
                dangerouslySetInnerHTML={{ __html: `${lastPointer.description}` }}
              />
            }

            {Array.isArray(lastPointer?.media) && lastPointer.media.length > 0 && (
              <>
                <div className="flex flex-wrap gap-3 mb-2">
                  {lastPointer.media.map((file, idx) => {
                    const type = file.type || file.file?.type || '';
                    const url = file.url || (file.file && URL.createObjectURL(file.file));
                    if (!url) return null;

                    return type.startsWith('image/') ? (
                      <img
                        key={idx}
                        src={url}
                        alt={`image-${idx}`}
                        className="w-36 h-24 object-cover rounded border border-gray-300"
                      />
                    ) : type === 'video/mp4' ? (
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