import React from 'react';
import { useSelector } from 'react-redux';

const BoardPage = () => {
  const posts = useSelector((state) => state.board.posts);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>게시판</h2>
      <ul>
        {posts.map((post, idx) => (
          <li key={idx} style={{ padding: '0.5rem 0' }}>
            <strong>{post.author}</strong> - {post.id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoardPage;
