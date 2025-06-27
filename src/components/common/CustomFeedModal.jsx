import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CustomFeedModal({ onClose, onSuccess }) {
  const [feedName, setFeedName] = useState('');
  const [communities, setCommunities] = useState([]);
  const [selectedBoards, setSelectedBoards] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/community/list', { withCredentials: true })
      .then(res => setCommunities(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleCheckboxChange = (boardId) => {
    setSelectedBoards(prev =>
      prev.includes(boardId)
        ? prev.filter(id => id !== boardId)
        : [...prev, boardId]
    );
    console.log("선택된 항목 : ",selectedBoards)
  };

  const handleSubmit = () => {
    if (!feedName || selectedBoards.length === 0) {
      alert('피드 이름과 커뮤니티를 선택해주세요.');
      return;
    }

    axios.post('http://localhost:8080/api/community/createfeed',
      {
        feedname: feedName,
        boardIdList: selectedBoards,
      },
      { withCredentials: true }
    )
      .then(() => {
        alert('피드가 생성되었습니다!');
        onSuccess();
        onClose();
      })
      .catch(err => {
        console.error(err);
        alert('피드 생성 중 오류가 발생했습니다.');
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">맞춤 피드 만들기</h2>
        <input
          type="text"
          placeholder="피드 이름을 입력하세요"
          value={feedName}
          onChange={(e) => setFeedName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div className="max-h-48 overflow-y-auto mb-4 border border-gray-200 rounded p-2">
          {communities.length === 0 && (
            <p className="text-gray-500 text-center">커뮤니티 목록을 불러오는 중...</p>
          )}
          {communities.map(comm => (
            <label
              key={comm.boardId}
              className="flex items-center space-x-2 mb-2 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={selectedBoards.includes(comm.boardId)}
                onChange={() => handleCheckboxChange(comm.boardId)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-gray-700">{comm.title}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            생성하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomFeedModal;