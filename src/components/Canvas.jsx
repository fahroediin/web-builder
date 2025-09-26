// src/components/Canvas.jsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ component, isSelected, onSelectComponent }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: component.id,
    // BARU: Tandai item ini sebagai 'sortable-item'
    data: {
      type: 'sortable-item',
      component: component,
    }
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
      onClick={() => onSelectComponent(component.id)}
    >
      <RenderedComponent
        component={component}
        isSelected={isSelected}
      />
    </div>
  );
};

export const RenderedComponent = ({ component, isSelected, isDraggingOverlay }) => {
  const style = {
    color: component.styles?.color || 'var(--text-primary)',
    backgroundColor: component.styles?.backgroundColor || 'var(--bg-tertiary)',
    border: isSelected ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
    cursor: isDraggingOverlay ? 'grabbing' : 'grab',
    fontSize: component.styles?.fontSize,
    margin: component.styles?.margin,
    padding: component.styles?.padding,
    userSelect: 'none',
    borderRadius: '4px',
    boxShadow: isDraggingOverlay ? '0 10px 20px rgba(0,0,0,0.2)' : 'none',
  };

  const className = `canvas-component canvas-component-${component.type}`;

  switch (component.type) {
    case 'heading':
      return <h1 style={style} className={className}>{component.content}</h1>;
    case 'button':
      style.border = isSelected ? '2px solid var(--accent-color)' : '1px solid var(--border-color)';
      return <button style={style} className={className}>{component.content}</button>;
    case 'paragraph':
      return <p style={style} className={className}>{component.content}</p>;
    default:
      return null;
  }
};

function Canvas({ components, onSelectComponent, selectedComponentId }) {
  const { setNodeRef } = useDroppable({
    id: 'canvas',
    // BARU: Tandai area ini sebagai 'canvas-container'
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
            />
          ))}
        </SortableContext>
      )}
    </div>
  );
}

export default Canvas;