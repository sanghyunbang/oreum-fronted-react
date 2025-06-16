import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import Modal from "../components/auth/modal";
import JoinPage from "./Join_Page";
import FindPw from "./Find_Pw";
import FindUserid from "./Find_Userid";

import { useDispatch } from "react-redux";
import { login } from "../redux/userSlice";

const LoginPage = ({ onClose }) => {
  const [formData, setFormData] = useState({ email: "", pw: "" });
  const [errors, setErrors] = useState({});
  const [logged, setLogged] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [showFindPw, setShowFindPw] = useState(false);
  const [showFindUserid, setShowFindUserid] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const oauthError = query.get("error") === "oauth2";

  const doChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleAree = (e) => {
    setLogged(e.target.checked);
  };

  const closeAllModals = () => {
    setShowJoin(false);
    setShowFindPw(false);
    setShowFindUserid(false);
    onClose();
  };

  // 로그인 요청 함수
  // 변경 1: fetch → axios 로 변경하여 응답 및 에러 처리 단순화
  // 변경 2: Authorization 헤더 제거 (JWT는 쿠키로 처리되므로 필요 없음)
  const doSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "이메일을 입력하세요.";
    if (!formData.pw.trim()) newErrors.pw = "비밀번호를 입력하세요.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/login",
        {
          email: formData.email,
          password: formData.pw,
        },
        {
          withCredentials: true, // 변경 3: 쿠키를 포함해서 보내기 위한 옵션 추가
        }
      );

      // 변경 4: localStorage 저장 제거 (JWT는 쿠키에 저장됨, localStorage는 선택)
      alert("로그인 성공!");
      navigate("/");
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("이메일 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  // 자동 로그인 처리 (JWT 쿠키 존재 시 사용자 정보 요청)
  // 변경 5: localStorage 기반에서 → 쿠키 기반으로 변경
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/user", {
        withCredentials: true, // 쿠키 기반 인증 정보 전송
      })
      .then((res) => {
        dispatch(login(res.data));
        alert(`${res.data.nickname || res.data.email}님 자동 로그인되었습니다.`);
        navigate("/");
      })
      .catch(() => {
        // 인증 실패 시 아무 처리하지 않음 (비로그인 상태 유지)
      });
  }, []);

  return (
    <>
      {showJoin ? (
        <Modal show={true} onClose={closeAllModals} title="회원가입">
          <JoinPage openLogin={() => setShowJoin(false)} />
        </Modal>
      ) : showFindPw ? (
        <Modal show={true} onClose={closeAllModals} title="비밀번호 찾기">
          <FindPw
            openLogin={() => setShowFindPw(false)}
            openFindUserid={() => {
              setShowFindPw(false);
              setShowFindUserid(true);
            }}
          />
        </Modal>
      ) : showFindUserid ? (
        <Modal show={true} onClose={closeAllModals} title="이메일 찾기">
          <FindUserid
            openLogin={() => setShowFindUserid(false)}
            openFindPw={() => {
              setShowFindPw(true);
              setShowFindUserid(false);
            }}
          />
        </Modal>
      ) : (
        <Modal show={true} onClose={onClose} title="로그인">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">로그인</h1>

            {oauthError && (
              <div className="text-red-500 font-semibold mb-2">
                소셜 로그인에 실패했습니다. 다시 시도해주세요.
              </div>
            )}

            {/* 소셜 로그인 버튼 (변경 없음) */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <button
                type="button"
                onClick={() => (window.location.href = "/auth/google")}
                className="flex items-center justify-center gap-2 w-full max-w-[300px] h-10 my-1.5 px-5 rounded-full border border-[#dadce0] bg-white text-[#3c4043] text-sm font-medium cursor-pointer font-arial shadow-sm"
              >
                <img src="/google-login.png" alt="Google" style={{ width: "20px", height: "20px" }} />
                Continue with Google
              </button>

              <button
                type="button"
                onClick={() => (window.location.href = "/auth/kakao")}
                className="flex items-center justify-center gap-2 w-full max-w-[300px] h-10 my-1.5 px-5 rounded-full border border-[#dadce0] bg-white text-[#3c4043] text-sm font-medium cursor-pointer font-arial shadow-sm"
              >
                <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png" alt="Kakao" style={{ width: "20px", height: "20px" }} />
                Continue with Kakao
              </button>

              <button
                type="button"
                onClick={() => (window.location.href = "http://localhost:8080/oauth2/authorization/naver")}
                className="flex items-center justify-center gap-2 w-full max-w-[300px] h-10 my-1.5 px-5 rounded-full border border-[#dadce0] bg-white text-[#3c4043] text-sm font-medium cursor-pointer font-arial shadow-sm"
              >
                <img src="/naver-login.png" alt="Naver" style={{ width: "20px", height: "20px" }} />
                Continue with Naver
              </button>
            </div>

            <div className="flex items-center my-4 max-w-full max-w-sm">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-3 text-gray-500 text-sm">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* 일반 로그인 폼 (변경 없음) */}
            <form onSubmit={doSubmit} className="space-y-4 flex flex-col items-center">
              <div className="relative w-64">
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={doChange}
                  placeholder=" "
                  className={`peer border rounded-[20px] px-3 pt-5 pb-1 w-full text-black placeholder-transparent focus:outline-none focus:border-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <label htmlFor="email" className="absolute left-3 top-1.5 text-gray-500 text-xs transition-all">
                  이메일
                </label>
                {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
              </div>

              <div className="relative w-64">
                <input
                  type="password"
                  name="pw"
                  value={formData.pw}
                  onChange={doChange}
                  placeholder=" "
                  className={`peer border rounded-[20px] px-3 pt-5 pb-1 w-full text-black placeholder-transparent focus:outline-none focus:border-blue-500 ${
                    errors.pw ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <label htmlFor="pw" className="absolute left-3 top-1.5 text-gray-500 text-xs transition-all">
                  비밀번호
                </label>
                {errors.pw && <div className="text-red-500 text-sm mt-1">{errors.pw}</div>}
              </div>

              <div className="flex items-center justify-center space-x-2">
                <input type="checkbox" name="logged" checked={logged} onChange={handleAree} className="w-4 h-4" />
                <label className="text-sm text-black">로그인 상태 유지</label>
              </div>

              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded">
                로그인
              </button>

              <div className="mt-4 space-x-4 text-sm">
                <button type="button" onClick={() => setShowFindUserid(true)} className="text-black hover:underline">
                  이메일 찾기
                </button>
                <button type="button" onClick={() => setShowFindPw(true)} className="text-black hover:underline">
                  비밀번호 찾기
                </button>
                <button type="button" onClick={() => setShowJoin(true)} className="text-black hover:underline">
                  회원가입
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
};

export default LoginPage;


// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Modal from "../components/auth/modal";
// import JoinPage from "./Join_Page";
// import FindPw from "./Find_Pw";
// import FindUserid from "./Find_Userid";

// const LoginPage = ({ onClose }) => {
//   const [formData, setFormData] = useState({ email: "", pw: "" });
//   const [errors, setErrors] = useState({});
//   const [logged, setLogged] = useState(false);
//   const [showJoin, setShowJoin] = useState(false);
//   const [showFindPw, setShowFindPw] = useState(false);
//   const [showFindUserid, setShowFindUserid] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const query = new URLSearchParams(location.search);
//   const oauthError = query.get("error") === "oauth2";

//   const doChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
//   };

//   const handleAree = (e) => {
//     setLogged(e.target.checked);
//   };

//   const closeAllModals = () => {
//     setShowJoin(false);
//     setShowFindPw(false);
//     setShowFindUserid(false);
//     onClose();
//   };

//   const doSubmit = async (e) => {
//     e.preventDefault();
//     const newErrors = {};
//     if (!formData.email.trim()) newErrors.email = "이메일을 입력하세요.";
//     if (!formData.pw.trim()) newErrors.pw = "비밀번호를 입력하세요.";
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:8080/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           email: formData.email,
//           password: formData.pw,
//         }),
//       });

//       if (!response.ok) throw new Error("로그인 실패");
//       const data = await response.json();
//       console.log("data 확인: ", data);
//       localStorage.setItem("jwtToken", data.token);
//       localStorage.setItem("email", formData.email);
//       localStorage.setItem("userId",data.userId);

//       alert("로그인 성공!");
//       navigate("/");
//     } catch (error) {
//       alert("이메일 또는 비밀번호가 일치하지 않습니다.");
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("jwtToken");
//     const email = localStorage.getItem("email");
//     if (token && email) {
//       alert(`${email}님 자동 로그인되었습니다.`);
//       navigate("/");
//     }
//   }, []);

//   return (
//     <>
//       {showJoin ? (
//         <Modal show={true} onClose={closeAllModals} title="회원가입">
//           <JoinPage openLogin={() => setShowJoin(false)} />
//         </Modal>
//       ) : showFindPw ? (
//         <Modal show={true} onClose={closeAllModals} title="비밀번호 찾기">
//           <FindPw
//             openLogin={() => setShowFindPw(false)}
//             openFindUserid={() => {
//               setShowFindPw(false);
//               setShowFindUserid(true);
//             }}
//           />
//         </Modal>
//       ) : showFindUserid ? (
//         <Modal show={true} onClose={closeAllModals} title="이메일 찾기">
//           <FindUserid
//             openLogin={() => setShowFindUserid(false)}
//             openFindPw={() => {
//               setShowFindPw(true);
//               setShowFindUserid(false);
//             }}
//           />
//         </Modal>
//       ) : (
//         <Modal show={true} onClose={onClose} title="로그인">
//           <div className="text-center">
//             <h1 className="text-2xl font-bold mb-4">로그인</h1>

//             {oauthError && (
//               <div className="text-red-500 font-semibold mb-2">
//                 소셜 로그인에 실패했습니다. 다시 시도해주세요.
//               </div>
//             )}

//             <div>
//               <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//                 <button
//                   type="button"
//                   onClick={() => (window.location.href = "/auth/google")}
//                   className="flex items-center justify-center gap-2 w-full max-w-[300px] h-10 my-1.5 px-5 
//                             rounded-full border border-[#dadce0] bg-white text-[#3c4043] text-sm font-medium 
//                             cursor-pointer font-arial shadow-sm"
//                 >
//                   <img src="/google-login.png" alt="Google" style={{ width: "20px", height: "20px" }} />
//                   Continue with Google
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => (window.location.href = "/auth/kakao")}
//                   className="flex items-center justify-center gap-2 w-full max-w-[300px] h-10 my-1.5 px-5 
//                             rounded-full border border-[#dadce0] bg-white text-[#3c4043] text-sm font-medium 
//                             cursor-pointer font-arial shadow-sm"
//                 >
//                   <img
//                     src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"
//                     alt="Kakao"
//                     style={{ width: "20px", height: "20px" }}
//                   />
//                   Continue with Kakao
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => (window.location.href = "http://localhost:8080/oauth2/authorization/naver")}
//                   className="flex items-center justify-center gap-2 w-full max-w-[300px] h-10 my-1.5 px-5 
//                             rounded-full border border-[#dadce0] bg-white text-[#3c4043] text-sm font-medium 
//                             cursor-pointer font-arial shadow-sm"
//                 >
//                   <img src="/naver-login.png" alt="Naver" style={{ width: "20px", height: "20px" }} />
//                   Continue with Naver
//                 </button>
//               </div>

//               <div className="flex items-center my-4 max-w-full max-w-sm">
//                 <hr className="flex-grow border-gray-300" />
//                 <span className="mx-3 text-gray-500 text-sm">or</span>
//                 <hr className="flex-grow border-gray-300" />
//               </div>

//               <form onSubmit={doSubmit} className="space-y-4 flex flex-col items-center">
//                 {/* 이메일 */}
//                 <div className="relative w-64">
//                   <input
//                     type="text"
//                     name="email"
//                     value={formData.email || ""}
//                     onChange={doChange}
//                     id="email"
//                     placeholder=" "
//                     className={`peer border rounded-[20px] px-3 pt-5 pb-1 w-full text-black placeholder-transparent focus:outline-none focus:border-blue-500 ${
//                       errors.email ? "border-red-500" : "border-gray-300"
//                     }`}
//                     onBlur={() => {
//                       if (!formData.email.trim()) setErrors((prev) => ({ ...prev, email: "이메일을 입력하세요." }));
//                     }}
//                   />
//                   <label
//                     htmlFor="email"
//                     className={`absolute left-3 top-1.5 text-gray-500 text-xs transition-all
//                             peer-placeholder-shown:top-[16px] peer-placeholder-shown:text-[13px] peer-placeholder-shown:text-gray-400
//                             peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-500`}
//                   >
//                     이메일
//                   </label>
//                   {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
//                 </div>

//                 {/* 비밀번호 */}
//                 <div className="relative w-64">
//                   <input
//                     type="password"
//                     name="pw"
//                     value={formData.pw || ""}
//                     onChange={doChange}
//                     id="pw"
//                     placeholder=" "
//                     className={`peer border rounded-[20px] px-3 pt-5 pb-1 w-full text-black placeholder-transparent focus:outline-none focus:border-blue-500 ${
//                       errors.pw ? "border-red-500" : "border-gray-300"
//                     }`}
//                     onBlur={() => {
//                       if (!formData.pw.trim()) setErrors((prev) => ({ ...prev, pw: "비밀번호를 입력하세요." }));
//                     }}
//                   />
//                   <label
//                     htmlFor="pw"
//                     className="absolute left-3 top-1.5 text-gray-500 text-xs transition-all
//                             peer-placeholder-shown:top-[16px] peer-placeholder-shown:text-[13px] peer-placeholder-shown:text-gray-400
//                             peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-500"
//                   >
//                     비밀번호
//                   </label>
//                   {errors.pw && <div className="text-red-500 text-sm mt-1">{errors.pw}</div>}
//                 </div>

//                 <div className="flex items-center justify-center space-x-2">
//                   <input
//                     type="checkbox"
//                     name="logged"
//                     checked={logged}
//                     onChange={handleAree}
//                     className="w-4 h-4"
//                   />
//                   <label className="text-sm text-black">로그인 상태 유지</label>
//                 </div>

//                 <button
//                   type="submit"
//                   className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded"
//                 >
//                   로그인
//                 </button>

//                 <div className="mt-4 space-x-4 text-sm">
//                   <button type="button" onClick={() => setShowFindUserid(true)} className="text-black hover:underline">
//                     이메일 찾기
//                   </button>
//                   <button type="button" onClick={() => setShowFindPw(true)} className="text-black hover:underline">
//                     비밀번호 찾기
//                   </button>
//                   <button type="button" onClick={() => setShowJoin(true)} className="text-black hover:underline">
//                     회원가입
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </>
//   );
// };

// export default LoginPage;
