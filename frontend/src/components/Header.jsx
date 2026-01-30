import React from 'react';

function Header() {
  return (
    <header className="header">
      <div className="header-logo">Flashdecks</div>
      <div className="header-right">
        <span className="streak-display">STREAK : 7</span>
        <button className="icon-button" title="Toggle theme (not functional)">
          💡
        </button>
      </div>
    </header>
  );
}

export default Header;
