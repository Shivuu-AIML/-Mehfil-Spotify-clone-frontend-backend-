import { Link } from 'react-router-dom';
import './AlbumCard.css';

export default function AlbumCard({ album }) {
  return (
    <Link to={`/album/${album._id}`} className="album-card">
      <div className="album-card-art">
        <span className="album-card-art-glyph">♪</span>
      </div>
      <span className="album-card-title">{album.title}</span>
      <span className="album-card-count">{album.musicIds?.length || 0} tracks</span>
    </Link>
  );
}
