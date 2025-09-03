import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchSheetData } from '../services/googleSheets';
import { useSearch } from '../contexts/SearchContext';
import type { MapDataPoint } from '../types';

// Category color mapping (same as MapView)
const categoryColors = {
  'Camping': '#FFB6C1',      // Light Pink
  'Caves & Mines': '#B0E0E6', // Powder Blue
  'Backpacking': '#FFFACD',   // Lemon Chiffon
  'Auto/Aviation/Trains': '#DDA0DD', // Plum
  'Climbing': '#E6E6FA',     // Lavender
  'default': '#DDA0DD'        // Plum for any other categories
};

export const CategoryPage = () => {
  const [searchParams] = useSearchParams();
  const [mapData, setMapData] = useState<MapDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { searchTerm, setSearchTerm } = useSearch();

  const SHEET_ID = '1PvOBObJktZaGqF9DdTqPUPD3yT_ygOy5u6LB-rzYuWk';

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSheetData(SHEET_ID);
        setMapData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Handle URL parameters for category selection and search
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    
    if (searchParam) {
      // If there's a search parameter (for subcategories), set search term and reset category to 'all'
      setSearchTerm(searchParam);
      setSelectedCategory('all');
    } else if (categoryParam) {
      setSelectedCategory(categoryParam);
      // Clear search when selecting a category to show all items in that category
      if (categoryParam !== 'all') {
        setSearchTerm('');
      }
    }
  }, [searchParams, setSearchTerm]);

  // const categories = Array.from(new Set(mapData.map(point => point.category)));
  
  // Filter data by category and search term
  const filteredData = useMemo(() => {
    let data = selectedCategory === 'all' 
      ? mapData 
      : mapData.filter(point => point.category === selectedCategory);
    
    // Apply search filter
    if (searchTerm.trim()) {
      data = data.filter(point => 
        point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        point.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        point.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        point.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return data;
  }, [mapData, selectedCategory, searchTerm]);

  if (loading) {
    return (
      <div style={{ 
        height: 'calc(100vh - 60px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div>Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        height: 'calc(100vh - 60px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ color: 'red' }}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '40px',
      maxWidth: '1200px',
      margin: '0 auto',
      minHeight: 'calc(100vh - 60px)',
      backgroundColor: 'white'
    }}>
      <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>
        Scout Outing Categories
        {searchTerm && (
          <span style={{ fontSize: '18px', color: '#666', fontWeight: 'normal', display: 'block', marginTop: '10px' }}>
            Search results for: "{searchTerm}"
          </span>
        )}
      </h1>
      

      {/* Location Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '25px' 
      }}>
        {filteredData.map((location) => {
          const categoryColor = categoryColors[location.category as keyof typeof categoryColors] || categoryColors.default;
          
          return (
            <div
              key={location.id}
              style={{
                backgroundColor: 'white',
                border: `3px solid ${categoryColor}`,
                borderRadius: '8px',
                padding: '25px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#333', fontSize: '20px' }}>{location.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '14px',
                    height: '14px',
                    backgroundColor: categoryColor,
                    border: '1px solid #000',
                    borderRadius: '50% 50% 50% 0',
                    transform: 'rotate(-45deg)',
                    flexShrink: 0
                  }}></div>
                  <span style={{ 
                    backgroundColor: categoryColor, 
                    padding: '4px 12px', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#000'
                  }}>
                    {location.category}
                  </span>
                </div>
              </div>
            
            {location.subcategory && (
              <p style={{ margin: '0 0 10px 0', color: '#6c757d', fontStyle: 'italic', fontSize: '15px' }}>
                <strong>Type:</strong> {location.subcategory}
              </p>
            )}
            
            <p style={{ margin: '0 0 15px 0', color: '#6c757d', fontSize: '14px' }}>
              <strong>Coordinates:</strong> {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </p>
            
            {location.description && (
              <p style={{ margin: '0 0 15px 0', lineHeight: '1.5', color: '#495057' }}>
                {location.description}
              </p>
            )}
            
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {location.url && (
                <a 
                  href={location.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
                >
                  Visit Website →
                </a>
              )}
              
              <a 
                href={`${import.meta.env.BASE_URL}?lat=${location.latitude}&lng=${location.longitude}&zoom=15`}
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
              >
                View on Map 🗺️
              </a>
            </div>
            </div>
          );
        })}
      </div>

      {filteredData.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#6c757d' 
        }}>
          No locations found for the selected category.
        </div>
      )}
    </div>
  );
};