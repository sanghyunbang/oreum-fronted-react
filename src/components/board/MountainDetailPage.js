import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function MountainDetailPage() {
  const { name } = useParams();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(false);     

  useEffect(() => {
    setLoading(true);
    setError(false);

    fetch(`${process.env.REACT_APP_API_URL}/api/posts/mountain-info?name=${name}`)
      .then((res) => {
        if (!res.ok) throw new Error("정보를 불러올 수 없습니다.");
        return res.json();
      })
      .then((data) => {
        setInfo(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [name]);

  if (loading) {
    return <div className="p-4">로딩 중...</div>;
  }

  if (error) {
    // 에러났을 때 빈 껍데기 UI라도 보여줌
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{name}</h2>
        <p className="text-gray-700 mb-1">📍 위치: 정보 없음</p>
        <p className="text-gray-700 mb-1">⛰️ 고도: 정보 없음</p>
        <p className="text-gray-700 mt-2">정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  // 정상 데이터 있을 때 렌더링
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">{info.name}</h2>
      <p className="text-gray-700 mb-1">📍 위치: {info.location}</p>
      <p className="text-gray-700 mb-1">⛰️ 고도: {info.height}</p>
      <p className="text-gray-700 mt-2">{info.description}</p>
    </div>
  );
}

export default MountainDetailPage;
