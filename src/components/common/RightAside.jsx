
import React from 'react';

const RightAside = () => {
    return (
      <aside className="w-[300px] p-4 bg-white rounded shadow text-sm">
        <h4 className="font-semibold mb-2">이번주엔 어디로 갈까요?</h4>
        <input
          type="text"
          placeholder="어느 산을 찾으시나요?"
          className="w-full px-3 py-2 border rounded text-sm mb-4"
        />
        <ul className="space-y-2">
          <li>🌄 지리산</li>
          <li>🌄 북한산</li>
          <li>🌄 한라산</li>
        </ul>
        <button className="text-blue-600 text-sm mt-4 hover:underline">전체 보기 →</button>
      </aside>
    );
  }; 

  export default RightAside;