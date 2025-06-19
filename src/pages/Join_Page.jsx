import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const JoinPage = ({ openLogin }) => {
  const [formData, setFormData] = useState({pw: "", pwCheck: "", email: "", nickname: "", address:""});
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [doShow,setDoShow] = useState(false);
  const [agreeAll, setAgreeAll] = useState(false);
  const [agree, setAgree] = useState({terms:false,privacy:false,marketing:false});
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showmarketing,setShowMarketing] = useState(false);
  const [showPassword,setShowPassword] = useState(); //비밀번호 보기, 숨기기

  const refs = {userid: useRef(), nickname: useRef(), pw: useRef(), pwCheck: useRef(), email: useRef()};

  //
  const doChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  //이메일 형식 체크
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  //이메일 인증번호
  const emailCheck = () => {
  if (!formData.email.trim()) {
    setErrors(prev => ({ ...prev, email: "이메일(을)를 입력하세요." }));
    return;
  }else if (!isValidEmail(formData.email)) {
    setErrors(prev => ({ ...prev, email: "올바른 이메일 형식이 아닙니다." }));
    refs.email.current.focus();
    return;
  }
  alert("인증번호가 발송되었습니다.")
  setDoShow(true);
  };

  const doECheck = ()=>{
    alert("인증완료");
  }

  //약관 전체 동의
  const handleAgreeAll = (e) => {
    const checked = e.target.checked;
    setAgreeAll(checked);
    setAgree({
      terms: checked,
      privacy: checked,
      marketing: checked,
    });
  };

  //약관 개별 동의
  const handleAgree = (e)=>{
    setAgree(prev => {
      const newState = { ...prev, [e.target.name]: e.target.checked };
      setAgreeAll(Object.values(newState).every(Boolean));
      return newState;
    });
  }

  //폼 제출
  const doSubmit = async (e) => {
  e.preventDefault();

  const newErrors = {};
  if (!formData.nickname.trim()) newErrors.nickname = "아이디(을)를 입력하세요.";
  else if (formData.nickname.length < 4 || formData.nickname.length > 20) newErrors.nickname = "아이디는 4자 이상 20자 이하로 입력해주세요.";
  if (!formData.pw.trim()) newErrors.pw = "비밀번호(을)를 입력하세요.";
  else if (formData.pw.length < 8 || formData.pw.length > 20) newErrors.pw = "비밀번호는 8자 이상 20자 이하로 입력해주세요.";
  if (!formData.pwCheck.trim()) newErrors.pwCheck = "비밀번호 확인(을)를 입력하세요.";
  if (formData.pw !== formData.pwCheck) newErrors.pwCheck = "비밀번호가 일치하지 않습니다.";
  if (!formData.email.trim()) newErrors.email = "이메일(을)를 입력하세요.";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    const firstErrorField = Object.keys(newErrors)[0];
    refs[firstErrorField].current.focus();
    return;
  }

  if (!agree.terms || !agree.privacy) {
    alert("필수 약관에 동의해주세요.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: formData.email,
        passwordHash: formData.pw,  // 서버에서 해싱 예정
        nickname: formData.nickname,
        address: formData.address,
      }),
    });

    if (response.ok) {
      alert("등록 성공!! 로그인 페이지로 이동합니다.");
      navigate("/");
      
    } else if (response.status === 409) {
      const data = await response.json();
      alert(data.message);
      refs.email.current.focus();
    } else {
      alert("회원가입 중 오류가 발생했습니다.");
    }
  } catch (error) {
    console.error(error);
    alert("서버와 통신 중 오류가 발생했습니다.");
  }
};


  // 팝업 스타일을 Tailwind로 대체
  const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg max-h-[70vh] overflow-y-auto relative">
          <button
            className="absolute top-3 right-3 text-xl font-bold text-gray-600 hover:text-gray-900"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          <div className="text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <header className="flex items-center space-x-4 mb-6">
        <button type="button" onClick={openLogin} className="text-black text-2xl font-bold">&lt;</button>
        <h1 className="text-xl font-semibold">회원가입</h1>
      </header>

      <form onSubmit={doSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">아이디 <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={doChange}
            ref={refs.nickname}
            onBlur={() => { //아이디 입력칸에서 벗어났을 때 조건문에 걸리면 에러 표시 (나머지도 동일)
              if (!formData.nickname.trim()) setErrors(prev => ({ ...prev, nickname: "아이디(을)를 입력하세요." }));
              else if (formData.nickname.length < 4||formData.nickname.length > 20) setErrors(prev => ({...prev, nickname: "아이디는 4자 이상 20자 이하로 입력해주세요." }));
              else setErrors(prev => ({ ...prev, nickname: "" }));
            }}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${errors.nickname ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.nickname && <p className="text-red-500 text-sm mt-1">{errors.nickname}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">비밀번호 <span className="text-red-500">*</span></label>
          <input
            type={showPassword?"text":"password"}
            name="pw"
            value={formData.pw}
            onChange={doChange}
            ref={refs.pw}
            onBlur={() => {
              if (!formData.pw.trim()) setErrors(prev => ({ ...prev, pw: "비밀번호(을)를 입력하세요." }));
              else if(formData.pw.length < 8||formData.pw.length > 20) setErrors(prev =>({...prev, pw:"비밀번호는 8자 이상 20자 이하로 입력해주세요."}))
              else if(formData.pwCheck!==formData.pw) setErrors(prev=> ({...prev, pwCheck:"비밀번호가 일치 하지않습니다."}))
              else setErrors(prev => ({ ...prev, pw: "" }));
            }}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${errors.pw ? 'border-red-500' : 'border-gray-300'}`}
          />
          <button type="button" onClick={() => setShowPassword(prev => !prev)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 text-sm">
            {showPassword ? "숨기기" : "보기"}
          </button>
          {errors.pw && <p className="text-red-500 text-sm mt-1">{errors.pw}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">비밀번호 확인 <span className="text-red-500">*</span></label>
          <input
            type="password"
            name="pwCheck"
            value={formData.pwCheck}
            onChange={doChange}
            ref={refs.pwCheck}
            onBlur={() => {
              if (!formData.pwCheck.trim()) setErrors(prev => ({ ...prev, pwCheck: "비밀번호 확인(을)를 입력하세요." }));
              else if(formData.pwCheck!==formData.pw) setErrors(prev=> ({...prev, pwCheck:"비밀번호가 일치 하지않습니다."}))
              else setErrors(prev => ({ ...prev, pwCheck: "" }));
            }}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${errors.pwCheck ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.pwCheck && <p className="text-red-500 text-sm mt-1">{errors.pwCheck}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">이메일 <span className="text-red-500">*</span></label>
          <div className="flex space-x-2">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={doChange}
              ref={refs.email}
              readOnly={doShow}
              onBlur={() => {
                if (!formData.email.trim()) setErrors(prev => ({ ...prev, email: "이메일(을)를 입력하세요." }));
                else if (!isValidEmail(formData.email)) setErrors(prev => ({ ...prev, email: "올바른 이메일 형식이 아닙니다." }));
                else setErrors(prev => ({ ...prev, email: "" }));
              }}
              className={`flex-grow border rounded px-3 py-2 focus:outline-none focus:ring ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            <button type="button" onClick={emailCheck} className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600">인증번호</button>
          </div>
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

          {doShow && (
            <div className="mt-2 flex space-x-2">
              <input type="number" name="certification" className="flex-grow border rounded px-3 py-2 focus:outline-none focus:ring" />
              <button type="button" className="bg-green-500 text-white px-4 rounded hover:bg-green-600" onClick={doECheck}>인증 확인</button>
            </div>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">주소(선택)</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={doChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring border-gray-300"
          />
        </div>

        <div className="border-t pt-4 space-y-3">
          <label className="inline-flex items-center space-x-2">
            <input type="checkbox" checked={agreeAll} onChange={handleAgreeAll} className="form-checkbox" />
            <span className="font-semibold">모두 동의합니다</span>
          </label>
          <hr />

          <label className="block">
            <input type="checkbox" name="terms" checked={agree.terms} onChange={handleAgree} className="form-checkbox" />
            <span className="ml-2 font-semibold text-red-600">[필수]</span> 이용약관 동의
            <button type="button" onClick={() => setShowTerms(true)} className="ml-2 text-blue-600 underline">보기</button>
          </label>

          <label className="block">
            <input type="checkbox" name="privacy" checked={agree.privacy} onChange={handleAgree} className="form-checkbox" />
            <span className="ml-2 font-semibold text-red-600">[필수]</span> 개인정보 수집 및 이용 동의
            <button type="button" onClick={() => setShowPrivacy(true)} className="ml-2 text-blue-600 underline">보기</button>
          </label>

          <label className="block">
            <input type="checkbox" name="marketing" checked={agree.marketing} onChange={handleAgree} className="form-checkbox" />
            <span className="ml-2 font-semibold">[선택]</span> 마케팅 정보 수신 동의
            <button type="button" onClick={() => setShowMarketing(true)} className="ml-2 text-blue-600 underline">보기</button>
          </label>

          <p className="text-sm">
            계정이 이미 있으신가요?{" "}
            <Link to="/login" className="text-blue-600 underline">로그인</Link>
          </p>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold">
            등록하기
          </button>
        </div>
      </form>

      <Modal show={showTerms} onClose={() => setShowTerms(false)} title="이용약관">
        <h4 className="font-bold mb-2">제1조 (목적)</h4>
        <p>이 약관은 [오름|OREUM] 주식회사(이하 "회사")가 제공하는 인터넷 기반의 서비스(이하 “서비스”)의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>

        <h4 className="font-bold mt-4 mb-2">제2조 (용어의 정의)</h4>
        <p>
          1. “회원”이라 함은 회사의 서비스에 접속하여 본 약관에 동의하고 회원가입을 완료한 자를 말합니다.<br/>
          2. “서비스”라 함은 회사가 웹사이트 및 모바일을 통해 제공하는 모든 서비스 일체를 의미합니다.<br/>
          3. “콘텐츠”라 함은 정보통신망 이용촉진 및 정보보호 등에 관한 법률 제2조 제1항 제1호에 따른 정보 등을 의미합니다.
        </p>
      </Modal>

      <Modal show={showPrivacy} onClose={() => setShowPrivacy(false)} title="개인정보 수집 및 이용 동의">
        <h4 className="font-bold mb-2">개인정보 수집 및 이용 동의</h4>
        <p>
          <strong>1. 수집하는 개인정보 항목</strong><br />
          [회사명]은 회원가입, 원활한 고객상담, 각종 서비스 제공을 위해 아래와 같은 개인정보를 수집합니다.<br />
          - 필수항목: 이름, 이메일 주소, 휴대전화 번호, 비밀번호<br />
          - 선택항목: 생년월일, 성별, 주소 등<br />
        </p>
      </Modal>

      <Modal show={showmarketing} onClose={() => setShowMarketing(false)} title="마케팅 정보 수신 동의">
        <h4 className="font-bold mb-2">마케팅 정보 수신 동의</h4>
        <p>
          [오름|OREUM] 주식회사(이하 "회사")는 서비스 이용자에게 보다 나은 혜택 제공과 정보 전달을 위해 광고성 정보를 전송할 수 있습니다. 마케팅 정보 수신에 동의하실 경우, 다양한 이벤트 소식, 프로모션 안내, 신상품 출시 등 유용한 정보를 받아보실 수 있습니다.
        </p>
        <p className="mt-3">
          <strong>1. 수집 및 이용 목적</strong><br/>
          - 신규 서비스 및 이벤트 정보 안내<br/>
          - 맞춤형 서비스 제공 및 혜택 안내<br/>
          - 뉴스레터, 프로모션, 할인 행사 등 마케팅 콘텐츠 제공
        </p>
      </Modal>
    </div>
  );
};

export default JoinPage;
