// src/components/Canvas.jsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ component, isSelected, onSelectComponent, isPreviewMode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: component.id,
    disabled: isPreviewMode, // INI BENAR DAN DIPERTAHANKAN
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    visibility: isDragging ? 'hidden' : 'visible',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      onClick={() => !isPreviewMode && onSelectComponent(component.id)}
    >
      <RenderedComponent
        component={component}
        isSelected={!isPreviewMode && isSelected}
        isPreviewMode={isPreviewMode}
      />
    </div>
  );
};

export const RenderedComponent = ({ component, isSelected, isDraggingOverlay, isPreviewMode }) => {
  const style = {
    color: component.styles?.color || 'var(--text-primary)',
    backgroundColor: component.styles?.backgroundColor || 'var(--bg-tertiary)',
    border: '1px solid transparent',
    cursor: isPreviewMode ? 'default' : (isDraggingOverlay ? 'grabbing' : 'grab'),
    fontSize: component.styles?.fontSize,
    margin: component.styles?.margin,
    padding: component.styles?.padding,
    userSelect: 'none',
    borderRadius: '4px',
    boxShadow: isDraggingOverlay ? '0 10px 20px rgba(0,0,0,0.2)' : 'none',
  };

  if (!isPreviewMode) {
    style.border = isSelected ? '2px solid var(--accent-color)' : '1px solid var(--border-color)';
  }

  const className = `canvas-component canvas-component-${component.type}`;

  switch (component.type) {
    case 'heading':
      return <h1 style={style} className={className}>{component.content}</h1>;
    case 'button':
      if (!isPreviewMode) {
        style.border = isSelected ? '2px solid var(--accent-color)' : '1px solid var(--border-color)';
      }
      return <button style={style} className={className}>{component.content}</button>;
    case 'paragraph':
      return <p style={style} className={className}>{component.content}</p>;
    default:
      return null;
  }
};

function Canvas({ components, onSelectComponent, selectedComponentId, isPreviewMode }) {
  const { setNodeRef } = useDroppable({
    id: 'canvas',
    data: {
      type: 'canvas-container',
    }
  });

  return (
    <div ref={setNodeRef} className="canvas">
      {components.length === 0 ? (
        <p>Drag komponen dari sidebar ke sini</p>
      ) : (
        <SortableContext items={components} strategy={verticalListSortingStrategy}>
          {components.map(comp => (
            <SortableItem
              key={comp.id}
              component={comp}
              isSelected={comp.id === selectedComponentId}
              onSelectComponent={onSelectComponent}
              isPreviewMode={isPreviewMode}
            />
          ))}
        </SortableContext>
      )}
    </div>
  );
}

export default Canvas;