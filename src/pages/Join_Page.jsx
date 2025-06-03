import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const JoinPage = () => {
  const [formData, setFormData] = useState({pw: "", pwCheck: "", email: "", nickname: "", address:""});
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  // 포커스를 위한 ref들
  const refs = {userid: useRef(), nickname: useRef(), pw: useRef(), pwCheck: useRef(), email: useRef(), address: useRef()};

  const doChange = (e) => {
    // if (e.target.name === "email") setECheck(false);
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const emailCheck = () => {
    //이메일 인증
  };

  const doSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.nickname.trim()) newErrors.nickname = "아이디(을)를 입력하세요.";
    if (!formData.pw.trim()) newErrors.pw = "비밀번호(을)를 입력하세요.";
    if (!formData.pwCheck.trim()) newErrors.pwCheck = "비밀번호 확인(을)를 입력하세요.";
    if (formData.pw !== formData.pwCheck) newErrors.pwCheck = "비밀번호가 일치하지 않습니다.";
    if (!formData.email.trim()) newErrors.email = "이메일(을)를 입력하세요.";
    // if (!formData.address.trim()) newErrors.address = "주소(을)를 입력하세요.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorField = Object.keys(newErrors)[0];
      refs[firstErrorField].current.focus();
      return;
    }

    alert("등록 성공!!");
    navigate("/login");
  };

  return (
    <div style={{textAlign:'center'}}>
      <h1>회원가입</h1>
      <div>프로필이미지</div>
      <form onSubmit={doSubmit}>
        아이디 <input type="text" name="nickname" value={formData.nickname} onChange={doChange} ref={refs.nickname} onBlur={() => {
        if (!formData.nickname.trim()) setErrors(prev => ({ ...prev, nickname: "아이디(을)를 입력하세요." }));
        else setErrors(prev => ({ ...prev, nickname: "" }));
        }} />
        {errors.nickname && <div style={{ color: "red" }}>{errors.nickname}</div>}
        <br />

        비밀번호 <input type="password" name="pw" value={formData.pw} onChange={doChange} ref={refs.pw} onBlur={() => {
        if (!formData.pw.trim()) setErrors(prev => ({ ...prev, pw: "비밀번호(을)를 입력하세요." }));
        else setErrors(prev => ({ ...prev, userid: "" }));
        }} />
        {errors.pw && <div style={{ color: "red" }}>{errors.pw}</div>}
        <br />

        비밀번호 확인 <input type="password" name="pwCheck" value={formData.pwCheck} onChange={doChange} ref={refs.pwCheck} onBlur={() => {
        if (!formData.pwCheck.trim()) setErrors(prev => ({ ...prev, pwCheck: "비밀번호(을)를 입력하세요." }));
        else setErrors(prev => ({ ...prev, pwCheck: "" }));
        }} />
        {errors.pwCheck && <div style={{ color: "red" }}>{errors.pwCheck}</div>}
        <br />

        이메일 <input type="email" name="email" value={formData.email} onChange={doChange} ref={refs.email} onBlur={() => {
        if (!formData.email.trim()) setErrors(prev => ({ ...prev, email: "이메일(을)를 입력하세요." }));
        else setErrors(prev => ({ ...prev, email: "" }));
        }} />
        <button type="button" onClick={emailCheck}>인증번호</button>
        {errors.email && <div style={{ color: "red" }}>{errors.email}</div>}
        <br />

        주소 <input type="text" name="address" value={formData.address} onChange={doChange} ref={refs.address} />
        <br />
        
        <button type="submit">등록하기</button>
        <Link to="/login" style={{ color: 'black', textDecoration: 'none', marginLeft:'10px'}}>로그인</Link>
      </form>
    </div>
  );
};

export default JoinPage;
