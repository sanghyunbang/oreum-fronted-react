import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../../redux/boardSlice';

const MainFeedPage = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.board.posts);
  const status = useSelector((state) => state.board.status);
  const [page, setPage] = useState(1);
  const observer = useRef();

  const lastPostRef = useCallback((node) => {
    if (status === 'loading') return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [status]);

  useEffect(() => {
    dispatch(fetchPosts(page));
  }, [dispatch, page]);

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {posts.map((post, index) => (
        <div
          key={post.id}
          ref={index === posts.length - 1 ? lastPostRef : null}
          className="bg-white shadow-md rounded-md overflow-hidden"
        >
          <img src={post.download_url} alt={post.author} className="w-full h-60 object-cover" />
          <div className="p-2 text-sm text-gray-800">
            <p>{post.author}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainFeedPage;
