import { useState } from "react";
import { Link } from "react-router-dom";

const FindUserid = ()=>{
    const [formData,setFormData] = useState({email:""});
    const [doShow,setDoShow] = useState(false);
    const people = {email:"123@gmail.com",nickname:"안녕"};

    const doChange = (e)=>{
        setFormData(prev=>({...prev,[e.target.name]:e.target.value}));
    }
    
    const doCheck = (e)=>{
        if(formData.email===people.email){
            alert("인증번호가 전송되었습니다.");
            setDoShow(true);
        }
        else(
            alert("등록되지 않은 이메일입니다.")
        )
    }
    const doSubmit = (e)=>{
        e.preventDefault();
        alert("닉네임: ",people.nickname)
    }
    return(
        <div style={{textAlign:'center'}}>
            <h1>아이디 찾기</h1>
            <div>
                <form onSubmit={doSubmit}>
                    이메일로 찾기<br />
                    <input type="email" name="email" value={formData.email} onChange={doChange} required />
                    <button type="button" onClick={doCheck}>인증번호 발송</button><br/>
                    {doShow&&(
                    <>
                    <input type="number" name="number" value={formData.number} onChange={doChange} required />
                    <button type="submit">인증확인</button>
                    </>)}
                </form>
            </div>
            <div>
                <Link to="/login" style={{ color: 'black', textDecoration: 'none', marginRight:"50px"}}>로그인</Link>
                <Link to="/fpw" style={{ color: 'black', textDecoration: 'none' }}>비밀번호 찾기</Link>
            </div>
        </div>
    )
}
export default FindUserid;