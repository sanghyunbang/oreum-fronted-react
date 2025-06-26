export default function MediaDisplay({ media }) {
  if (!Array.isArray(media) || media.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {media.map((url, idx) => {
        const lowerUrl = url.toLowerCase();

        const commonClass =
          "w-72 h-48 object-cover rounded-xl border border-gray-300 shadow-sm"; // 디자인 반영

        if (
          lowerUrl.endsWith(".jpg") ||
          lowerUrl.endsWith(".jpeg") ||
          lowerUrl.endsWith(".png") ||
          lowerUrl.endsWith(".gif") ||
          lowerUrl.endsWith(".webp")
        ) {
          return (
            <img
              key={idx}
              src={url}
              alt={`image-${idx}`}
              className={commonClass}
            />
          );
        } else if (
          lowerUrl.endsWith(".mp4") ||
          lowerUrl.endsWith(".webm") ||
          lowerUrl.endsWith(".ogg")
        ) {
          return (
            <video
              key={idx}
              src={url}
              controls
              className={commonClass}
            />
          );
        } else {
          return null;
        }
      })}
    </div>
  );
}
