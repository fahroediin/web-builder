// src/components/Sidebar.jsx
import React from 'react';
import { useDraggable } from '@dnd-kit/core';

// Komponen kecil yang bisa di-drag
function Draggable({ id, children }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="draggable-item">
      {children}
    </div>
  );
}

// Komponen Sidebar utama
function Sidebar() {
  return (
    <div className="sidebar">
      <h3>Komponen</h3>
      <Draggable id="heading">Judul (Heading)</Draggable>
      <Draggable id="button">Tombol (Button)</Draggable>
      <Draggable id="paragraph">Paragraf</Draggable>
    </div>
  );
}

export default Sidebar;