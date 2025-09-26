// src/components/Canvas.jsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const ComponentTree = ({ components, onSelectComponent, selectedComponentId, isPreviewMode }) => {
  if (!components) return null;
  return (
    <SortableContext items={components.map(c => c.id)} strategy={verticalListSortingStrategy}>
      {components.map(comp => (
        <SortableItem
          key={comp.id}
          component={comp}
          // DIUBAH: Teruskan semua prop yang dibutuhkan ke SortableItem
          onSelectComponent={onSelectComponent}
          selectedComponentId={selectedComponentId}
          isPreviewMode={isPreviewMode}
        />
      ))}
    </SortableContext>
  );
};

// DIUBAH: Terima prop selectedComponentId
const SortableItem = ({ component, onSelectComponent, selectedComponentId, isPreviewMode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: component.id,
    disabled: isPreviewMode,
    data: {
      type: component.type === 'container' ? 'container' : 'sortable-item',
      component: component,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    visibility: isDragging ? 'hidden' : 'visible',
  };

  // Hitung isSelected di sini
  const isSelected = !isPreviewMode && component.id === selectedComponentId;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      onClick={(e) => {
        e.stopPropagation();
        if (!isPreviewMode) onSelectComponent(component.id);
      }}
    >
      <RenderedComponent
        component={component}
        isSelected={isSelected} // Teruskan hasil perhitungan
        isPreviewMode={isPreviewMode}
        onSelectComponent={onSelectComponent}
        selectedComponentId={selectedComponentId}
      />
    </div>
  );
};

export const RenderedComponent = ({ component, isSelected, isDraggingOverlay, isPreviewMode, onSelectComponent, selectedComponentId }) => {
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
    display: component.styles?.display,
    flexDirection: component.styles?.flexDirection,
  };

  if (!isPreviewMode) {
    style.border = isSelected ? '2px solid var(--accent-color)' : '1px solid var(--border-color)';
  }

  const className = `canvas-component canvas-component-${component.type}`;

  if (component.type === 'container') {
    return (
      <div style={style} className={className}>
        <ComponentTree 
          components={component.children}
          onSelectComponent={onSelectComponent}
          selectedComponentId={selectedComponentId}
          isPreviewMode={isPreviewMode}
        />
        {!isPreviewMode && component.children?.length === 0 && <p className="empty-container-text">Drop komponen di sini</p>}
      </div>
    );
  }

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
        <ComponentTree 
          components={components}
          onSelectComponent={onSelectComponent}
          selectedComponentId={selectedComponentId}
          isPreviewMode={isPreviewMode}
        />
      )}
    </div>
  );
}

export default Canvas;