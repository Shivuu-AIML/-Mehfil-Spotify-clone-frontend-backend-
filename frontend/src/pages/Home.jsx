import { useEffect, useState } from 'react';
import client from '../api/client';
import AlbumCard from '../components/AlbumCard';
import TrackRow from '../components/TrackRow';
import { useAuth } from '../context/AuthContext';
import './Page.css';

export default function Home() {
  const { user } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([client.get('/music/albums'), client.get('/music/')])
      .then(([albumsRes, tracksRes]) => {
        setAlbums(albumsRes.data.albums || []);
        setTracks(tracksRes.data.musics || tracksRes.data.music || []);
      })
      .catch(() => setError('Could not load the mehfil right now. Try refreshing.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Tuning the instruments…</div>;

  return (
    <div className="main-content">
      <div className="page-hero">
        <span className="page-hero-eyebrow">Welcome, {user?.username}</span>
        <h1 className="page-hero-title">Har mehfil ek kahaani hai — press play, and let this one begin.</h1>
      </div>

      {error && <div className="empty-state">{error}</div>}

      <section>
        <div className="section-header">
          <span className="section-title">Albums</span>
          <span className="section-meta">{albums.length} total</span>
        </div>
        {albums.length === 0 ? (
          <div className="empty-state">No albums yet. Artists can create one from the sidebar.</div>
        ) : (
          <div className="album-grid">
            {albums.map((album) => (
              <AlbumCard key={album._id} album={album} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="section-header">
          <span className="section-title">All tracks</span>
          <span className="section-meta">{tracks.length} total</span>
        </div>
        {tracks.length === 0 ? (
          <div className="empty-state">No tracks uploaded yet.</div>
        ) : (
          <div className="track-list">
            {tracks.map((track, idx) => (
              <TrackRow key={track._id} track={track} index={idx} allTracks={tracks} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
