// 시간 경과 계산 유틸
const timeSince = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds}초 전`;
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  return `${days}일 전`;
};

function PostHeader({ post, userInfo, isFavorited, onToggleFavorite }) {
  return (
    <div className="flex justify-between items-center text-sm text-gray-500 mb-1">
      <span>
        <strong>{post.nickname || "익명"}</strong> · {timeSince(post.createdAt)}
      </span>
      <button
        className={`text-lg ${
          isFavorited
            ? "text-yellow-400 hover:text-yellow-500"
            : "text-gray-400 hover:text-gray-600"
        }`}
        onClick={onToggleFavorite}
        aria-label={isFavorited ? "즐겨찾기 해제" : "즐겨찾기"}
        title={isFavorited ? "즐겨찾기 해제" : "즐겨찾기"}
        disabled={!userInfo}
      >
        ★
      </button>
    </div>
  );
}

export default PostHeader;
