const CommunityStats = ({community}) => {
    return(
        <div className="flex justify-between items-center mb-6">
            <div>
                <p className="text-sm text-gray-500">
                    📅 created: {community.createdAt}
                </p>
                <p className="text-sm text-gray-500">
                    🌐 {community.isPrivate ? "Private" : "Public"}
                </p>                
            </div>
            <div>
                <button className="text-sm text-blue-500 underline">Edit</button>
            </div>
        </div>
    );
}

export default CommunityStats;