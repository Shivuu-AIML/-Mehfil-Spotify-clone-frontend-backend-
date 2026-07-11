import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import TrackRow from '../components/TrackRow';
import { usePlayer } from '../context/PlayerContext';
import './Page.css';

export default function AlbumDetail() {
  const { id } = useParams();
  const { playTrack } = usePlayer();
  const [album, setAlbum] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    client
      .get(`/music/albums/${id}`)
      .then((res) => setAlbum(res.data.album))
      .catch(() => setError('Could not find that album.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-loading">Cueing up the album…</div>;

  if (error || !album) {
    return (
      <div className="main-content">
        <Link to="/" className="back-link">
          ← Back to home
        </Link>
        <div className="empty-state">{error || 'Album not found.'}</div>
      </div>
    );
  }

  const tracks = album.musicIds || [];

  return (
    <div className="main-content">
      <Link to="/" className="back-link">
        ← Back to home
      </Link>
      <div className="page-hero">
        <span className="page-hero-eyebrow">Album · {album.artist?.username || 'Unknown artist'}</span>
        <h1 className="page-hero-title">{album.title}</h1>
      </div>

      {tracks.length > 0 && (
        <button className="auth-submit" style={{ width: 'auto', padding: '10px 22px', marginBottom: 24 }} onClick={() => playTrack(tracks[0], tracks)}>
          ▶ Play album
        </button>
      )}

      {tracks.length === 0 ? (
        <div className="empty-state">No tracks in this album yet.</div>
      ) : (
        <div className="track-list">
          {tracks.map((track, idx) => (
            <TrackRow key={track._id} track={track} index={idx} allTracks={tracks} />
          ))}
        </div>
      )}
    </div>
  );
}
