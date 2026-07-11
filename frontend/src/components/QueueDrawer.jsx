import { usePlayer } from '../context/PlayerContext';
import './QueueDrawer.css';

export default function QueueDrawer() {
  const { queue, currentIndex, queueOpen, setQueueOpen, playTrack } = usePlayer();

  if (!queueOpen) return null;

  return (
    <aside className="queue-drawer">
      <div className="queue-drawer-header">
        <span>Up next</span>
        <button onClick={() => setQueueOpen(false)} aria-label="Close queue">
          ✕
        </button>
      </div>
      <div className="queue-drawer-list">
        {queue.length === 0 && <p className="queue-drawer-empty">Nothing queued yet.</p>}
        {queue.map((track, idx) => (
          <button
            key={track._id}
            className={`queue-item ${idx === currentIndex ? 'queue-item--active' : ''}`}
            onClick={() => playTrack(track, queue)}
          >
            <span className="queue-item-index">{idx + 1}</span>
            <div className="queue-item-meta">
              <span className="queue-item-title">{track.title}</span>
              <span className="queue-item-artist">{track.artist?.username || 'Unknown artist'}</span>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
