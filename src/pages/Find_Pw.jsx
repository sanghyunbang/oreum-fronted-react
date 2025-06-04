import { useState } from "react";
import { Link } from "react-router-dom";

const FindPw = ()=>{
    const [formData,setFormData] = useState({email:"",number:"",nickname:""});
    const [doShow,setDoShow] = useState(false);
    const people = {nickname:"안녕",email:"123@gmail.com",number:"12563"}

    const doChange = (e)=>{
        setFormData(prev=>({...prev,[e.target.name]:e.target.value}));
    }
    
    const doCheck = ()=>{
        if(formData.email===people.email&&formData.nickname===people.nickname){
            setDoShow(true);
        }else{
            alert("아이디 또는 이메일이 일치하지 않습니다.")
        }
    }

    const doSubmit = (e)=>{
        e.preventDefault();
        if(formData.number===people.number){
            alert("비밀번호: 123")
        }else{
            alert("인증번호가 일치하지 않습니다.")
        }
    }
    return(
        <div style={{textAlign:"center"}}>
            <h1>비밀번호 찾기</h1>
            <div>
                <form onSubmit={doSubmit}>
                    아이디(닉네임) <input type="text" name="nickname" value={formData.nickname} onChange={doChange} required /><br/>
                    이메일 <input type="email" name="email" value={formData.email} onChange={doChange} required />
                    <button type="button" onClick={doCheck}>인증번호 발송</button><br/>
                    {doShow&&(
                    <>
                        <input type="number" name="number" value={formData.number} onChange={doChange} required />
                        <button type="submit">인증확인</button>
                    </>
                    )}
                </form>
            </div>
            <div>
                <Link to="/login" style={{ color: 'black', textDecoration: 'none', marginRight:"50px"}}>로그인</Link>
                <Link to="/fuid" style={{ color: 'black', textDecoration: 'none' }}>아이디 찾기</Link>
            </div>
        </div>
    )
}
export default FindPw;