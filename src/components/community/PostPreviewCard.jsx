const PostPreviewCard = ({post}) => {
    return(
        <div className="border p-4 rounded shadow-sm hover:shadow">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-500 text-sm">{post.content.substring(0,100)}</p>
        </div>
    );
};

export default PostPreviewCard;