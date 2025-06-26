import React from "react";

function PostContent({ content }) {
  return (
    <article
      className="prose max-w-none mb-6"
      style={{ minHeight: "300px" }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export default PostContent;
