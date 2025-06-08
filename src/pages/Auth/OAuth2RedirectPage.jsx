import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/userSlice";

const OAuth2RedirectPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");
    const nickname = query.get("nickname");

    if (token && nickname) {
      //  브라우저에 저장 (쿠키 or localStorage)
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("nickname", nickname);

      //  Redux에 로그인 상태 반영
      dispatch(login({ nickname }));

      alert("소셜 로그인 완료!");
      navigate("/"); // 홈으로 리다이렉트
    } else {
      alert("로그인 실패");
      navigate("/login?error=oauth2");
    }
  }, [dispatch, navigate]);

  return <div>로그인 처리 중입니다...</div>;
};

export default OAuth2RedirectPage;
