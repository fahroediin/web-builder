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
  } = useSortable({ 
    id: component.id,
    // DIHAPUS: Konfigurasi 'activationConstraint' yang lama sudah dihapus dari sini.
    // Pengaturan sekarang dilakukan secara global di App.jsx
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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

const RenderedComponent = ({ component, isSelected }) => {
  const style = {
    border: isSelected ? '2px solid #007bff' : '1px solid #ccc',
    cursor: 'grab',
    color: component.styles.color,
    backgroundColor: component.styles.backgroundColor,
    fontSize: component.styles.fontSize,
    margin: component.styles.margin,
    padding: component.styles.padding,
    userSelect: 'none', 
  };

  switch (component.type) {
    case 'heading':
      return <h1 style={style}>{component.content}</h1>;
    case 'button':
      return <button style={style}>{component.content}</button>;
    case 'paragraph':
      return <p style={style}>{component.content}</p>;
    default:
      return null;
  }
};

function Canvas({ components, onSelectComponent, selectedComponentId }) {
  const { setNodeRef } = useDroppable({
    id: 'canvas',
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