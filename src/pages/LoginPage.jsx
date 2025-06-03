import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginPage = ()=>{
    const [formData, setFormData] = useState({nickname:"",pw:""});
    const [errors, setErrors] = useState({});
    const people = {nickname:"안녕",pw:"123"};
    const doChange = (e)=>{
        setFormData(prev=>({...prev,[e.target.name]:e.target.value}));
        setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }
    const doSubmit=async(e)=>{
         e.preventDefault();
        const newErrors = {};
        if (!formData.nickname.trim()) newErrors.nickname = "아이디를 입력하세요.";
        if (!formData.pw.trim()) newErrors.pw = "비밀번호를 입력하세요.";

        if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
        }
        if(formData.nickname !== people.nickname || formData.pw !== people.pw){
            alert("아이디 또는 비밀번호가 일치하지 않습니다.");
            return;
        }else{
            alert("로그인 성공!!!");
        }
    }
    return (
        <div style={{textAlign:'center'}}>
            <h1>로그인</h1>
            <div>
                <form onSubmit={doSubmit}>
                    아이디<input type='text' name='nickname' value={formData.nickname||""} onChange={doChange} />
                    {errors.nickname && <div style={{ color: 'red' }}>{errors.nickname}</div>}<br/><br/>
                    비밀번호<input type='text' name='pw' value={formData.pw||""} onChange={doChange} />
                    {errors.pw && <div style={{ color: 'red' }}>{errors.pw}</div>}<br/><br/>
                    <button type='submit'>로그인</button> <br/>
                    <Link to="/fuid" style={{ color: 'black', textDecoration: 'none' }}>아이디 찾기</Link>
                    <Link to="/fpw" style={{ color: 'black', textDecoration: 'none' }}>비밀번호 찾기</Link>
                    <Link to="/join" style={{ color: 'black', textDecoration: 'none' }}> 회원가입</Link>
                </form>
            </div>
        </div>
    )
}
export default LoginPage;