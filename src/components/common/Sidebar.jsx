import React from 'react';
import CurationAd from './CurationAd';

const Sidebar = () => {
  return (
    <aside style={{ width: '250px', backgroundColor: '#f5f5f5', padding: '1rem' }}>    
      <CurationAd />
      <div>
        <h4>CUSTOM FEEDS</h4>
        <p>➕ Create a custom feed</p>
      </div>
      <div>
        <h4>RECENT</h4>
        <ul>
          <li>/r/AskReddit</li>
          <li>/r/anime</li>
          <li>/r/smallbusiness</li>
        </ul>
      </div>
      <div>
        <h4>COMMUNITIES</h4>
        <ul>
          <li>🖤 /r/smallbusiness</li>
          <li>🎌 /r/anime</li>
          <li>📢 /r/announce</li>
          <li>🎓 /r/careerguidance</li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
