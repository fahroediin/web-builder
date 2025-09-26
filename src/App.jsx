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
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const togglePreviewMode = () => {
    setIsPreviewMode(prev => !prev);
    setSelectedComponentId(null);
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
    if (isPreviewMode) return;
    const { active } = event;
    const component = canvasComponents.find(c => c.id === active.id);
    setActiveComponent(component || { type: active.id, id: active.id });
  }

  function handleDragEnd(event) {
    setActiveComponent(null);
    if (isPreviewMode) return;

    const { active, over } = event;
    if (!over || over.id === 'sidebar-container') return;

    const isSidebarComponent = ['heading', 'button', 'paragraph'].includes(active.id);
    const isCanvasComponent = canvasComponents.some(c => c.id === active.id);

    if (isSidebarComponent) {
      const isDroppingInCanvasArea = over.id === 'canvas' || canvasComponents.some(c => c.id === over.id);
      if (isDroppingInCanvasArea) {
        const newComponent = {
          id: uuidv4(), type: active.id, content: `Ini adalah ${active.id}`,
          styles: { color: null, backgroundColor: null, fontSize: '16px', margin: '10px', padding: '10px' },
        };
        setCanvasComponents((prev) => [...prev, newComponent]);
      }
    } 
    else if (isCanvasComponent) {
      const isTargetInCanvas = canvasComponents.some(c => c.id === over.id);
      if (isTargetInCanvas && active.id !== over.id) {
        const oldIndex = canvasComponents.findIndex(c => c.id === active.id);
        const newIndex = canvasComponents.findIndex(c => c.id === over.id);
        setCanvasComponents(components => arrayMove(components, oldIndex, newIndex));
      }
    }
  };
  
  const selectedComponent = canvasComponents.find(c => c.id === selectedComponentId);
  const updateComponentContent = (id, newContent) => { setCanvasComponents(prev => prev.map(c => c.id === id ? { ...c, content: newContent } : c)); };
  const updateComponentStyle = (id, property, value) => { setCanvasComponents(prev => prev.map(c => c.id === id ? { ...c, styles: { ...c.styles, [property]: value } } : c)); };
  const deleteComponent = (id) => { setCanvasComponents(prev => prev.filter(c => c.id !== id)); setSelectedComponentId(null); };

  return (
    <div className="app-wrapper">
      <Toolbar 
        theme={theme} 
        toggleTheme={toggleTheme}
        isPreviewMode={isPreviewMode}
        togglePreviewMode={togglePreviewMode}
      />
      <DndContext 
        sensors={sensors} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd} 
        collisionDetection={closestCenter}
      >
        <div className={`app-container ${isPreviewMode ? 'preview-mode' : ''}`}>
          {/* --- PERBAIKAN KUNCI ADA DI SINI --- */}
          {/* Tambahkan kembali kondisi untuk menyembunyikan Sidebar */}
          {!isPreviewMode && <Sidebar isPreviewMode={isPreviewMode} />}
          
          <Canvas 
            components={canvasComponents} 
            onSelectComponent={setSelectedComponentId}
            selectedComponentId={selectedComponentId}
            isPreviewMode={isPreviewMode}
          />

          {/* Kondisi untuk Inspector sudah benar, tidak perlu diubah */}
          {!isPreviewMode && (
            <Inspector 
              component={selectedComponent}
              onContentChange={updateComponentContent}
              onStyleChange={updateComponentStyle}
              onDelete={deleteComponent}
            />
          )}
        </div>
        
        <DragOverlay dropAnimation={null}>
          {activeComponent ? (
            canvasComponents.some(c => c.id === activeComponent.id) ? (
              <RenderedComponent component={activeComponent} isDraggingOverlay={true} />
            ) : (
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