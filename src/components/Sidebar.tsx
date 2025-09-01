import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCategoryFilter } from '../contexts/CategoryFilterContext';

// Category color mapping (same as MapView)
const categoryColors = {
  'Camping': '#FF69B4',      // Pink
  'Caves & Mines': '#00FFFF', // Cyan
  'Backpacking': '#FFFF00',   // Yellow
  'Auto/Aviation/Trains': '#9932CC', // Purple
  'default': '#9932CC'        // Purple for any other categories
};

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const { 
    selectedCategories, 
    allCategories, 
    mapData, 
    toggleCategory, 
    selectAllCategories, 
    clearAllCategories 
  } = useCategoryFilter();

  // Get all unique subcategories from the data
  const subcategories = Array.from(new Set(
    mapData.filter(point => point.subcategory && point.subcategory.trim())
           .map(point => point.subcategory)
  )).sort();

  const navItems = [
    { path: '/', label: 'Map', icon: '🗺️' },
    { path: '/categories', label: 'Categories', icon: '📋' },
    { path: '/about', label: 'About', icon: 'ℹ️' }
  ];

  const handleCategoriesClick = () => {
    // Navigate to categories page and reset to show all categories
    navigate('/categories?category=all');
  };

  const handleActivityClick = (categoryName: string) => {
    // Navigate to categories page with category parameter
    navigate(`/categories?category=${encodeURIComponent(categoryName)}`);
  };

  const handleSubcategoryClick = (subcategoryName: string) => {
    // Navigate to categories page and use search to filter by subcategory
    navigate(`/categories?search=${encodeURIComponent(subcategoryName)}`);
  };

  const toggleCategoryExpansion = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '60px',
      left: 0,
      width: '250px',
      height: 'calc(100vh - 60px)',
      backgroundColor: 'rgba(248, 249, 250, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRight: '1px solid #dee2e6',
      zIndex: 999,
      padding: '20px 0',
      boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
    }}>
      {/* Navigation Menu */}
      <div style={{ padding: '0 20px' }}>
        <h3 style={{ 
          margin: '0 0 20px 0', 
          fontSize: '16px', 
          color: '#495057',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontWeight: 'bold'
        }}>
          Navigation
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map(item => (
            <div key={item.path}>
              {item.path === '/categories' ? (
                <div
                  onClick={handleCategoriesClick}
                  style={{
                    textDecoration: 'none',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontWeight: '500',
                    fontSize: '16px',
                    transition: 'all 0.2s ease',
                    backgroundColor: location.pathname === item.path ? '#007bff' : 'transparent',
                    color: location.pathname === item.path ? 'white' : '#495057',
                    border: location.pathname === item.path ? 'none' : '1px solid transparent',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== item.path) {
                      e.currentTarget.style.backgroundColor = '#e9ecef';
                      e.currentTarget.style.borderColor = '#007bff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== item.path) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                    }
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ) : (
                <Link
                  to={item.path}
                  style={{
                    textDecoration: 'none',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontWeight: '500',
                    fontSize: '16px',
                    transition: 'all 0.2s ease',
                    backgroundColor: location.pathname === item.path ? '#007bff' : 'transparent',
                    color: location.pathname === item.path ? 'white' : '#495057',
                    border: location.pathname === item.path ? 'none' : '1px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== item.path) {
                      e.currentTarget.style.backgroundColor = '#e9ecef';
                      e.currentTarget.style.borderColor = '#007bff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== item.path) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                    }
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )}
              
              {/* Show subcategories for Categories section */}
              {item.path === '/categories' && (
                <div style={{ marginLeft: '20px', marginTop: '8px' }}>
                  {[
                    { name: 'Camping', emoji: '🏕️', color: '#FF69B4', category: 'Camping' },
                    { name: 'Caves & Mines', emoji: '🕳️', color: '#00FFFF', category: 'Caves & Mines' },
                    { name: 'Backpacking', emoji: '🎒', color: '#FFFF00', category: 'Backpacking' },
                    { name: 'Auto/Aviation/Trains', emoji: '🚂', color: '#9932CC', category: 'Auto/Aviation/Trains' }
                  ].map(activity => {
                    const hasSubcategories = subcategories.some(sub => 
                      mapData.some(point => point.category === activity.category && point.subcategory === sub)
                    );
                    const isExpanded = expandedCategories.has(activity.category);
                    
                    return (
                      <div key={activity.name}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            color: '#6c757d',
                            border: '1px solid transparent',
                            marginBottom: '4px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `${activity.color}15`;
                            e.currentTarget.style.borderColor = `${activity.color}40`;
                            e.currentTarget.style.color = activity.color;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.color = '#6c757d';
                          }}
                        >
                          <div 
                            onClick={() => handleActivityClick(activity.category)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              flex: 1
                            }}
                          >
                            <span style={{ fontSize: '12px' }}>{activity.emoji}</span>
                            <span>{activity.name}</span>
                          </div>
                          
                          {hasSubcategories && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCategoryExpansion(activity.category);
                              }}
                              style={{
                                padding: '2px',
                                cursor: 'pointer',
                                fontSize: '10px',
                                transition: 'transform 0.2s ease',
                                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
                              }}
                            >
                              ▶
                            </div>
                          )}
                        </div>
                      
                      {/* Show subcategories for this specific category */}
                      {isExpanded && subcategories
                        .filter(sub => mapData.some(point => point.category === activity.category && point.subcategory === sub))
                        .map(subcategory => (
                          <div
                            key={subcategory}
                            onClick={() => handleSubcategoryClick(subcategory)}
                            style={{
                              padding: '4px 12px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              color: '#868e96',
                              border: '1px solid transparent',
                              marginBottom: '2px',
                              marginLeft: '16px',
                              textAlign: 'left'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#e9ecef';
                              e.currentTarget.style.color = '#495057';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#868e96';
                            }}
                          >
                            • {subcategory}
                          </div>
                        ))
                      }
                      </div>
                    );
                  })}

                </div>
              )}
              
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};