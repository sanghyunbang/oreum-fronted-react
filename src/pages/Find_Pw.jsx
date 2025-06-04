// import { useState } from "react";

// const FindPw = ()=>{
//     const [formData,setFormData] = useState({email:"",number:""});

//     const doChange = (e)=>{
//         setFormData(prev=>({...prev,[e.target.value]}))
//     }
//     return(
//         <div>
//             <h1>비밀번호 찾기</h1>
//             <div>
//                 <input type="email" name="email" value={formData.email} onChange={doChange} required />
//                 <button type="button" onClick={doCheck}>인증번호 발송</button><br/>
//                 {doShow&&(
//                 <>
//                 <input type="number" name="number" value={formData.number} onChange={doChange} required />
//                 <button type="submit">인증확인</button>
//                 </>)}
//             </div>
//         </div>
//     )
// }
// export default FindPw;