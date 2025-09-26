// src/components/Inspector.jsx
import React from 'react';

function Inspector({ component, onContentChange, onStyleChange, onDelete }) {
  if (!component) {
    return (
      <div className="inspector">
        <h3>Properti</h3>
        <p>Pilih sebuah komponen untuk diedit.</p>
      </div>
    );
  }

  const handleStyleChange = (property, value) => {
    onStyleChange(component.id, property, value);
  };

  const handleNumericStyleChange = (property, value) => {
    onStyleChange(component.id, property, `${value}px`);
  };

  return (
    <div className="inspector">
      <h3>Properti: {component.type}</h3>
      <div>
        <label htmlFor="content">Konten Teks</label>
        <input id="content" type="text" value={component.content} onChange={(e) => onContentChange(component.id, e.target.value)} />
      </div>

      <div className="style-control with-reset">
        <label htmlFor="color">Warna Teks</label>
        <div className="input-wrapper">
          {/* DIUBAH: Gunakan optional chaining (?.) */}
          <input id="color" type="color" value={component.styles?.color ?? '#000000'} onChange={(e) => handleStyleChange('color', e.target.value)} />
          <button className="reset-button" onClick={() => handleStyleChange('color', null)}>Reset</button>
        </div>
      </div>
      <div className="style-control with-reset">
        <label htmlFor="backgroundColor">Warna Latar</label>
        <div className="input-wrapper">
          {/* DIUBAH: Gunakan optional chaining (?.) */}
          <input id="backgroundColor" type="color" value={component.styles?.backgroundColor ?? '#ffffff'} onChange={(e) => handleStyleChange('backgroundColor', e.target.value)} />
          <button className="reset-button" onClick={() => handleStyleChange('backgroundColor', null)}>Reset</button>
        </div>
      </div>
      
      <div className="style-control">
        <label htmlFor="fontSize">Ukuran Font (px)</label>
        {/* DIUBAH: Gunakan optional chaining (?.) */}
        <input id="fontSize" type="number" value={parseInt(component.styles?.fontSize ?? '16')} onChange={(e) => handleNumericStyleChange('fontSize', e.target.value)} />
      </div>
      <div className="style-control">
        <label htmlFor="margin">Margin (px)</label>
        {/* DIUBAH: Gunakan optional chaining (?.) */}
        <input id="margin" type="number" value={parseInt(component.styles?.margin ?? '10')} onChange={(e) => handleNumericStyleChange('margin', e.target.value)} />
      </div>
      <div className="style-control">
        <label htmlFor="padding">Padding (px)</label>
        {/* DIUBAH: Gunakan optional chaining (?.) */}
        <input id="padding" type="number" value={parseInt(component.styles?.padding ?? '10')} onChange={(e) => handleNumericStyleChange('padding', e.target.value)} />
      </div>

      <div className="delete-section">
        <button className="delete-button" onClick={() => onDelete(component.id)}>
          Hapus Komponen
        </button>
      </div>
    </div>
  );
}

export default Inspector;