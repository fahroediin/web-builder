// src/App.jsx

import React, { useState, useEffect } from 'react';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';

// --- HELPER FUNCTIONS FOR TREE STRUCTURE ---
const findComponent = (id, components) => {
  for (const component of components) {
    if (component.id === id) return component;
    if (component.children?.length) {
      const found = findComponent(id, component.children);
      if (found) return found;
    }
  }
  return null;
};

const removeComponent = (id, components) => {
  return components.filter(c => {
    if (c.id === id) return false;
    if (c.children?.length) {
      c.children = removeComponent(id, c.children);
    }
    return true;
  });
};

const findContainer = (id, components) => {
  if (id === 'canvas') return components;
  const component = findComponent(id, components);
  if (component && component.type === 'container') {
    return component.children;
  }
  return null;
};

const findParentContainer = (childId, components, parent = null) => {
  for (const component of components) {
    if (component.id === childId) return parent;
    if (component.children?.length) {
      const found = findParentContainer(childId, component.children, component);
      if (found) return found;
    }
  }
  return null;
};
// --- END HELPER FUNCTIONS ---

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
    const component = findComponent(active.id, canvasComponents);
    setActiveComponent(component || { type: active.id, id: active.id });
  }

  function handleDragEnd(event) {
    setActiveComponent(null);
    if (isPreviewMode) return;

    const { active, over } = event;
    if (!over || over.id === 'sidebar-container' || active.id === over.id) return;

    const isSidebarComponent = ['heading', 'button', 'paragraph', 'container'].includes(active.id);

    setCanvasComponents(prev => {
      let newTree = JSON.parse(JSON.stringify(prev));
      const overId = over.id;
      const activeId = active.id;

      if (isSidebarComponent) {
        const newComponent = {
          id: uuidv4(), type: active.id, content: `Ini adalah ${active.id}`,
          styles: { color: null, backgroundColor: null, fontSize: '16px', margin: '10px', padding: '10px', flexDirection: 'column' },
          children: [],
        };
        const targetContainer = findContainer(overId, newTree);
        if (targetContainer) {
          targetContainer.push(newComponent);
        } else {
          const parentOfOver = findParentContainer(overId, newTree, { children: newTree });
          if (parentOfOver) {
            const overIndex = parentOfOver.children.findIndex(c => c.id === overId);
            parentOfOver.children.splice(overIndex + 1, 0, newComponent);
          }
        }
      } else {
        const activeComponentData = findComponent(activeId, newTree);
        if (!activeComponentData) return prev;
        
        newTree = removeComponent(activeId, newTree);

        const targetContainer = findContainer(overId, newTree);
        if (targetContainer) {
          targetContainer.push(activeComponentData);
        } else {
          const parentOfOver = findParentContainer(overId, newTree, { children: newTree });
          if (parentOfOver) {
            const overIndex = parentOfOver.children.findIndex(c => c.id === overId);
            parentOfOver.children.splice(overIndex, 0, activeComponentData);
          } else {
            newTree.push(activeComponentData);
          }
        }
      }
      return newTree;
    });
  };
  
  const selectedComponent = findComponent(selectedComponentId, canvasComponents);
  
  const updateComponentStyle = (id, property, value) => {
    setCanvasComponents(prev => {
      const newTree = JSON.parse(JSON.stringify(prev));
      const component = findComponent(id, newTree);
      if (component) {
        if (!component.styles) component.styles = {};
        component.styles[property] = value;
      }
      return newTree;
    });
  };

  const updateComponentContent = (id, newContent) => {
    setCanvasComponents(prev => {
      const newTree = JSON.parse(JSON.stringify(prev));
      const component = findComponent(id, newTree);
      if (component) {
        component.content = newContent;
      }
      return newTree;
    });
  };

  const deleteComponent = (id) => {
    setCanvasComponents(prev => {
      const newTree = JSON.parse(JSON.stringify(prev));
      return removeComponent(id, newTree);
    });
    setSelectedComponentId(null);
  };

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
          {!isPreviewMode && <Sidebar isPreviewMode={isPreviewMode} />}
          <Canvas 
            components={canvasComponents} 
            onSelectComponent={setSelectedComponentId}
            selectedComponentId={selectedComponentId}
            isPreviewMode={isPreviewMode}
          />
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
            findComponent(activeComponent.id, canvasComponents) ? (
              // --- PERBAIKAN KUNCI ADA DI SINI ---
              // Teruskan semua prop yang dibutuhkan oleh RenderedComponent dan anak-anaknya
              <RenderedComponent 
                component={activeComponent} 
                isDraggingOverlay={true}
                isPreviewMode={isPreviewMode}
                onSelectComponent={setSelectedComponentId}
                selectedComponentId={selectedComponentId}
              />
            ) : (
              <div className="draggable-item-overlay">
                {activeComponent.type === 'container' && 'Container (Div)'}
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