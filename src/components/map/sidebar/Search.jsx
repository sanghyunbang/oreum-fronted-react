const Search = () => {
  return (
    <div
      className="p-5 font-sans bg-gray-100"
      style={{ width: '100%', maxWidth: '360px', overflow: 'visible' }}
    >
      <h2 className="text-m font-semibold leading-snug mb-4">
        이번 주엔 어느 산으로 갈까요?
      </h2>

      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="어느 산을 찾으시나요?"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm outline-none min-w-0"
        />
        <button className="ml-2 bg-green-500 text-white p-2 rounded-full text-lg hover:bg-green-600 flex-shrink-0">
          🔍
        </button>
      </div>

      <div className="overflow-x-auto pb-1 min-w-0">
        <div className="flex gap-2 w-max">
          {['관악산', '도봉산', '북한산'].map((name, idx) => (
            <div
              key={idx}
              className="bg-gray-200 px-4 py-2 rounded-full text-sm whitespace-nowrap cursor-pointer"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
