// components/MediaPreview.jsx
import React from 'react';

export default function MediaPreview({ files, onRemove }) {
  return (
    <>
      {files.length > 0 && (
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">미리보기</label>
          <div className="grid grid-cols-3 gap-4">
            {files.map((file, index) => {
              // file이 객체일 수 있으므로 안전하게 구조 분해
              const fileObj = file.file || file;
              const fileType = fileObj.type || file.type || '';
              const previewUrl = file.url || URL.createObjectURL(fileObj);

              return (
                <div key={index} className="relative group">
                  {fileType.startsWith('image/') ? (
                    <img
                      src={previewUrl}
                      alt={`preview-${index}`}
                      className="w-full h-32 object-cover rounded shadow"
                    />
                  ) : (
                    <video
                      src={previewUrl}
                      controls
                      className="w-full h-32 object-cover rounded shadow"
                    />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(index);
                    }}
                    className="absolute top-1 right-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded hidden group-hover:block"
                  >
                    삭제
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
