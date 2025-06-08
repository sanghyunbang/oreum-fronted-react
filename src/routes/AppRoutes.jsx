import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Home from '../pages/Home';
import MapPage from '../pages/MapPage';
import BoardPage from '../pages/BoardPage';
import LoginPage from '../pages/LoginPage';
import JoinPage from '../pages/Join_Page';
import FindPw from '../pages/Find_Pw';
import FindUserid from '../pages/Find_Userid';

import MainFeedPage from '../pages/BoardPages/MainFeedPage';
import PostDetailPage from '../pages/BoardPages/PostDetailPage';
import WritePostPage from '../pages/BoardPages/WritePostPage';
import OAuth2RedirectPage from '../pages/Auth/OAuth2RedirectPage';

// 💡 (선택) 로그인 상태 초기화용 컴포넌트
import AuthInit from './AuthInit'; // useEffect로 localStorage 확인하는 컴포넌트

const AppRoutes = () => (
  <Router>
    <AuthInit /> {/* Redux 로그인 여부 초기화 */}
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="board" element={<BoardPage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="join" element={<JoinPage />} />
        <Route path="fpw" element={<FindPw />} />
        <Route path="fuid" element={<FindUserid />} />

        {/* 게시판 기능 */}
        <Route path="feed" element={<MainFeedPage />} />
        <Route path="feed/:id" element={<PostDetailPage />} />
        <Route path="feed/write" element={<WritePostPage />} />
      </Route>

      {/* 소셜 로그인 후 리다이렉션 경로 (Layout 없이 따로 렌더링) */}
      <Route path="/oauth2/redirect" element={<OAuth2RedirectPage />} />
    </Routes>
  </Router>
);

export default AppRoutes;
