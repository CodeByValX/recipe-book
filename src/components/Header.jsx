import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  async function handleLogout() {
    setError('');
    try {
      await logout();
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          🍲 Recipe Book
        </Link>
        <nav className="nav" aria-label="Main navigation">
          <NavLink to="/recipes" end className={linkClass}>
            Recipes
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/recipes/create" className={linkClass}>
                Add recipe
              </NavLink>
              <NavLink to="/my-recipes" className={linkClass}>
                My recipes
              </NavLink>
              <span className="nav-user">Hi, {username}</span>
              <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
      {error && <div className="container"><p className="alert alert-error">{error}</p></div>}
    </header>
  );
}
