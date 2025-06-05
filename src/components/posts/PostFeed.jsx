import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../../redux/boardSlice';

const PostFeed = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.board.posts);
  const status = useSelector((state) => state.board.status);
  const [page, setPage] = useState(1);
  const observer = useRef();

  useEffect(() => {
    dispatch(fetchPosts(page));
  }, [dispatch, page]);

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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {posts.map((post, index) => (
        <div
          key={post.id}
          ref={index === posts.length - 1 ? lastPostRef : null}
          className="bg-white rounded shadow"
        >
          <img src={post.download_url} alt={post.author} className="w-full h-60 object-cover" />
          <p className="text-sm text-center p-2">{post.author}</p>
        </div>
      ))}
      {status === 'loading' && <p className="col-span-full text-center">로딩 중...</p>}
    </div>
  );
};

export default PostFeed;
