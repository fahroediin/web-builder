// src/components/Toolbar.jsx
import React from 'react';

function Toolbar({ theme, toggleTheme }) {
  return (
    <div className="toolbar">
      <button onClick={toggleTheme} className="theme-toggle-button">
        Ganti ke Mode {theme === 'light' ? 'Gelap' : 'Terang'}
      </button>
    </div>
  );
}

export default Toolbar;