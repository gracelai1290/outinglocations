import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
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
  const mapRef = useRef<any>(null);

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

  return (
    <div style={{ 
      position: 'relative',
      height: '100%',
      width: '100%'
    }}>
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
      
      {data.map((point) => {
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