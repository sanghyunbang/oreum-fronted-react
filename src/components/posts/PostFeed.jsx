import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../../redux/boardSlice';

const PostFeed = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.board.posts);
  const status = useSelector((state) => state.board.status);
  const [page, setPage] = useState(1);
  const observer = useRef();

  const lastPostRef = useCallback(
    (node) => {
      if (status === 'loading') return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [status]
  );

  useEffect(() => {
    dispatch(fetchPosts(page));
  }, [dispatch, page]);

  return (
    <div className="flex flex-col items-center gap-6 px-4">
      {posts.map((post, index) => (
        <div
          key={post.id}
          ref={index === posts.length - 1 ? lastPostRef : null}
          className="w-full max-w-2xl bg-white shadow-md rounded-lg overflow-hidden"
        >
          <img
            src={post.download_url}
            alt={post.author}
            className="w-full h-auto max-h-[500px] object-cover"
          />
          <div className="p-4 text-sm text-gray-800">
            <p className="font-semibold">{post.author}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostFeed;
