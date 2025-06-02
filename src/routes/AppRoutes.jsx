import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Home from '../pages/Home';
import MapPage from '../pages/MapPage';
import BoardPage from '../pages/BoardPage';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="board" element={<BoardPage />} />
        <Route path="map" element={<MapPage />} /> {/* 지도 페이지 */}
      </Route>
    </Routes>
  </Router>
);

export default AppRoutes;
