import React, { useEffect, useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Box, Card, Typography, Chip } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const pickupIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const destinationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Geocoding function using Nominatim (OpenStreetMap)
const geocodeAddress = async (address) => {
  if (!address.trim()) return null;
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }
  
  return null;
};

export default function MapContainer({ 
  pickupAddress = '',
  destinationAddress = '',
  pickupLat,
  pickupLng,
  destLat,
  destLng,
  distance,
  duration 
}) {
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [loading, setLoading] = useState(false);

  // Default center (Nairobi, Kenya)
  const defaultCenter = { lat: -1.2921, lng: 36.8219 };

  useEffect(() => {
    // If coordinates are provided directly, use them
    if (pickupLat !== undefined && pickupLng !== undefined) {
      setPickupCoords({ lat: pickupLat, lng: pickupLng });
    }
    if (destLat !== undefined && destLng !== undefined) {
      setDestinationCoords({ lat: destLat, lng: destLng });
    }
  }, [pickupLat, pickupLng, destLat, destLng]);

  useEffect(() => {
    // Only geocode if addresses are provided and coordinates are not
    if ((pickupAddress || destinationAddress) && 
        (pickupLat === undefined || pickupLng === undefined || destLat === undefined || destLng === undefined)) {
      const updateCoordinates = async () => {
        setLoading(true);
        
        const [pickup, destination] = await Promise.all([
          pickupAddress && (pickupLat === undefined || pickupLng === undefined) ? geocodeAddress(pickupAddress) : null,
          destinationAddress && (destLat === undefined || destLng === undefined) ? geocodeAddress(destinationAddress) : null
        ]);
        
        if (pickup && (pickupLat === undefined || pickupLng === undefined)) {
          setPickupCoords(pickup);
        }
        if (destination && (destLat === undefined || destLng === undefined)) {
          setDestinationCoords(destination);
        }
        setLoading(false);
      };

      updateCoordinates();
    }
  }, [pickupAddress, destinationAddress, pickupLat, pickupLng, destLat, destLng]);

  // Calculate map center and zoom
  const getMapCenter = () => {
    if (pickupCoords && destinationCoords) {
      return {
        lat: (pickupCoords.lat + destinationCoords.lat) / 2,
        lng: (pickupCoords.lng + destinationCoords.lng) / 2
      };
    }
    if (pickupCoords) return pickupCoords;
    if (destinationCoords) return destinationCoords;
    return defaultCenter;
  };

  const getZoomLevel = () => {
    if (pickupCoords && destinationCoords) {
      const latDiff = Math.abs(pickupCoords.lat - destinationCoords.lat);
      const lngDiff = Math.abs(pickupCoords.lng - destinationCoords.lng);
      const maxDiff = Math.max(latDiff, lngDiff);
      
      if (maxDiff > 10) return 5;
      if (maxDiff > 5) return 6;
      if (maxDiff > 2) return 7;
      if (maxDiff > 1) return 8;
      if (maxDiff > 0.5) return 9;
      return 10;
    }
    return 8;
  };

  const polylinePositions = pickupCoords && destinationCoords 
    ? [[pickupCoords.lat, pickupCoords.lng], [destinationCoords.lat, destinationCoords.lng]]
    : [];

  return (
    <Box sx={{ position: 'relative', height: '400px', borderRadius: '12px', overflow: 'hidden' }}>
      <LeafletMap
        center={[getMapCenter().lat, getMapCenter().lng]}
        zoom={getZoomLevel()}
        style={{ height: '100%', width: '100%' }}
        key={`${destinationAddress}-${pickupAddress}-${Date.now()}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {pickupCoords && (
          <Marker position={[pickupCoords.lat, pickupCoords.lng]} icon={pickupIcon}>
            <Popup>
              <strong>Pickup Location</strong><br />
              {pickupAddress}
            </Popup>
          </Marker>
        )}
        
        {destinationCoords && (
          <Marker position={[destinationCoords.lat, destinationCoords.lng]} icon={destinationIcon}>
            <Popup>
              <strong>Destination</strong><br />
              {destinationAddress}
            </Popup>
          </Marker>
        )}
        
        {polylinePositions.length > 0 && (
          <Polyline
            positions={polylinePositions}
            pathOptions={{
              color: '#0066FF',
              weight: 3,
              opacity: 0.8,
              dashArray: '10, 10'
            }}
          />
        )}
      </LeafletMap>
      
      {distance && duration && (
        <Card sx={{ 
          position: 'absolute', 
          bottom: 16, 
          left: 16, 
          p: 2, 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }}>
          <Box display="flex" gap={2} alignItems="center">
            <Chip label="🚚" size="small" sx={{ bgcolor: '#00CBB0', color: 'white' }} />
            <Box>
              <Typography variant="caption" color="text.secondary">Distance</Typography>
              <Typography variant="subtitle2" fontWeight={600}>{distance}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Duration</Typography>
              <Typography variant="subtitle2" fontWeight={600}>{duration}</Typography>
            </Box>
          </Box>
        </Card>
      )}
      
      {loading && (
        <Card sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 16, 
          p: 1, 
          background: 'rgba(255, 255, 255, 0.95)',
        }}>
          <Typography variant="caption" color="text.secondary">Updating map...</Typography>
        </Card>
      )}
    </Box>
  );
}