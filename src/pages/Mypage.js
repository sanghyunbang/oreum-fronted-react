import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form } from 'react-router-dom';

function Mypage() {
  const [canEditNickname, setCanEditNickname] = useState(false);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    name: '',
    nickname: '',
    profile_image: '',
    address: '',
    points: 0,
  });

const [activeTab, setActiveTab] = useState(''); // 'posts', 'comments', 'likes'
const [userPosts, setUserPosts] = useState([]);
const [userComments, setUserComments] = useState([]);
const [likedPosts, setLikedPosts] = useState([]);

const fetchTabData = (tab) => {
  setActiveTab(tab);

  const { userId } = formData;

  if (tab === 'posts') {
    axios.get(`http://localhost:8080/posts/user/${userId}`)
      .then(res => setUserPosts(res.data))
      .catch(err => console.error("내가 쓴 글 가져오기 실패", err));
  }

  if (tab === 'comments') {
    axios.get(`http://localhost:8080/posts/comments/user/${userId}`)
      .then(res => setUserComments(res.data))
      .catch(err => console.error("내가 쓴 덧글 가져오기 실패", err));
  }

  if (tab === 'likes') {
    axios.get(`http://localhost:8080/posts/likes/user/${userId}`)
      .then(res => setLikedPosts(res.data))
      .catch(err => console.error("좋아요한 게시물 가져오기 실패", err));
  }
};


  useEffect(() => {
    axios.get('http://localhost:8080/api/user', { withCredentials: true })
      .then((res) => {
        const userId = res.data.userId;
        setUserData(res.data);
        setFormData(prev => ({
          ...prev,
          userId,
          email: res.data.email || '',
          nickname: res.data.nickname || '',
        }));

        return axios.post('http://localhost:8080/api/user/details', { userId }, { withCredentials: true });
      })
      .then((res) => {
        setFormData(prev => ({
          ...prev,
          name: res.data.name || '',
          address: res.data.address || '',
          profile_image: res.data.profile_image || '',
          points: res.data.points || 0
        }));
        setUserData(formData)
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
    axios.put('http://localhost:8080/api/user/details', formData, { withCredentials: true })
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

  const handleCancel = () => {
  // formData에 있는 userId를 기반으로 다시 상세정보 요청
  axios.post('http://localhost:8080/api/user/details', { userId: formData.userId }, { withCredentials: true })
    .then((res) => {
      setFormData(prev => ({
        ...prev,
        email: res.data.email || '',
        nickname: res.data.nickname || '',
        name: res.data.name || '',
        address: res.data.address || '',
        profile_image: res.data.profile_image || '',
        points: res.data.points || 0
      }));
      setEditMode(false);
    })
    .catch((err) => {
      console.error('사용자 정보 재요청 실패', err);
      alert('정보를 다시 불러오는 데 실패했습니다.');
    });
};


  if (loading) return <p className="text-center text-gray-500 mt-10">로딩중...</p>;
  if (!userData) return <p className="text-center text-red-500 mt-10">사용자 정보를 불러올 수 없습니다.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">마이 페이지</h2>

      {editMode ? (
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">이메일</label>
            <input type="email" name="email" value={formData.email} disabled className="w-full border border-gray-300 p-2 rounded bg-gray-100" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">이름</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">닉네임</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                disabled={!canEditNickname}
                className={`w-full border p-2 rounded ${!canEditNickname ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              {!canEditNickname && (
                <button
                  type="button"
                  className={`text-sm px-3 py-1 rounded text-white ${
                    formData.points < 100 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  disabled={formData.points < 100}
                  onClick={() => {
                    if (formData.points < 100) {
                      alert('포인트가 부족하여 닉네임 변경이 불가능합니다.');
                      return;
                    }
                    const confirmed = window.confirm('닉네임을 변경하시겠습니까? 포인트 100이 차감됩니다.');
                    if (confirmed) {
                      setCanEditNickname(true);
                      setFormData(prev => ({
                        ...prev,
                        points: prev.points - 100
                      }));
                    }
                  }}
                >
                  닉네임 변경
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">프로필 이미지 URL</label>
            <input type="text" name="profile_image" value={formData.profile_image} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded" />
            {formData.profile_image && (
              <img src={formData.profile_image} alt="프로필" className="w-24 h-24 mt-2 rounded-full object-cover border" />
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">주소</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">포인트</label>
            <input type="number" name="points" value={formData.points} disabled className="w-full border border-gray-300 p-2 rounded bg-gray-100" />
          </div>

          <div className="flex justify-between mt-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleSave}>저장</button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={handleCancel}>취소</button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p><strong>이메일:</strong> {formData.email}</p>
          <p><strong>이름:</strong> {formData.name || '-'}</p>
          <p><strong>닉네임:</strong> {formData.nickname || '-'}</p>
          <div>
            <strong>프로필 이미지:</strong><br />
            {formData.profile_image ? (
              <img src={formData.profile_image} alt="프로필" className="w-24 h-24 mt-2 rounded-full object-cover border" />
            ) : '없음'}
          </div>
          <p><strong>주소:</strong> {formData.address || '-'}</p>
          <p><strong>포인트:</strong> {formData.points ?? 0}</p>

        <div className="mt-10">
          <div className="my-10">
            <hr className="border-t border-gray-300" />
          </div>
        <div className="flex space-x-4 mb-4">
          <button onClick={() => fetchTabData('posts')} className="bg-gray-200 px-4 py-2 rounded">내가 쓴 글</button>
          <button onClick={() => fetchTabData('comments')} className="bg-gray-200 px-4 py-2 rounded">덧글</button>
          <button onClick={() => fetchTabData('likes')} className="bg-gray-200 px-4 py-2 rounded">좋아요한 게시물</button>
        </div>


        {activeTab === 'posts' && (
          <div>
            <h3 className="text-lg font-semibold mb-2">내가 쓴 글</h3>
            {userPosts.map(post => (
              <div key={post.postId} className="p-3 border-b">
                <p><strong>{post.title}</strong></p>
                <p>{post.content}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'comments' && (
          <div>
            <h3 className="text-lg font-semibold mb-2">내가 쓴 덧글</h3>
            {userComments.map(comment => (
              <div key={comment.commentId} className="p-3 border-b">
                <p>{comment.content}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'likes' && (
          <div>
            <h3 className="text-lg font-semibold mb-2">좋아요한 게시물</h3>
            {likedPosts.map(post => (
              <div key={post.postId} className="p-3 border-b">
                <p><strong>{post.title}</strong></p>
                <p>{post.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-end mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setEditMode(true)}
        >
          수정
        </button>
      </div>
      </div>
      
      )}

    </div>
  );
}

export default Mypage;
