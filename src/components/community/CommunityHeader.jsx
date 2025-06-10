const CommunityHeader = ({ community }) => {
    return(
        <div className="flex items-center justify-between border-b pb-4 mb-6">
            <div>
                <h1 className="text-3xl font-bold">{community.name}</h1>
                <p className="text-gray-500">{community.description}</p>
            </div>
        </div>
    );
};

export default CommunityHeader;