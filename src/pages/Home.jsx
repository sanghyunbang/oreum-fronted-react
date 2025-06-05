import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainBoard from '../components/board/MainBoard';
import MiniDisplay from '../components/board/MiniDisplay';
import BoardDetail from '../components/board/BoardDetail';


const Home = () => {
    const navigate = useNavigate();
    const [selectedPost, setSelectedPost] = useState(null);

    return(
        <div className="home-container">
      <section className="feed-section">
        <MainBoard onSelectPost={setSelectedPost} />

        {/* 게시글 상세 보여주기 (선택됐을 때만) */}
        {selectedPost && (
          <div className="mt-6">
            <BoardDetail post={selectedPost} onClose={() => setSelectedPost(null)} />
          </div>
        )}
      </section>

      <section className="ranking-section">
        <h2>지금 인기있는 산</h2>
        <ul>
          <li>대둔산</li>
          <li>백운대</li>
          <li>불암산</li>
        </ul>
      </section>

      <section className="map-preview">
        <MiniDisplay />
        <input type="text" placeholder="어느 산을 찾으시나요?" />
        <div className="map-placeholder">[지도 미리보기]</div>

        <button
          style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}
          onClick={() => navigate('/map')}
        >
          등산 지도 전체 보기
        </button>
      </section>
    </div>
  );
};

export default Home;
