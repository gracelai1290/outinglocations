import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { MapDataPoint } from '../types';

// Fix for default markers in react-leaflet
import L from 'leaflet';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Create custom colored marker icons
const createColoredMarkerIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path fill="${color}" stroke="#000" stroke-width="1" d="M12.5,0 C19.4,0 25,5.6 25,12.5 C25,19.4 12.5,41 12.5,41 C12.5,41 0,19.4 0,12.5 C0,5.6 5.6,0 12.5,0 Z"/>
        <circle fill="#fff" cx="12.5" cy="12.5" r="6"/>
      </svg>
    `)}`,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Category color mapping
const categoryColors = {
  'Camping': '#FF69B4',      // Pink
  'Caves & Mines': '#00FFFF', // Cyan
  'Backpacking': '#FFFF00',   // Yellow
  'Auto/Aviation/Trains': '#9932CC', // Purple
  'default': '#9932CC'        // Purple for any other categories
};

// Create marker icons for each category
const markerIcons = {
  'Camping': createColoredMarkerIcon(categoryColors.Camping),
  'Caves & Mines': createColoredMarkerIcon(categoryColors['Caves & Mines']),
  'Backpacking': createColoredMarkerIcon(categoryColors.Backpacking),
  'Auto/Aviation/Trains': createColoredMarkerIcon(categoryColors['Auto/Aviation/Trains']),
  'default': createColoredMarkerIcon(categoryColors.default)
};

interface MapViewProps {
  data: MapDataPoint[];
  center?: LatLngExpression;
  zoom?: number;
}

export const MapView = ({ data, center = [37.7749, -122.4194], zoom = 8 }: MapViewProps) => {
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(new Set());
  const mapRef = useRef<any>(null);
  
  // Get unique categories
  const categories = Array.from(new Set(data.map(point => point.category)));
  
  // Initialize all categories as visible
  if (visibleCategories.size === 0 && categories.length > 0) {
    setVisibleCategories(new Set(categories));
  }

  // Handle window resize to invalidate map size
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        setTimeout(() => {
          mapRef.current.invalidateSize();
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const toggleCategory = (category: string) => {
    const newVisible = new Set(visibleCategories);
    if (newVisible.has(category)) {
      newVisible.delete(category);
    } else {
      newVisible.add(category);
    }
    setVisibleCategories(newVisible);
  };
  
  // Filter data based on visible categories
  const filteredData = data.filter(point => visibleCategories.has(point.category));

  return (
    <div style={{ 
      position: 'relative',
      height: '100%',
      width: '100%'
    }}>
      {/* Category Filter Overlay */}
      <div style={{ 
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '250px',
        padding: '15px', 
        backgroundColor: 'rgba(248, 249, 250, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '8px',
        zIndex: 1000,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px', borderBottom: '2px solid #dee2e6', paddingBottom: '5px' }}>
          Filter Categories
        </h3>
        {categories.map(category => (
          <div key={category} style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={visibleCategories.has(category)}
                onChange={() => toggleCategory(category)}
                style={{ marginRight: '8px' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: categoryColors[category as keyof typeof categoryColors] || categoryColors.default,
                  border: '1px solid #000',
                  borderRadius: '50% 50% 50% 0',
                  transform: 'rotate(-45deg)',
                  flexShrink: 0
                }}></div>
                <span>{category}</span>
                <span style={{ marginLeft: 'auto', color: '#666', fontSize: '12px' }}>
                  ({data.filter(p => p.category === category).length})
                </span>
              </div>
            </label>
          </div>
        ))}
      </div>

      {/* Full Screen Map Container */}
      <MapContainer
        center={center}
        zoom={zoom}
        ref={mapRef}
        style={{ 
          height: '100%', 
          width: '100%'
        }}
      >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {filteredData.map((point) => {
        const markerIcon = markerIcons[point.category as keyof typeof markerIcons] || markerIcons.default;
        
        return (
          <Marker
            key={point.id}
            position={[point.latitude, point.longitude]}
            icon={markerIcon}
          >
            <Popup>
            <div>
              <h3>{point.name}</h3>
              {point.url && (
                <p><a href={point.url} target="_blank" rel="noopener noreferrer">Visit Website</a></p>
              )}
              <p><strong>Category:</strong> {point.category}</p>
              {point.subcategory && (
                <p><strong>Type:</strong> {point.subcategory}</p>
              )}
              {point.description && <p>{point.description}</p>}
            </div>
            </Popup>
          </Marker>
        );
      })}
      </MapContainer>
    </div>
  );
};