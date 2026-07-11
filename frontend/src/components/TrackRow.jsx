import { usePlayer } from '../context/PlayerContext';
import './TrackRow.css';

export default function TrackRow({ track, index, allTracks }) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const isActive = currentTrack?._id === track._id;

  function handleClick() {
    if (isActive) {
      togglePlay();
    } else {
      playTrack(track, allTracks);
    }
  }

  return (
    <button className={`track-row ${isActive ? 'track-row--active' : ''}`} onClick={handleClick}>
      <span className="track-row-index">
        {isActive && isPlaying ? '♫' : index + 1}
      </span>
      <div className="track-row-meta">
        <span className="track-row-title">{track.title}</span>
        <span className="track-row-artist">{track.artist?.username || 'Unknown artist'}</span>
      </div>
    </button>
  );
}
