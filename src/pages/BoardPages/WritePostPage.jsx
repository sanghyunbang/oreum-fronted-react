import React from 'react';
import WritePost from '../../components/board/WritePost';

const WritePostPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">게시글 작성</h1>
      <WritePost />
    </div>
  );
};

export default WritePostPage;