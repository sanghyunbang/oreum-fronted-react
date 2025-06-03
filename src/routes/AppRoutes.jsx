import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Home from '../pages/Home';
import MapPage from '../pages/MapPage';
import BoardPage from '../pages/BoardPage';
import LoginPage from '../pages/LoginPage';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="board" element={<BoardPage />} />
        <Route path="map" element={<MapPage />} /> {/* 지도 페이지 */}
        <Route path="login" element={<LoginPage />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRoutes;
