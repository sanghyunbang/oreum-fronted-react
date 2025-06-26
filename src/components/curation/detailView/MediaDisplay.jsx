export default function MediaDisplay({ media }) {
  return (
    <div className="flex flex-wrap gap-3 mb-2">
      {media.map((file, idx) => {
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
  );
}
