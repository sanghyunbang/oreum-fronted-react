import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Home from '../pages/Home';

import MapPage from '../pages/MapPage';
import BoardPage from '../pages/BoardPage';
import LoginPage from '../pages/LoginPage';
import JoinPage from '../pages/Join_Page';
import FindPw from '../pages/Find_Pw';
import FindUserid from '../pages/Find_Userid';

import WritePostPage from '../pages/BoardPages/WritePostPage';


import OAuth2RedirectPage from '../pages/Auth/OAuth2RedirectPage';
import GoodsPage from '../pages/GoodsPages/GoodsPage';
import GoodsDetail from '../pages/GoodsPages/GoodsDetail';
import GoodsOrder from '../pages/GoodsPages/GoodsOrder';
import GoodsCart from '../pages/GoodsPages/GoodsCart';
import GoodsDelivery from '../pages/GoodsPages/GoodsDelivery';
import GoodsReview from '../pages/GoodsPages/GoodsReview';
import GoodsLike from '../pages/GoodsPages/GoodsLike';
import GoodsAdd from '../pages/GoodsPages/GoodsAdd';

import BoardDetail from '../components/board/BoardDetail';
import MiniDisplay from '../components/board/MiniDisplay';
import WritePost from '../components/board/WritePost';
import MainBoard from '../components/board/MainBoard';
import MountainDetailPage from '../components/board/MountainDetailPage';
import Mypage from '../pages/Mypage';
import PostEditPage from '../components/board/PostEditPage';
import MyFeedPages from '../pages/CommunityPages/MyFeedPasges';

// 💡 (선택) 로그인 상태 초기화용 컴포넌트
import AuthInit from './AuthInit'; // useEffect로 localStorage 확인하는 컴포넌트
import CommunityPage from '../pages/CommunityPages/CommunityPage';

// curation 글쓰기 전용 페이지
import CurationWritePage from '../pages/BoardPages/CurationWritePage';
import BoardDetailPage from '../pages/BoardPages/BoardDetailPage';


const AppRoutes = () => (
  <Router>
    <AuthInit /> {/* Redux 로그인 여부 초기화 */}
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="board" element={<BoardPage />} />
        <Route path="map" element={<MapPage />} />
        
        {/* 로그인 기능 */}
        <Route path="join" element={<JoinPage />} />
        <Route path="fpw" element={<FindPw />} />
        <Route path="fuid" element={<FindUserid />} />
        {/* 굿즈 기능 */}
        <Route path="Goods" element={<GoodsPage />} />
        <Route path="Goods/GoodsAdd" element={<GoodsAdd />} />
        <Route path="Goods/GoodsDetail/:id" element={<GoodsDetail />} />
        <Route path="Goods/GoodsOrder" element={<GoodsOrder />} />
        <Route path="Goods/GoodsCart" element={<GoodsCart />} />
        <Route path="Goods/GoodsDelivery/" element={<GoodsDelivery />} />
        <Route path="Goods/GoodsReview" element={<GoodsReview />} />
        <Route path="Goods/GoodsLike" element={<GoodsLike />} />

        <Route path="mypage" element={<Mypage />} />
        {/* 게시판 기능 */}

        <Route path='post/:postId' element = {<BoardDetailPage />}/>
        <Route path="feed/write" element={<WritePostPage />} />

        {/* <Route path="post/:postId" element={<BoardDetail />} /> */}
        <Route path="mainboard" element={<MainBoard />} />
        <Route path="minidisplay" element={<MiniDisplay />} />
        <Route path="writepost" element={<WritePost />} />
        <Route path="/post/:postId/edit" element={<PostEditPage />} />
        {/* curation write관련 페이지 */}
        <Route path='writeForCuration' element={<CurationWritePage />} />
        <Route path="mountaindetail" element={<MountainDetailPage />} />

        <Route path="community/:communityName" element={<CommunityPage/>}/>
        <Route path="/feed/:feedname" element={<MyFeedPages/>}/>
      </Route>

      {/* 소셜 로그인 후 리다이렉션 경로 (Layout 없이 따로 렌더링) */}
      <Route path="/oauth2/redirect" element={<OAuth2RedirectPage />} />
    </Routes>
  </Router>
);

export default AppRoutes;
