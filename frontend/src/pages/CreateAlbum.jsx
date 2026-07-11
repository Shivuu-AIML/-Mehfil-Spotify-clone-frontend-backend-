import { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Page.css';
import './ArtistForms.css';

export default function CreateAlbum() {
  const { user } = useAuth();
  const [myTracks, setMyTracks] = useState([]);
  const [title, setTitle] = useState('');
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    client
      .get('/music/')
      .then((res) => {
        const all = res.data.musics || [];
        setMyTracks(all.filter((t) => t.artist?._id === user?._id));
      })
      .catch(() => setError('Could not load your tracks.'))
      .finally(() => setLoading(false));
  }, [user]);

  function toggleTrack(id) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (selected.length === 0) {
      setError('Pick at least one track for the album.');
      return;
    }

    setSubmitting(true);
    try {
      await client.post('/music/album', { title, musicIds: selected });
      setSuccess(`"${title}" has been compiled — a curated set of tracks.`);
      setTitle('');
      setSelected([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create the album.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="page-loading">Gathering your tracks…</div>;

  return (
    <div className="main-content">
      <div className="page-hero">
        <span className="page-hero-eyebrow">Artist tools</span>
        <h1 className="page-hero-title">Compile a set of tracks into an album.</h1>
      </div>

      <div className="form-card">
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        {myTracks.length === 0 ? (
          <div className="empty-state">Upload a track first — an album needs something to hold.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="album-title">Album title</label>
              <input id="album-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="form-field">
              <label>Choose tracks</label>
              <div className="track-picker">
                {myTracks.map((track) => (
                  <label className="track-picker-item" key={track._id}>
                    <input
                      type="checkbox"
                      checked={selected.includes(track._id)}
                      onChange={() => toggleTrack(track._id)}
                    />
                    {track.title}
                  </label>
                ))}
              </div>
            </div>

            <button className="auth-submit" type="submit" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create album'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
