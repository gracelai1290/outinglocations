import { useState, useRef, useEffect } from 'react';
import { useCategoryFilter } from '../contexts/CategoryFilterContext';

// Category color mapping
const categoryColors = {
  'Camping': '#FFB6C1',      // Light Pink
  'Caves & Mines': '#B0E0E6', // Powder Blue
  'Backpacking': '#FFFACD',   // Lemon Chiffon
  'Auto/Aviation/Trains': '#DDA0DD', // Plum
  'Climbing/Rock Climbing': '#E6E6FA', // Lavender
  'Other': '#F0F8FF',        // Alice Blue
  'default': '#DDA0DD'        // Plum for any other categories
};

export const DraggableFilter = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({ x: window.innerWidth - 320, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);

  const { 
    selectedCategories, 
    allCategories, 
    mapData, 
    toggleCategory, 
    selectAllCategories, 
    clearAllCategories 
  } = useCategoryFilter();

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = dragRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 300, e.clientX - dragOffset.x)),
        y: Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragOffset.y))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Toggle button - always visible
  const toggleButton = (
    <button
      onClick={() => setIsVisible(!isVisible)}
      style={{
        position: 'fixed',
        top: '120px',
        right: '20px',
        zIndex: 1002,
        padding: '12px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '12px',
        width: 'auto',
        height: '40px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#0056b3';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#007bff';
        e.currentTarget.style.transform = 'scale(1)';
      }}
      title="Toggle Category Filter"
    >
      Filter
    </button>
  );

  return (
    <>
      {toggleButton}
      
      {isVisible && (
        <div
          ref={dragRef}
          style={{
            position: 'fixed',
            left: position.x,
            top: position.y,
            width: '300px',
            backgroundColor: 'rgba(248, 249, 250, 0.98)',
            backdropFilter: 'blur(10px)',
            border: '2px solid #dee2e6',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            zIndex: 1001,
            cursor: isDragging ? 'grabbing' : 'default'
          }}
        >
          {/* Header */}
          <div
            onMouseDown={handleMouseDown}
            style={{
              padding: '15px 20px',
              borderBottom: '2px solid #dee2e6',
              borderRadius: '10px 10px 0 0',
              backgroundColor: '#007bff',
              color: 'white',
              cursor: 'grab',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              userSelect: 'none'
            }}
          >
            <h3 style={{ 
              margin: 0, 
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              Filter by Category
            </h3>
            <button
              onClick={() => setIsVisible(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '0',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '20px', maxHeight: '400px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {allCategories.map(category => {
                const count = mapData.filter(p => p.category === category).length;
                const color = categoryColors[category as keyof typeof categoryColors] || categoryColors.default;
                const isSelected = selectedCategories.has(category);
                
                return (
                  <div key={category} style={{ marginBottom: '5px' }}>
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      cursor: 'pointer',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.4)',
                      border: `2px solid ${isSelected ? color : 'rgba(0, 0, 0, 0.1)'}`,
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? `0 4px 8px ${color}30` : '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleCategory(category)}
                        style={{ marginRight: '12px' }}
                      />
                      <div style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: color,
                        border: '2px solid #000',
                        borderRadius: '50% 50% 50% 0',
                        transform: 'rotate(-45deg)',
                        flexShrink: 0,
                        marginRight: '12px'
                      }}></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontWeight: '600', 
                          fontSize: '14px', 
                          color: '#333',
                          marginBottom: '2px'
                        }}>
                          {category}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {count} location{count !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <div style={{
                        backgroundColor: color,
                        color: '#000',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        minWidth: '20px',
                        textAlign: 'center'
                      }}>
                        {count}
                      </div>
                    </label>
                  </div>
                );
              })}
              
              {/* Select/Deselect All Buttons */}
              <div style={{ 
                marginTop: '15px', 
                display: 'flex', 
                gap: '8px'
              }}>
                <button
                  onClick={selectAllCategories}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    flex: 1,
                    fontWeight: 'bold',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
                >
                  Select All
                </button>
                <button
                  onClick={clearAllCategories}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    flex: 1,
                    fontWeight: 'bold',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
                >
                  Clear All
                </button>
              </div>
              
              {/* Filter Status */}
              <div style={{
                marginTop: '12px',
                padding: '8px 12px',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderRadius: '6px',
                border: '1px solid rgba(0, 123, 255, 0.3)'
              }}>
                <div style={{ fontSize: '12px', color: '#495057', fontWeight: 'bold' }}>
                  Showing: {selectedCategories.size} of {allCategories.length} categories
                </div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                  {mapData.filter(p => selectedCategories.has(p.category)).length} total locations
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};