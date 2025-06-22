import React from 'react';

export default function CurationPreview({ segments }) {
  if (!segments || Object.entries(segments).length === 0) {
    return <p className="text-sm text-gray-500">작성한 구간이 없습니다.</p>;
  }

  const entries = Object.entries(segments);

  return (
    <div className="relative ml-5">
      {/* 세로 타임라인 선 */}
      <div className="absolute top-4 bottom-0 left-3 w-1 bg-green-400 z-0"></div>

      <div className="space-y-10">
        {entries.map(([key, seg], idx) => (
          <div key={key} className="relative flex items-start space-x-4 z-10">
            {/* 숫자 동그라미 */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white font-bold flex items-center justify-center shadow">
              {idx + 1}
            </div>

            {/* 구간 내용 */}
            <div className="flex-1 border-l-4 border-green-400 pl-4">
              <h4 className="text-md font-bold text-green-700 mb-1">🚩 구간 {key}</h4>

              {seg.route?.name && (
                <p className="text-sm text-gray-700 mb-1">📍 {seg.route.name}</p>
              )}

              <div
                className="text-sm text-gray-800 mb-2"
                dangerouslySetInnerHTML={{
                  __html:
                    (seg.content?.slice(0, 150) || '') +
                    (seg.content?.length > 150 ? '...' : ''),
                }}
              />

              {seg.media?.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-2">
                  {seg.media.map((file, idx) => {
                    const type = file.type || file.file?.type || '';
                    const url = file.url || (file.file && URL.createObjectURL(file.file));

                    if (type.startsWith('image/')) {
                      return (
                        <img
                          key={idx}
                          src={url}
                          alt={`image-${idx}`}
                          className="w-36 h-24 object-cover rounded border border-gray-300"
                        />
                      );
                    } else if (type === 'video/mp4') {
                      return (
                        <video
                          key={idx}
                          src={url}
                          controls
                          className="w-36 h-24 object-cover rounded border border-gray-300"
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              )}

              {seg.media?.length > 0 && (
                <p className="text-xs text-gray-500">첨부 파일: {seg.media.length}개</p>
              )}
            </div>
          </div>
        ))}

        {/* 마지막 도착지점 */}
        <div className="relative flex items-start space-x-4 z-10">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white font-bold flex items-center justify-center shadow">
            {entries.length + 1}
          </div>
          <div className="flex-1 border-l-4 border-green-400 pl-4 text-sm text-green-600 font-semibold mt-1">
            도착지점
          </div>
        </div>
      </div>
    </div>
  );
}
