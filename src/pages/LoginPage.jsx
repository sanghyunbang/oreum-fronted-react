import React, { useState } from 'react';

const LoginPage = ()=>{
    const [formData, setFormData] = useState({userid:"",pw:""});
    const people = {userid:"안녕",pw:"123"};
    const doChange = (e)=>{
        setFormData(prev=>({...prev,[e.target.name]:e.target.value}));
        console.log(formData.userid);
    }
    const doSubmit=async(e)=>{
         e.preventDefault();
        if(formData.userid===""){
            alert("올바른 아이디(을)를 입력하시오.");
            return;
        }else if(formData.pw===""){
            alert("올바른 비밀번호(을)를 입력하시오.");
            return;
        }
        if(formData.userid !== people.userid || formData.pw !== people.pw){
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
                    아이디<input type='text' name='userid' value={formData.userid||""} onChange={doChange} /><br/><br/>
                    비밀번호<input type='text' name='pw' value={formData.pw||""} onChange={doChange} /> <br/><br/>
                    <button type='submit'>로그인</button> <br/>아이디 찾기 비밀번호찾기 회원가입
                </form>
            </div>
        </div>
    )
}
export default LoginPage;