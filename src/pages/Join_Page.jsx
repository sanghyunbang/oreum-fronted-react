import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const JoinPage = () => {
  const [formData, setFormData] = useState({pw: "", pwCheck: "", email: "", nickname: "", address:""});
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});   //입력 폼 아래 에러
  const [doShow,setDoShow] = useState(false);  //인증번호 입력 폼
  const [agreeAll, setAgreeAll] = useState(false);  //체크박스 전체 선택
  const [agree, setAgree] = useState({terms:false,privacy:false,marketing:false});  //체크박스 개별 선택
  const [showTerms, setShowTerms] = useState(false);  //이용약관 팝업
  const [showPrivacy, setShowPrivacy] = useState(false);  //개인정보 수집 및 이용동의 팝업
  const [showmarketing,setShowMarketing] = useState(false);  //마케팅 정보 수신동의 팝업

  // 포커스를 위한 ref들
  const refs = {userid: useRef(), nickname: useRef(), pw: useRef(), pwCheck: useRef(), email: useRef()};

  const doChange = (e) => {
    // if (e.target.name === "email") setECheck(false);
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  //이메일 인증
  const emailCheck = () => {
    setDoShow(true);
  };

  // 전체 동의 처리
  const handleAgreeAll = (e) => {
    const checked = e.target.checked;
    setAgreeAll(checked);
    setAgree({
      terms: checked,
      privacy: checked,
      marketing: checked,
    });
  };

  //개별 동의
  const handleAgree = (e)=>{
    setAgree(prev => {
      const newState = { ...prev, [e.target.name]: e.target.checked };
      setAgreeAll(Object.values(newState).every(Boolean));
      return newState;
    });
  }

  //팝업 전체틀
  const modalOverlayStyle = {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
  };
  //안쪽 팝업
  const modalContentStyle = {
    backgroundColor: "white", padding: "2%", borderRadius: "10px", width: "32%", maxHeight: "70vh", overflowY: "auto"
  }

  //팝업 글자
  const modalBodyStyle = {
    fontSize: "14px", lineHeight: "1.6", margin: "10px 0"
  };

  //팝업 닫기 버튼
  const modalButton = {
    position: "absolute",top: "7%",left: "32%", fontSize: "200%", backgroundColor: "transparent",
    border: "none", color: "white", hovor:"color:black", cursor: "pointer",
  }

  //폼 제출
  const doSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.nickname.trim()) newErrors.nickname = "아이디(을)를 입력하세요.";
    if (!formData.pw.trim()) newErrors.pw = "비밀번호(을)를 입력하세요.";
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

    alert("등록 성공!!");
    navigate("/login");
  };

  return (
    <div>
      <header>
        <div>
          <Link to="/login" style={{ color: 'black', textDecoration: 'none', marginLeft:'10px'}}>&lt;</Link>
        </div>
        <div>
          회원가입
        </div>
      </header>
      <div>프로필이미지</div>
      <form onSubmit={doSubmit}>
        <div>
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
          {doShow&&(
            <>
              <input type="number" name="certification" /><button type="button">인증 확인</button><br/>
            </>
          )}

          주소 <input type="text" name="address" value={formData.address} onChange={doChange} />
          <br />
        </div>
        <div style={{ textAlign: "left", marginTop: "20px" }}>
          <label>
            <input type="checkbox" checked={agreeAll} onChange={handleAgreeAll} /> 모두 동의합니다
          </label>
          <hr />
          <label className="block mt-4">
            <input type="checkbox" name="terms" checked={agree.terms} onChange={handleAgree} />
            <b className="ml-2">[필수]</b> 이용약관 동의  
            <button type="button" onClick={() => setShowTerms(true)} className="ml-2 text-blue-500 underline">보기</button>
          </label><br />
          {showTerms && (
            <div style={modalOverlayStyle}>
              <button type="button" style={modalButton} onClick={() => setShowTerms(false)}>x</button>
              <div style={modalContentStyle}>
                <h3>이용약관</h3>
                <div style={modalBodyStyle}>
                  <h3><strong>제1조 (목적)</strong></h3>
                  <p>이 약관은 [오름|OREUM] 주식회사(이하 "회사")가 제공하는 인터넷 기반의 서비스(이하 “서비스”)의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>

                  <h3><strong>제2조 (용어의 정의)</strong></h3>
                  <p>
                  1. “회원”이라 함은 회사의 서비스에 접속하여 본 약관에 동의하고 회원가입을 완료한 자를 말합니다.<br/>
                  2. “서비스”라 함은 회사가 웹사이트 및 모바일을 통해 제공하는 모든 서비스 일체를 의미합니다.<br/>
                  3. “콘텐츠”라 함은 정보통신망 이용촉진 및 정보보호 등에 관한 법률 제2조 제1항 제1호에 따른 정보 등을 의미합니다.
                  </p>

                  <h3><strong>제3조 (약관의 효력 및 변경)</strong></h3>
                  <p>
                  1. 이 약관은 회사가 서비스 초기 화면에 게시하거나 기타의 방법으로 공지하고 회원이 동의함으로써 효력을 발생합니다.<br/>
                  2. 회사는 관계법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경된 약관은 공지사항을 통해 사전 고지합니다.<br/>
                  3. 회원은 변경된 약관에 동의하지 않을 경우 이용을 중단하고 탈퇴할 수 있으며, 변경 약관 적용일 이후에도 서비스를 계속 이용하는 경우 변경 사항에 동의한 것으로 간주합니다.
                  </p>

                  <h3><strong>제4조 (회원가입)</strong></h3>
                  <p>
                  1. 이용자는 회사가 정한 절차에 따라 회원가입을 신청하고, 회사가 이를 승낙함으로써 회원가입이 완료됩니다.<br/>
                  2. 회사는 다음의 경우에는 회원가입을 승낙하지 않을 수 있습니다:<br/>
                    - 타인의 명의로 신청한 경우<br/>
                    - 허위 정보를 기재한 경우<br/>
                    - 기타 부정한 목적으로 신청한 경우
                  </p>

                  <h3><strong>제5조 (서비스 제공 및 변경)</strong></h3>
                  <p>
                  1. 회사는 회원에게 다양한 정보 제공 서비스, 커뮤니티 서비스, 기타 회사가 정한 서비스를 제공합니다.<br/>
                  2. 회사는 기술적 사유 또는 정책적 판단에 따라 서비스의 일부 또는 전부를 변경하거나 종료할 수 있으며, 이 경우 회원에게 사전 공지합니다.
                  </p>

                  <h3><strong>제6조 (회원의 의무)</strong></h3>
                  <p>
                  1. 회원은 관계법령, 본 약관, 서비스 이용 안내 및 주의사항 등을 준수해야 하며, 다음 행위를 해서는 안 됩니다:<br/>
                    - 타인의 개인정보 도용<br/>
                    - 서비스 운영을 방해하거나 시스템에 부정한 접근 시도<br/>
                    - 회사의 사전 승낙 없이 영리 목적의 광고성 정보 게시 또는 발송<br/>
                  2. 회원은 본인의 계정 및 비밀번호에 대한 관리 책임이 있으며, 제3자에게 양도, 대여할 수 없습니다.
                  </p>

                  <h3><strong>제7조 (개인정보 보호)</strong></h3>
                  <p>
                  회사는 관련 법령이 정하는 바에 따라 회원의 개인정보를 보호하며, 그 보호 및 이용에 관한 사항은 별도의 ‘개인정보처리방침’에 따릅니다.
                  </p>

                  <h3><strong>제8조 (계약 해지 및 이용제한)</strong></h3>
                  <p>
                  1. 회원은 언제든지 서비스 내 탈퇴 절차를 통해 이용계약을 해지할 수 있습니다.<br/>
                  2. 회사는 회원이 본 약관을 위반하거나 법령을 위반한 경우 사전 통지 없이 서비스 이용을 제한하거나 이용계약을 해지할 수 있습니다.
                  </p>

                  <h3><strong>제9조 (면책조항)</strong></h3>
                  <p>
                  1. 회사는 천재지변, 기술적 장애 등 불가항력으로 인한 서비스 이용 장애에 대해 책임을 지지 않습니다.<br/>
                  2. 회사는 회원이 게시한 정보, 자료, 사실의 신뢰도 및 정확성에 대해서는 책임을 지지 않습니다.
                  </p>

                  <h3><strong>제10조 (준거법 및 관할법원)</strong></h3>
                  <p>
                  이 약관은 대한민국 법령에 따라 해석되며, 서비스 이용과 관련한 분쟁에 대해서는 회사 본사 소재지를 관할하는 법원을 제1심 관할법원으로 합니다.
                  </p>
                  <p>본 약관은 2025년 6월 1일부터 시행합니다.</p>
                </div>
              </div>
            </div>
          )}
          <label className="block mt-2">
            <input type="checkbox" name="privacy" checked={agree.privacy} onChange={handleAgree} />
            <b className="ml-2">[필수]</b> 개인정보 수집 및 이용 동의  
            <button type="button" onClick={() => setShowPrivacy(true)} className="ml-2 text-blue-500 underline">보기</button>
          </label><br />
          {showPrivacy && (
            <div style={modalOverlayStyle}>
              <button type="button" style={modalButton} onClick={() => setShowPrivacy(false)}>x</button>
              <div style={modalContentStyle}>
                <h3>개인정보 수집 및 이용 동의</h3>
                <div style={modalBodyStyle}>
                  <h3><strong>개인정보 수집 및 이용 동의</strong></h3>
                  <p><strong>1. 수집하는 개인정보 항목</strong><br />
                  [회사명]은 회원가입, 원활한 고객상담, 각종 서비스 제공을 위해 아래와 같은 개인정보를 수집합니다.<br />
                  - 필수항목: 이름, 이메일 주소, 휴대전화 번호, 비밀번호<br />
                  - 선택항목: 생년월일, 성별, 주소 등<br />
                  </p>

                  <p><strong>2. 개인정보 수집 및 이용 목적</strong><br />
                  회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.<br />
                  - 회원 식별 및 서비스 제공<br />
                  - 고객 문의 응대 및 민원 처리<br />
                  - 서비스 이용에 대한 통계 분석<br />
                  - 마케팅 및 이벤트 정보 제공 (선택 시)</p>

                  <p><strong>3. 개인정보 보유 및 이용 기간</strong><br />
                  - 회원 탈퇴 후 또는 수집 목적 달성 시까지 보관하며, 관련 법령에 따라 보존이 필요한 경우에는 일정 기간 동안 보관합니다.<br />
                  예: 전자상거래 등에서의 소비자 보호에 관한 법률에 따라 5년 보관 등</p>
                  
                  <p><strong>4. 동의 거부 권리 및 불이익</strong><br />
                  이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있으며, 이 경우 서비스 이용이 제한될 수 있습니다.</p>
                  <p>※ 위의 내용을 충분히 읽고 이해하였으며, 개인정보 수집 및 이용에 동의합니다.</p>
                </div>
              </div>
            </div>
          )}
          <label>
            <input type="checkbox" name="marketing" checked={agree.marketing} onChange={handleAgree} />
            <b>[선택]</b> 마케팅 정보 수신 동의
            <button type="button" onClick={() => setShowMarketing(true)} className="ml-2 text-blue-500 underline">보기</button>
          </label><br />
          {showmarketing && (
            <div style={modalOverlayStyle}>
              <button type="button" style={modalButton} onClick={() => setShowMarketing(false)}>x</button>
              <div style={modalContentStyle}>
                <h3>개인정보 수집 및 이용 동의</h3>
                <div style={modalBodyStyle}>
                  <h3><strong>마케팅 정보 수신 동의</strong></h3>
                  <p>
                  [오름|OREUM] 주식회사(이하 "회사")는 서비스 이용자에게 보다 나은 혜택 제공과 정보 전달을 위해 광고성 정보를 전송할 수 있습니다. 마케팅 정보 수신에 동의하실 경우, 다양한 이벤트 소식, 프로모션 안내, 신상품 출시 등 유용한 정보를 받아보실 수 있습니다.
                  </p>

                  <p><strong>1. 수집 및 이용 목적</strong><br/>
                  - 신규 서비스 및 이벤트 정보 안내<br/>
                  - 맞춤형 서비스 제공 및 혜택 안내<br/>
                  - 뉴스레터, 프로모션, 할인 행사 등 마케팅 콘텐츠 제공
                  </p>

                  <p><strong>2. 수신 항목</strong><br/>
                  - 성명, 연락처(휴대폰 번호, 이메일 등), 앱 푸시 수신 여부 등
                  </p>

                  <p><strong>3. 전송 방법</strong><br/>
                  - 문자메시지(SMS/MMS), 이메일, 전화, 앱 푸시(알림) 등
                  </p>

                  <p><strong>4. 보유 및 이용 기간</strong><br/>
                  - 수신 동의일로부터 수신 동의 철회 또는 회원 탈퇴 시까지
                  </p>

                  <p><strong>5. 동의 거부권 및 불이익</strong><br/>
                  - 귀하는 마케팅 정보 수신에 동의하지 않으실 수 있으며, 동의를 거부하셔도 서비스 이용에는 제한이 없습니다.<br/>
                  - 단, 동의하지 않을 경우 회사가 제공하는 각종 혜택 및 이벤트 정보를 받지 못할 수 있습니다.
                  </p>
                  <p>
                  ※ 수신 동의는 언제든지 [마이페이지] 또는 고객센터를 통해 철회하실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          )}
          <button type="submit">등록하기</button>
        </div>
      </form>
    </div>
  );
};

export default JoinPage;
