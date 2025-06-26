import React from "react";
import CommentItem from "./CommentItem";

// 댓글 트리를 구성하는 유틸
const buildCommentTree = (comments) => {
  const map = {};
  const roots = [];

  comments.forEach((c) => {
    c.replies = [];
    map[c.commentId] = c;
  });

  comments.forEach((c) => {
    if (c.parentId) {
      map[c.parentId]?.replies.push(c);
    } else {
      roots.push(c);
    }
  });

  return roots;
};

function CommentList({ comments = [], userInfo, postId, setPost }) {
  const commentTree = buildCommentTree(comments);

  return (
    <section>
      <h2 className="text-lg font-semibold mb-2">댓글 ({comments.length})</h2>
      {commentTree.length > 0 ? (
        commentTree.map((comment) => (
          <CommentItem
            key={comment.commentId}
            comment={comment}
            depth={0}
            userInfo={userInfo}
            postId={postId}
            setPost={setPost}
          />
        ))
      ) : (
        <p className="text-gray-500">댓글이 없습니다.</p>
      )}
    </section>
  );
}

export default CommentList;
