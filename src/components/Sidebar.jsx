// src/components/Sidebar.jsx
import React from 'react';
import { useDraggable } from '@dnd-kit/core';

export function Draggable({ id, children }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
  });

  // DIUBAH: Gunakan 'visibility: hidden'
  const style = {
    visibility: isDragging ? 'hidden' : 'visible',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="draggable-item">
      {children}
    </div>
  );
}

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