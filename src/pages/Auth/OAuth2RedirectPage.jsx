import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/userSlice";

const OAuth2RedirectPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const email = query.get("email");
    const nickname = query.get("nickname");

    if (email && nickname) {
      // 쿠키는 자동 저장되었으니 굳이 localStorage에 토큰 저장 ❌
      // Redux에 로그인 상태만 반영
      dispatch(login({ email, nickname }));

      alert("소셜 로그인 완료!");
      navigate("/");
    } else {
      alert("로그인 실패");
      navigate("/login?error=oauth2");
    }
  }, [dispatch, navigate]);

  return <div>로그인 처리 중입니다...</div>;
};

export default OAuth2RedirectPage;
