import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">म</span>
        <span className="sidebar-brand-name">Mehfil</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className="sidebar-link">
          Home
        </NavLink>
        {user?.role === 'artist' && (
          <>
            <NavLink to="/upload" className="sidebar-link">
              Upload a track
            </NavLink>
            <NavLink to="/create-album" className="sidebar-link">
              Create an album
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        {user ? (
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{user.username?.[0]?.toUpperCase()}</div>
            <div className="sidebar-user-meta">
              <span className="sidebar-user-name">{user.username}</span>
              <span className="sidebar-user-role">{user.role}</span>
            </div>
            <button className="sidebar-logout" onClick={logout} aria-label="Log out">
              ⎋
            </button>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
