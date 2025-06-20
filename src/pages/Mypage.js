import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Mypage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    nickname: '',
    profile_image: '',
    address: '',
    points: 0,
  });

  // 서버에서 사용자 정보 불러오기
  useEffect(() => {
    axios.get('http://localhost:8080/api/user', { withCredentials: true })
      .then((res) => {
        setUserData(res.data);
        setFormData({
          email: res.data.email || '',
          name: res.data.name || '',
          nickname: res.data.nickname || '',
          profile_image: res.data.profile_image || '',
          address: res.data.address || '',
          points: res.data.points || 0,
        });
      })
      .catch((err) => {
        console.error('사용자 정보 불러오기 실패', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // 업데이트 요청
    axios.put('http://localhost:8080/api/user', formData, { withCredentials: true })
      .then((res) => {
        alert('정보가 업데이트 되었습니다!');
        setUserData(res.data);
        setEditMode(false);
      })
      .catch((err) => {
        console.error('업데이트 실패', err);
        alert('업데이트에 실패했습니다.');
      });
  };

  if (loading) return <p>로딩중...</p>;
  if (!userData) return <p>사용자 정보를 불러올 수 없습니다.</p>;

  return (
    <div>
      <h2>마이 페이지</h2>

      {editMode ? (
        <div>
          <label>
            이메일:
            <input type="email" name="email" value={formData.email} disabled />
          </label>
          <br />

          <label>
            이름:
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </label>
          <br />

          <label>
            닉네임:
            <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} />
          </label>
          <br />

          <label>
            프로필 이미지 URL:
            <input type="text" name="profile_image" value={formData.profile_image} onChange={handleChange} />
          </label>
          <br />
          {formData.profile_image && (
            <img src={formData.profile_image} alt="프로필" width={100} />
          )}
          <br />

          <label>
            주소:
            <input type="text" name="address" value={formData.address} onChange={handleChange} />
          </label>
          <br />

          <label>
            포인트:
            <input type="number" name="points" value={formData.points} onChange={handleChange} disabled />
          </label>
          <br />

          <button onClick={handleSave}>저장</button>
          <button onClick={() => setEditMode(false)}>취소</button>
        </div>
      ) : (
        <div>
          <p><strong>이메일:</strong> {userData.email}</p>
          <p><strong>이름:</strong> {userData.name || '-'}</p>
          <p><strong>닉네임:</strong> {userData.nickname || '-'}</p>
          <p>
            <strong>프로필 이미지:</strong><br />
            {userData.profile_image ? (
              <img src={userData.profile_image} alt="프로필" width={100} />
            ) : '없음'}
          </p>
          <p><strong>주소:</strong> {userData.address || '-'}</p>
          <p><strong>포인트:</strong> {userData.points ?? 0}</p>

          <button onClick={() => setEditMode(true)}>수정</button>
        </div>
      )}
    </div>
  );
}

export default Mypage;
