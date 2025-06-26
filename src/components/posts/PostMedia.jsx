import React from "react";

function PostMedia({ mediaList }) {
  if (!mediaList || mediaList.length === 0) return null;

  return (
    <div className="mb-6">
      {mediaList.map((media, idx) =>
        media.mediaType === "image" ? (
          <img
            key={idx}
            src={media.mediaUrl}
            alt={`image-${idx}`}
            className="w-full max-h-[400px] object-contain rounded mb-3"
          />
        ) : (
          <video
            key={idx}
            src={media.mediaUrl}
            controls
            muted
            autoPlay
            loop
            playsInline
            className="w-full max-h-[400px] rounded mb-3"
          />
        )
      )}
    </div>
  );
}

export default PostMedia;
