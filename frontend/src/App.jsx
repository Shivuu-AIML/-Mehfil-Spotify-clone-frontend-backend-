import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import PlayerBar from './components/PlayerBar';
import QueueDrawer from './components/QueueDrawer';
import { ProtectedRoute, ArtistRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AlbumDetail from './pages/AlbumDetail';
import Upload from './pages/Upload';
import CreateAlbum from './pages/CreateAlbum';

function AppShell() {
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/album/:id" element={<AlbumDetail />} />
              <Route
                path="/upload"
                element={
                  <ArtistRoute>
                    <Upload />
                  </ArtistRoute>
                }
              />
              <Route
                path="/create-album"
                element={
                  <ArtistRoute>
                    <CreateAlbum />
                  </ArtistRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <QueueDrawer />
        </div>
        <PlayerBar />
      </div>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="page-loading">Loading Mehfil…</div>;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <ProtectedRoute>
      <AppShell />
    </ProtectedRoute>
  );
}
