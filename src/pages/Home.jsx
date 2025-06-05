// src/pages/Home.jsx
import React from 'react';
import PostFeed from '../components/posts/PostFeed';

const Home = () => {
  return (
    <div className="flex flex-col gap-4">
      <div style={{ marginTop: '120px' }}> {/* 배너 높이만큼 margin */}
        <PostFeed />
      </div>
    </div>
  );
};


export default Home;
