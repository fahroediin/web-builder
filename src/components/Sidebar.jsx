// src/components/Sidebar.jsx
import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';

export function Draggable({ id, children, isPreviewMode }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
    disabled: isPreviewMode,
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

function Sidebar({ isPreviewMode }) {
  const { setNodeRef } = useDroppable({
    id: 'sidebar-container',
  });

  return (
    <div ref={setNodeRef} className="sidebar">
      <h3>Layout</h3>
      {/* --- BAGIAN BARU --- */}
      <Draggable id="2-columns" isPreviewMode={isPreviewMode}>2 Kolom</Draggable>
      <Draggable id="3-columns" isPreviewMode={isPreviewMode}>3 Kolom</Draggable>
      
      <h3>Komponen Dasar</h3>
      <Draggable id="container" isPreviewMode={isPreviewMode}>Container (Div)</Draggable>
      <Draggable id="heading" isPreviewMode={isPreviewMode}>Judul (Heading)</Draggable>
      <Draggable id="button" isPreviewMode={isPreviewMode}>Tombol (Button)</Draggable>
      <Draggable id="paragraph" isPreviewMode={isPreviewMode}>Paragraf</Draggable>
    </div>
  );
}

export default Sidebar;