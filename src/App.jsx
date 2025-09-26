// src/App.jsx

import React, { useState, useEffect } from 'react';
// DIUBAH: Import sensor dari dnd-kit
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';

import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import Inspector from './components/Inspector';
import './App.css';

function App() {
  const [canvasComponents, setCanvasComponents] = useState(() => {
    const saved = localStorage.getItem('canvasComponents');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedComponentId, setSelectedComponentId] = useState(null);

  // BARU: Konfigurasi sensor
  // Ini akan mengaktifkan drag hanya jika mouse digeser lebih dari 10 piksel.
  // Klik biasa tidak akan memicu drag.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  useEffect(() => {
    localStorage.setItem('canvasComponents', JSON.stringify(canvasComponents));
  }, [canvasComponents]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const isSidebarComponent = ['heading', 'button', 'paragraph'].includes(active.id);
    if (isSidebarComponent) {
      const isDroppingInCanvas = over.id === 'canvas' || canvasComponents.some(c => c.id === over.id);
      if (isDroppingInCanvas) {
        const newComponent = {
          id: uuidv4(), type: active.id, content: `Ini adalah ${active.id}`,
          styles: { color: '#000000', backgroundColor: '#ffffff', fontSize: '16px', margin: '10px', padding: '10px' },
        };
        setCanvasComponents((prev) => [...prev, newComponent]);
        return;
      }
    }
    const isMovingCanvasComponent = canvasComponents.some(c => c.id === active.id);
    const isTargetCanvasComponent = canvasComponents.some(c => c.id === over.id);
    if (isMovingCanvasComponent && isTargetCanvasComponent) {
      const oldIndex = canvasComponents.findIndex(c => c.id === active.id);
      const newIndex = canvasComponents.findIndex(c => c.id === over.id);
      if (oldIndex !== newIndex) {
        setCanvasComponents(components => arrayMove(components, oldIndex, newIndex));
      }
    }
  };
  
  const selectedComponent = canvasComponents.find(c => c.id === selectedComponentId);

  const updateComponentContent = (id, newContent) => {
    setCanvasComponents(prev => 
      prev.map(c => c.id === id ? { ...c, content: newContent } : c)
    );
  };

  const updateComponentStyle = (id, property, value) => {
    setCanvasComponents(prev =>
      prev.map(c =>
        c.id === id ? { ...c, styles: { ...c.styles, [property]: value } } : c
      )
    );
  };

  const deleteComponent = (id) => {
    setCanvasComponents(prev => prev.filter(c => c.id !== id));
    setSelectedComponentId(null);
  };

  return (
    // DIUBAH: Tambahkan prop 'sensors' yang sudah kita definisikan
    <DndContext 
      sensors={sensors} 
      onDragEnd={handleDragEnd} 
      collisionDetection={closestCenter}
    >
      <div className="app-container">
        <Sidebar />
        <Canvas 
          components={canvasComponents} 
          onSelectComponent={setSelectedComponentId}
          selectedComponentId={selectedComponentId}
        />
        <Inspector 
          component={selectedComponent}
          onContentChange={updateComponentContent}
          onStyleChange={updateComponentStyle}
          onDelete={deleteComponent}
        />
      </div>
    </DndContext>
  );
}

export default App;