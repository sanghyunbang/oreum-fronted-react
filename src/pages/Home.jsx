// src/pages/Home.jsx
import React from 'react';
import PostFeed from '../components/posts/PostFeed';
import MainBoard from '../components/board/MainBoard';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-full max-w-5xl">
        <MainBoard />
      </div>
    </div>
  );
};


export default Home;
