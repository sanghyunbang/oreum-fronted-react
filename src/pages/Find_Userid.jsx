import { useState } from "react";
import { Link } from "react-router-dom";

const FindUserid = () => {
  const [formData, setFormData] = useState({ email: "", number: "" });
  const [doShow, setDoShow] = useState(false);
  const people = { email: "123@gmail.com", nickname: "안녕", number: "12563" };

  const doChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const doCheck = () => {
    if (formData.email === people.email) {
      alert("인증번호가 전송되었습니다.");
      setDoShow(true);
    } else {
      alert("등록되지 않은 이메일입니다.");
    }
  };

  const doSubmit = (e) => {
    e.preventDefault();
    if (formData.number === people.number) {
      alert("닉네임: " + people.nickname);
    } else {
      alert("인증번호 일치하지 않습니다.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md text-center font-sans">
      <h1 className="mb-6 text-2xl font-semibold">아이디 찾기</h1>
      <form onSubmit={doSubmit} className="flex flex-col space-y-4">
        <label className="text-left font-medium">이메일로 찾기</label>
        <div className="flex space-x-3">
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={formData.email}
            onChange={doChange}
            required
            className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={doCheck}
            className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            인증번호 발송
          </button>
        </div>

        {doShow && (
          <>
            <input
              type="number"
              name="number"
              placeholder="인증번호 입력"
              value={formData.number}
              onChange={doChange}
              required
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              인증확인
            </button>
          </>
        )}
      </form>

      <div className="mt-6 flex justify-center space-x-12 text-blue-600 font-medium">
        <Link to="/login" className="hover:underline">
          로그인
        </Link>
        <Link to="/fpw" className="hover:underline">
          비밀번호 찾기
        </Link>
      </div>
    </div>
  );
};

export default FindUserid;
