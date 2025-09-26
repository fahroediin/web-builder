// src/App.jsx

import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';

import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import Inspector from './components/Inspector';
import Toolbar from './components/Toolbar'; // <-- BARU: Import Toolbar
import './App.css';

function App() {
  const [canvasComponents, setCanvasComponents] = useState(() => {
    const saved = localStorage.getItem('canvasComponents');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedComponentId, setSelectedComponentId] = useState(null);

  // --- LOGIKA BARU UNTUK TEMA ---
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    // Terapkan tema ke elemen html
    document.documentElement.setAttribute('data-theme', theme);
    // Simpan preferensi tema
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  // --- AKHIR LOGIKA BARU ---

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
    // DIUBAH: Struktur JSX diubah untuk mengakomodasi Toolbar
    <div className="app-wrapper">
      <Toolbar theme={theme} toggleTheme={toggleTheme} />
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
    </div>
  );
}

export default App;