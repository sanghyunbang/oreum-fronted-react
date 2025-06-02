import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectPost } from '../redux/boardSlice';

const BoardPage = () => {
  const posts = useSelector((state) => state.board.posts);
  const dispatch = useDispatch();

  const handleSelectPost = (post) => {
    dispatch(selectPost(post));
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>게시판</h2>
      <ul>
        {posts.map((post, idx) => (
          <li key={idx} onClick={() => handleSelectPost(post)} style={{ cursor: 'pointer', padding: '0.5rem 0' }}>
            <strong>{post.title}</strong> - {post.content.slice(0, 50)}...
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoardPage;
