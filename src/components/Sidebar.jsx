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
      <h3>Komponen</h3>
      <Draggable id="container" isPreviewMode={isPreviewMode}>Container (Div)</Draggable>
      <Draggable id="heading" isPreviewMode={isPreviewMode}>Judul (Heading)</Draggable>
      <Draggable id="button" isPreviewMode={isPreviewMode}>Tombol (Button)</Draggable>
      <Draggable id="paragraph" isPreviewMode={isPreviewMode}>Paragraf</Draggable>
    </div>
  );
}

export default Sidebar;