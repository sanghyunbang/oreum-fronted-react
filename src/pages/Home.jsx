import React from 'react';
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const navigate = useNavigate();
    return(
        <div className='home-container'>
            <section className="feed-section">
                <h2>피드</h2>
                <div className="feed-post">게시글 1 (예시)</div>
                <div className="feed-post">게시글 2 (예시)</div>
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
                <h2>이번번 주엔 어떤 산으로 갈까요?</h2>
                <input type="text" placeholder="어느 산을 찾으시나요?" />
                <div className="map-placeholder">[지도 미리보기]</div>

                {/* 👉 추가: 지도 페이지로 이동하는 버튼 */}
                <button
                style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}
                onClick={() => navigate('/map')}
                >
                등산 지도 전체 보기
                </button>
            </section>
        </div>

    )
}

export default Home;
