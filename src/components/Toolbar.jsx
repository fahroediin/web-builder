// src/components/Toolbar.jsx
import React from 'react';

function Toolbar({ theme, toggleTheme, isPreviewMode, togglePreviewMode }) {
  return (
    <div className="toolbar">
      <button onClick={togglePreviewMode} className="preview-toggle-button">
        {isPreviewMode ? 'Kembali ke Editor' : 'Pratinjau'}
      </button>

      <button onClick={toggleTheme} className="theme-toggle-button">
        Ganti ke Mode {theme === 'light' ? 'Gelap' : 'Terang'}
      </button>
    </div>
  );
}

export default Toolbar;