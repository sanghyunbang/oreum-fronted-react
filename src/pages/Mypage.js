import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, useNavigate } from 'react-router-dom';

function Mypage() {
  const [canEditNickname, setCanEditNickname] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

const stripHtml = (html) => html.replace(/<[^>]+>/g, '');
const paginate = (data) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  return data.slice(startIndex, startIndex + itemsPerPage);
};

const fetchTabData = (tab) => {
  setActiveTab(tab);
  setCurrentPage(1);

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
  if (tab === 'bookmarks') {
  axios.get(`http://localhost:8080/posts/bookmarks/user/${userId}`)
    .then(res => setBookmarkedPosts(res.data))
    .catch(err => console.error("북마크한 게시물 가져오기 실패", err));
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
  useEffect(() => {
  if (formData.userId) {
    fetchTabData('posts');
  }
}, [formData.userId]);

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
        setCanEditNickname(false);
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
      setCanEditNickname(false);
    })
    .catch((err) => {
      console.error('사용자 정보 재요청 실패', err);
      alert('정보를 다시 불러오는 데 실패했습니다.');
    });
};

const Pagination = ({ totalItems }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-4 space-x-2">
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          className={`px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white'}`}
          onClick={() => setCurrentPage(index + 1)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};


  if (loading) return <p className="text-center text-gray-500 mt-10">로딩중...</p>;
  if (!userData) return <p className="text-center text-red-500 mt-10">사용자 정보를 불러올 수 없습니다.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <div className="flex items-center mb-6">
        <img
          src={formData.profile_image || '/images/profile.jfif'}
          alt="프로필 이미지"
          className="w-10 h-10 rounded-full object-cover border mr-2"
        />
        <h2 className="text-xl font-bold text-gray-800">마이 페이지</h2>
      </div>

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
          
          <p><strong>주소:</strong> {formData.address || '-'}</p>
          <p><strong>포인트:</strong> {formData.points ?? 0}</p>

        <div className="mt-10">
          <div className="my-10">
            <hr className="border-t border-gray-300" />
          </div>

          <div className="flex space-x-4 mb-4">
            <button onClick={() => fetchTabData('posts')} className={`px-4 py-2 rounded ${activeTab === 'posts' ? 'bg-blue-400 text-white' : 'bg-gray-200'}`}>내가 쓴 글</button>
            <button onClick={() => fetchTabData('comments')} className={`px-4 py-2 rounded ${activeTab === 'comments' ? 'bg-blue-400 text-white' : 'bg-gray-200'}`}>덧글</button>
            <button onClick={() => fetchTabData('likes')} className={`px-4 py-2 rounded ${activeTab === 'likes' ? 'bg-blue-400 text-white' : 'bg-gray-200'}`}>좋아요한 게시물</button>
            <button onClick={() => fetchTabData('bookmarks')} className={`px-4 py-2 rounded ${activeTab === 'bookmarks' ? 'bg-blue-400 text-white' : 'bg-gray-200'}`}>북마크한 게시물</button>
          </div>
        <div className="h-96 overflow-y-scroll border rounded p-4 bg-gray-50">
    {activeTab === 'posts' && (
      <div>
        <h3 className="text-lg font-semibold mb-2">내가 쓴 글</h3>
        {paginate(userPosts).map(post => (
          <div
            key={post.postId}
            className="p-3 border-b cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/post/${post.postId}`)}
          >
            <h4 className="text-md font-bold">{post.title}</h4>
            <div className="text-sm text-gray-700">{stripHtml(post.content)}</div>
          </div>
        ))}
        <Pagination totalItems={userPosts.length} />
      </div>
    )}

    {activeTab === 'comments' && (
      <div>
        <h3 className="text-lg font-semibold mb-2">내가 쓴 덧글</h3>
        {paginate(userComments).map(comment => (
          <div
            key={comment.commentId}
            className="p-3 border-b cursor-pointer hover:bg-gray-50"
            onClick={() => {
              if (comment.postId) {
                navigate(`/post/${comment.postId}`);
              } else {
                alert('해당 게시글 정보를 찾을 수 없습니다.');
              }
            }}
          >
            <p>{comment.content}</p>
          </div>
        ))}
        <Pagination totalItems={userComments.length} />
      </div>
    )}

    {activeTab === 'likes' && (
      <div>
        <h3 className="text-lg font-semibold mb-2">좋아요한 게시물</h3>
        {paginate(likedPosts).map(post => (
          <div
            key={post.postId}
            className="p-3 border-b cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/post/${post.postId}`)}
          >
            <p><strong>{post.title}</strong></p>
            <p>{stripHtml(post.content)}</p>
          </div>
        ))}
        <Pagination totalItems={likedPosts.length} />
      </div>
    )}

    {activeTab === 'bookmarks' && (
      <div>
        <h3 className="text-lg font-semibold mb-2">북마크한 게시물</h3>
        {paginate(bookmarkedPosts).map(post => (
          <div
            key={post.postId}
            className="p-3 border-b cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/post/${post.postId}`)}
          >
            <p><strong>{post.title}</strong></p>
            <p>{stripHtml(post.content)}</p>
          </div>
        ))}
        <Pagination totalItems={bookmarkedPosts.length} />
      </div>
    )}
  </div>
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
