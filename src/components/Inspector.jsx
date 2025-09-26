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
    onStyleChange(component.id, property, value ? `${value}px` : '0px');
  };

  return (
    <div className="inspector">
      <h3>Properti: {component.type}</h3>
      
      {component.type !== 'container' && (
        <div>
          <label htmlFor="content">Konten Teks</label>
          <input id="content" type="text" value={component.content} onChange={(e) => onContentChange(component.id, e.target.value)} />
        </div>
      )}

      {component.type === 'container' && (
        <>
          <div className="style-control">
            <label htmlFor="flexDirection">Arah</label>
            <select id="flexDirection" value={component.styles?.flexDirection || 'column'} onChange={(e) => handleStyleChange('flexDirection', e.target.value)}>
              <option value="column">Vertikal</option>
              <option value="row">Horizontal</option>
            </select>
          </div>
          <div className="style-control">
            <label htmlFor="justifyContent">Justify Content</label>
            <select id="justifyContent" value={component.styles?.justifyContent || 'flex-start'} onChange={(e) => handleStyleChange('justifyContent', e.target.value)}>
              <option value="flex-start">Start</option>
              <option value="flex-end">End</option>
              <option value="center">Center</option>
              <option value="space-between">Space Between</option>
              <option value="space-around">Space Around</option>
              <option value="space-evenly">Space Evenly</option>
            </select>
          </div>
          <div className="style-control">
            <label htmlFor="alignItems">Align Items</label>
            <select id="alignItems" value={component.styles?.alignItems || 'flex-start'} onChange={(e) => handleStyleChange('alignItems', e.target.value)}>
              <option value="flex-start">Start</option>
              <option value="flex-end">End</option>
              <option value="center">Center</option>
              <option value="stretch">Stretch</option>
              <option value="baseline">Baseline</option>
            </select>
          </div>
          <div className="style-control">
            <label htmlFor="gap">Jarak (Gap) (px)</label>
            <input id="gap" type="number" value={parseInt(component.styles?.gap ?? '10')} onChange={(e) => handleNumericStyleChange('gap', e.target.value)} />
          </div>
        </>
      )}

      <div className="style-control with-reset">
        <label htmlFor="color">Warna Teks</label>
        <div className="input-wrapper">
          <input id="color" type="color" value={component.styles?.color ?? '#000000'} onChange={(e) => handleStyleChange('color', e.target.value)} />
          <button className="reset-button" onClick={() => handleStyleChange('color', null)}>Reset</button>
        </div>
      </div>
      <div className="style-control with-reset">
        <label htmlFor="backgroundColor">Warna Latar</label>
        <div className="input-wrapper">
          <input id="backgroundColor" type="color" value={component.styles?.backgroundColor ?? '#ffffff'} onChange={(e) => handleStyleChange('backgroundColor', e.target.value)} />
          <button className="reset-button" onClick={() => handleStyleChange('backgroundColor', null)}>Reset</button>
        </div>
      </div>
      
      <div className="style-control">
        <label htmlFor="fontSize">Ukuran Font (px)</label>
        <input id="fontSize" type="number" value={parseInt(component.styles?.fontSize ?? '16')} onChange={(e) => handleNumericStyleChange('fontSize', e.target.value)} />
      </div>
      <div className="style-control">
        <label htmlFor="padding">Padding (px)</label>
        <input id="padding" type="number" value={parseInt(component.styles?.padding ?? '10')} onChange={(e) => handleNumericStyleChange('padding', e.target.value)} />
      </div>
      <div className="style-control">
        <label htmlFor="borderRadius">Border Radius (px)</label>
        <input id="borderRadius" type="number" value={parseInt(component.styles?.borderRadius ?? '4')} onChange={(e) => handleNumericStyleChange('borderRadius', e.target.value)} />
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