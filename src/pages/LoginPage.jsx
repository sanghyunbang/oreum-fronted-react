import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = ()=>{
    const [formData, setFormData] = useState({nickname:"",pw:""});
    const [errors, setErrors] = useState({});
    const [logged, doLogged] = useState(false);
    const navigate = useNavigate();
    
    const people = {nickname:"안녕",pw:"123"};
    
    const doChange = (e)=>{
        setFormData(prev=>({...prev,[e.target.name]:e.target.value}));
        setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }

    const handleAree = (e)=>{
        doLogged(e.target.checked);
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
        if (logged) {
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("nickname", formData.nickname);
        }
    }

    //로그인 시작시 자동 로그인확인 ex) 자동로그인 체크시 그냥 넘어가짐
    useEffect(() => {
        const isLoggedIn = localStorage.getItem("loggedIn");
        const savedNickname = localStorage.getItem("nickname");
        if (isLoggedIn === "true" && savedNickname) {
            alert(`${savedNickname}님 자동 로그인되었습니다.`);
            // navigate("/");
            // 여기서 원하는 동작 추가 가능 (예: 리디렉션 등)
        }
    }, []);

    //로그아웃
    const doLogout = () => {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("nickname");
        alert("로그아웃 되었습니다.");
    };

    return (
    <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">로그인</h1>
        <div>
            <form onSubmit={doSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">아이디</label>
                    <input
                        type="text"
                        name="nickname"
                        value={formData.nickname || ""}
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
                        type="text"
                        name="pw"
                        value={formData.pw || ""}
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

                <div className="mt-4 space-x-4 text-sm">
                    <Link to="/fuid" className="text-black hover:underline">
                        오름ID 찾기
                    </Link>
                    <Link to="/fpw" className="text-black hover:underline">
                        비밀번호 찾기
                    </Link>
                    <Link to="/join" className="text-black hover:underline">
                        회원가입
                    </Link>
                </div>
            </form>
        </div>
    </div>
)

}
export default LoginPage;