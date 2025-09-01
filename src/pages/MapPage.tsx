import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapView } from '../components/MapView';
import { useSearch } from '../contexts/SearchContext';
import { useCategoryFilter } from '../contexts/CategoryFilterContext';

export const MapPage = () => {
  const [searchParams] = useSearchParams();
  const { searchTerm } = useSearch();
  const { filteredData: categoryFilteredData } = useCategoryFilter();

  // Check if we have specific location parameters
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const zoom = searchParams.get('zoom');

  // Apply search filter on top of category filter
  const finalFilteredData = useMemo(() => {
    let data = categoryFilteredData;
    
    // If we have specific coordinates, filter to show only that location
    if (lat && lng) {
      const targetLat = parseFloat(lat);
      const targetLng = parseFloat(lng);
      data = categoryFilteredData.filter(point => 
        Math.abs(point.latitude - targetLat) < 0.001 && 
        Math.abs(point.longitude - targetLng) < 0.001
      );
    }
    
    // Apply search filter if present
    if (searchTerm.trim()) {
      data = data.filter(point => 
        point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        point.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        point.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        point.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return data;
  }, [categoryFilteredData, searchTerm, lat, lng]);

  // Determine map center and zoom
  const mapCenter = useMemo(() => {
    if (lat && lng) {
      return [parseFloat(lat), parseFloat(lng)] as [number, number];
    }
    return [37.7749, -122.4194] as [number, number]; // Default to Bay Area
  }, [lat, lng]);

  const mapZoom = useMemo(() => {
    if (zoom) {
      return parseInt(zoom);
    }
    return lat && lng ? 15 : 8; // Higher zoom if showing specific location
  }, [zoom, lat, lng]);

  return (
    <div style={{ 
      position: 'fixed',
      top: '60px',
      left: '250px',
      height: 'calc(100vh - 60px)',
      width: 'calc(100vw - 250px)',
      overflow: 'hidden'
    }}>
      {/* Search Results Info */}
      {searchTerm && (
        <div style={{ 
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '8px 16px', 
          backgroundColor: 'rgba(0, 123, 255, 0.9)', 
          color: 'white',
          borderRadius: '4px',
          zIndex: 1000,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          fontSize: '14px'
        }}>
          Showing {finalFilteredData.length} of {categoryFilteredData.length} locations for "{searchTerm}"
        </div>
      )}
      
      {/* Full Screen Map */}
      <MapView data={finalFilteredData} center={mapCenter} zoom={mapZoom} />
    </div>
  );
};