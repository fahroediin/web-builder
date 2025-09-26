// src/components/Sidebar.jsx
import React from 'react';
// DIUBAH: Import useDroppable
import { useDraggable, useDroppable } from '@dnd-kit/core';

export function Draggable({ id, children }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
  });

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
  // BARU: Jadikan sidebar sebagai droppable container
  const { setNodeRef } = useDroppable({
    id: 'sidebar-container', // Beri ID unik
  });

  return (
    // DIUBAH: Terapkan ref ke div utama sidebar
    <div ref={setNodeRef} className="sidebar">
      <h3>Komponen</h3>
      <Draggable id="heading">Judul (Heading)</Draggable>
      <Draggable id="button">Tombol (Button)</Draggable>
      <Draggable id="paragraph">Paragraf</Draggable>
    </div>
  );
}

export default Sidebar;