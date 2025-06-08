import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({ nickname: "", pw: "" });
  const [errors, setErrors] = useState({});
  const [logged, setLogged] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 쿼리스트링 파싱 (소셜 로그인 실패 감지용)
  const query = new URLSearchParams(location.search);
  const oauthError = query.get("error") === "oauth2";

  // input 변경 핸들러
  const doChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  // 체크박스 토글
  const handleAree = (e) => {
    setLogged(e.target.checked);
  };

  // 로그인 요청
  const doSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.nickname.trim()) newErrors.nickname = "아이디를 입력하세요.";
    if (!formData.pw.trim()) newErrors.pw = "비밀번호를 입력하세요.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키 전송을 위해 필수
        body: JSON.stringify({
          nickname: formData.nickname,
          password: formData.pw,
        }),
      });

      if (!response.ok) throw new Error("로그인 실패");
      const data = await response.json();
      localStorage.setItem("jwtToken", data.token);
      localStorage.setItem("nickname", formData.nickname);
      alert("로그인 성공!");
      navigate("/");
    } catch (error) {
      alert("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  // 자동 로그인 확인
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const nickname = localStorage.getItem("nickname");
    if (token && nickname) {
      alert(`${nickname}님 자동 로그인되었습니다.`);
      navigate("/");
    }
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">로그인</h1>

      {/* 소셜 로그인 실패 시 메시지 */}
      {oauthError && (
        <div className="text-red-500 font-semibold mb-2">
          소셜 로그인에 실패했습니다. 다시 시도해주세요.
        </div>
      )}

      <form onSubmit={doSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">아이디</label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={doChange}
            className="border border-gray-300 rounded px-3 py-1 w-64"
          />
          {errors.nickname && (
            <div className="text-red-500 text-sm mt-1">{errors.nickname}</div>
          )}
        </div>

        <div>
          <label className="block mb-1">비밀번호</label>
          <input
            type="password"
            name="pw"
            value={formData.pw}
            onChange={doChange}
            className="border border-gray-300 rounded px-3 py-1 w-64"
          />
          {errors.pw && (
            <div className="text-red-500 text-sm mt-1">{errors.pw}</div>
          )}
        </div>

        <div className="flex items-center justify-center space-x-2">
          <input
            type="checkbox"
            name="logged"
            checked={logged}
            onChange={handleAree}
            className="w-4 h-4"
          />
          <label className="text-sm">로그인 상태 유지</label>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded"
        >
          로그인
        </button>

        {/* ✅ 소셜 로그인 버튼 */}
        <div className="flex justify-center gap-4 mt-4">
          <a href="http://localhost:8080/oauth2/authorization/naver">
            <img src="/images/naver-login.png" alt="네이버 로그인" className="w-32" />
          </a>
          <a href="http://localhost:8080/oauth2/authorization/google">
            <img src="/images/google-login.png" alt="구글 로그인" className="w-32" />
          </a>
        </div>

        <div className="mt-4 space-x-4 text-sm">
          <Link to="/fuid" className="text-black hover:underline">오름ID 찾기</Link>
          <Link to="/fpw" className="text-black hover:underline">비밀번호 찾기</Link>
          <Link to="/join" className="text-black hover:underline">회원가입</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
