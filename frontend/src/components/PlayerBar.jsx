import { usePlayer } from '../context/PlayerContext';
import './PlayerBar.css';

function formatTime(sec) {
  if (!sec || Number.isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

export default function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    setVolume,
    togglePlay,
    playNext,
    playPrev,
    seek,
    queueOpen,
    setQueueOpen,
    queue,
  } = usePlayer();

  if (!currentTrack) {
    return (
      <footer className="player-bar player-bar--empty">
        <span>Pick a track from the mehfil to start listening.</span>
      </footer>
    );
  }

  return (
    <footer className="player-bar">
      <div className="player-now-playing">
        <div className={`vinyl ${isPlaying ? 'vinyl--spinning' : ''}`}>
          <div className="vinyl-label" />
        </div>
        <div className="player-track-meta">
          <span className="player-track-title">{currentTrack.title}</span>
          <span className="player-track-artist">{currentTrack.artist?.username || 'Unknown artist'}</span>
        </div>
      </div>

      <div className="player-transport">
        <div className="player-transport-buttons">
          <button onClick={playPrev} aria-label="Previous track" className="transport-btn">
            ⏮
          </button>
          <button onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'} className="transport-btn transport-btn--main">
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button onClick={playNext} aria-label="Next track" className="transport-btn">
            ⏭
          </button>
        </div>
        <div className="player-seek">
          <span className="player-time">{formatTime(progress)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
            className="seek-slider"
            aria-label="Seek"
          />
          <span className="player-time">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-extras">
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="volume-slider"
          aria-label="Volume"
        />
        <button
          className={`queue-toggle ${queueOpen ? 'queue-toggle--active' : ''}`}
          onClick={() => setQueueOpen(!queueOpen)}
          aria-label="Toggle queue"
        >
          Queue · {queue.length}
        </button>
      </div>
    </footer>
  );
}
