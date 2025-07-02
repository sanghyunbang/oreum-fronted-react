import { useSelector } from "react-redux";
import { useEffect, useState } from "react";


const CommunityStats = ({ community }) => {
  const user = useSelector((state) => state.user.userInfo);

  const handleJoin = async () => {
    if (!user || !user.userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    console.log("id",user.userId);
    console.log("title",community.title);

    try {
      const body = {
        userId: parseInt(user.userId, 10),
        communityTitle: community.title,
      };

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/community/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키 인증용
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("커뮤니티 가입 실패");
      alert("가입 완료!");
      //  Sidebar의 상태 갱신을 유도하기 위해 이벤트 발생
      const event = new CustomEvent("community-joined");
      window.dispatchEvent(event);

    } catch (err) {
      console.error(err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  // 가입여부 확인
  const [joinedTitles, setJoinedTitles] = useState([]);

    useEffect(() => {
    const fetchMyCommunities = async () => {
        if (!user || !user.userId) return;

        try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/community/mycommunities`, {
            credentials: "include",
        });
        if (!res.ok) throw new Error("내 커뮤니티 불러오기 실패");

        const data = await res.json(); // → ["지리산", "설악산", ...]
        setJoinedTitles(data);
        } catch (err) {
        console.error(err);
        }
    };

    fetchMyCommunities();
    }, [user]);

    // 가입 혹은 탈퇴

    const isJoined = joinedTitles.includes(community.title);

    const handleToggleJoin = async () => {
    if (!user || !user.userId) {
        alert("로그인이 필요합니다.");
        return;
    }

    const body = {
        userId: parseInt(user.userId, 10),
        communityTitle: community.title,
    };

    try {
        const url = isJoined
        ? `${process.env.REACT_APP_API_URL}/api/community/leave`
        : `${process.env.REACT_APP_API_URL}/api/community/join`;

        const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error("요청 실패");

        alert(isJoined ? "탈퇴 완료!" : "가입 완료!");

        // 최신 상태 반영
        const updated = isJoined
        ? joinedTitles.filter((t) => t !== community.title)
        : [...joinedTitles, community.title];
        setJoinedTitles(updated);

    } catch (err) {
        console.error(err);
        alert("서버 오류가 발생했습니다.");
    }
    };



  

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <p className="text-sm text-gray-500">📅 created: {community.createdAt}</p>
        <p className="text-sm text-gray-500">
          🌐 {community.isPrivate ? "Private" : "Public"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
            onClick={handleToggleJoin}
            className={`px-3 py-1 text-white text-sm rounded transition ${
            isJoined ? "bg-blue-300 hover:bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
            {isJoined ? "탈퇴하기" : "가입하기"}
        </button>
        <button className="text-xs text-blue-500 underline hover:text-blue-700">
            Edit
        </button>
        </div>
    </div>
  );
};

export default CommunityStats;
