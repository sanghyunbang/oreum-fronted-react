import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Home from '../pages/Home';
import MapPage from '../pages/MapPage';
import BoardPage from '../pages/BoardPage';
import LoginPage from '../pages/LoginPage';
import JoinPage from '../pages/Join_Page';
import FindPw from '../pages/Find_Pw';
import FindUserid from '../pages/Find_Userid';

// 새로 만든 페이지 import
import MainFeedPage from '../pages/BoardPages/MainFeedPage';
import PostDetailPage from '../pages/BoardPages/PostDetailPage';
import WritePostPage from '../pages/BoardPages/WritePostPage';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="board" element={<BoardPage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="join" element={<JoinPage />} />
        <Route path="fpw" element={<FindPw />} />
        <Route path="fuid" element={<FindUserid />} />

        {/* 새로 추가된 라우트들 */}
        <Route path="feed" element={<MainFeedPage />} />
        <Route path="feed/:id" element={<PostDetailPage />} />
        <Route path="feed/write" element={<WritePostPage />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRoutes;
