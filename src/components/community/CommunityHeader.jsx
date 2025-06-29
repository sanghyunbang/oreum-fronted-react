import { Link } from "react-router-dom";

const CommunityHeader = ({ community }) => {
  return (
    <div className="flex items-center justify-between border-b pb-4 mb-6">
      <div>
        {/* 제목을 클릭하면 이동 */}
        <Link to={`/community/${community.title}`}>
          <h1 className="text-3xl font-bold text-blue-600 hover:underline cursor-pointer">
            {community.title}
          </h1>
        </Link>

        <p className="text-gray-500">{community.description}</p>
      </div>
    </div>
  );
};

export default CommunityHeader;
