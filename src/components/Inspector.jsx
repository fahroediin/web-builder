// src/components/Inspector.jsx
import React from 'react';

// DIUBAH: Terima prop 'onDelete'
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
      <div className="style-control">
        <label htmlFor="color">Warna Teks</label>
        <input id="color" type="color" value={component.styles.color} onChange={(e) => handleStyleChange('color', e.target.value)} />
      </div>
      <div className="style-control">
        <label htmlFor="backgroundColor">Warna Latar</label>
        <input id="backgroundColor" type="color" value={component.styles.backgroundColor} onChange={(e) => handleStyleChange('backgroundColor', e.target.value)} />
      </div>
      <div className="style-control">
        <label htmlFor="fontSize">Ukuran Font (px)</label>
        <input id="fontSize" type="number" value={parseInt(component.styles.fontSize)} onChange={(e) => handleNumericStyleChange('fontSize', e.target.value)} />
      </div>
      <div className="style-control">
        <label htmlFor="margin">Margin (px)</label>
        <input id="margin" type="number" value={parseInt(component.styles.margin)} onChange={(e) => handleNumericStyleChange('margin', e.target.value)} />
      </div>
      <div className="style-control">
        <label htmlFor="padding">Padding (px)</label>
        <input id="padding" type="number" value={parseInt(component.styles.padding)} onChange={(e) => handleNumericStyleChange('padding', e.target.value)} />
      </div>

      {/* --- BAGIAN BARU UNTUK TOMBOL HAPUS --- */}
      <div className="delete-section">
        <button className="delete-button" onClick={() => onDelete(component.id)}>
          Hapus Komponen
        </button>
      </div>
      {/* --- AKHIR BAGIAN BARU --- */}
    </div>
  );
}

export default Inspector;