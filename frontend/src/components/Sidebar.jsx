import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sidebar">
      <button
        className={`nav-button ${isActive('/dashboard') ? 'active' : ''}`}
        onClick={() => navigate('/dashboard')}
      >
        Dashboard
      </button>
      <button
        className={`nav-button ${isActive('/decks') ? 'active' : ''}`}
        onClick={() => navigate('/decks')}
      >
        All Decks
      </button>
    </nav>
  );
}

export default Sidebar;
