// src/App.jsx

import React, { useState, useEffect } from 'react';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';

import Sidebar, { Draggable } from './components/Sidebar';
import Canvas, { RenderedComponent } from './components/Canvas';
import Inspector from './components/Inspector';
import Toolbar from './components/Toolbar';
import './App.css';

function App() {
  const [canvasComponents, setCanvasComponents] = useState(() => {
    const saved = localStorage.getItem('canvasComponents');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [activeComponent, setActiveComponent] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

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

  function handleDragStart(event) {
    const { active } = event;
    const component = canvasComponents.find(c => c.id === active.id);
    setActiveComponent(component || { type: active.id, id: active.id }); // Beri ID sementara
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveComponent(null);
    if (!over) return;

    const isSidebarComponent = ['heading', 'button', 'paragraph'].includes(active.id);
    
    // DIPERBAIKI: Kondisi penambahan komponen lebih ketat
    if (isSidebarComponent && over) {
      const isDroppingInCanvas = over.id === 'canvas' || canvasComponents.some(c => c.id === over.id);
      if (isDroppingInCanvas) {
        const newComponent = {
          id: uuidv4(), type: active.id, content: `Ini adalah ${active.id}`,
          styles: { color: null, backgroundColor: null, fontSize: '16px', margin: '10px', padding: '10px' },
        };
        setCanvasComponents((prev) => [...prev, newComponent]);
        return;
      }
    }

    const isMovingCanvasComponent = canvasComponents.some(c => c.id === active.id);
    const isTargetCanvasComponent = canvasComponents.some(c => c.id === over.id);
    if (isMovingCanvasComponent && isTargetCanvasComponent && active.id !== over.id) {
      const oldIndex = canvasComponents.findIndex(c => c.id === active.id);
      const newIndex = canvasComponents.findIndex(c => c.id === over.id);
      setCanvasComponents(components => arrayMove(components, oldIndex, newIndex));
    }
  };
  
  const selectedComponent = canvasComponents.find(c => c.id === selectedComponentId);
  const updateComponentContent = (id, newContent) => { setCanvasComponents(prev => prev.map(c => c.id === id ? { ...c, content: newContent } : c)); };
  const updateComponentStyle = (id, property, value) => { setCanvasComponents(prev => prev.map(c => c.id === id ? { ...c, styles: { ...c.styles, [property]: value } } : c)); };
  const deleteComponent = (id) => { setCanvasComponents(prev => prev.filter(c => c.id !== id)); setSelectedComponentId(null); };

  return (
    <div className="app-wrapper">
      <Toolbar theme={theme} toggleTheme={toggleTheme} />
      <DndContext 
        sensors={sensors} 
        onDragStart={handleDragStart}
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
        
        {/* DIUBAH: DragOverlay sekarang digunakan untuk semua jenis drag */}
        <DragOverlay dropAnimation={null}>
          {activeComponent ? (
            canvasComponents.some(c => c.id === activeComponent.id) ? (
              // Jika komponen dari canvas, render dengan RenderedComponent
              <RenderedComponent component={activeComponent} isDraggingOverlay={true} />
            ) : (
              // Jika komponen dari sidebar, render dengan Draggable
              <div className="draggable-item-overlay">
                {activeComponent.type === 'heading' && 'Judul (Heading)'}
                {activeComponent.type === 'button' && 'Tombol (Button)'}
                {activeComponent.type === 'paragraph' && 'Paragraf'}
              </div>
            )
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default App;