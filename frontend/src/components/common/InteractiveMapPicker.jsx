import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

/**
 * Modern Interactive OpenStreetMap Leaflet Map Component
 * Supports clickable pin placement, draggable pin, and automatic smooth panning.
 */
export const InteractiveMapPicker = ({
  latitude,
  longitude,
  accuracy,
  onLocationSelected,
  className = ''
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);

  const defaultLat = latitude || 20.5937; // India centroid default if not yet located
  const defaultLng = longitude || 78.9629;
  const hasCoordinates = latitude !== null && latitude !== undefined && longitude !== null && longitude !== undefined;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // 1. Create Map Instance
      const map = L.map(mapContainerRef.current, {
        center: [defaultLat, defaultLng],
        zoom: hasCoordinates ? 15 : 5,
        zoomControl: true,
        scrollWheelZoom: false
      });

      // 2. Add OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      // 3. Custom Pin Icon
      const customPinIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -100%);">
            <div style="width: 32px; height: 32px; background: #0284c7; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2.5px solid white;">
              <div style="width: 10px; height: 10px; background: white; border-radius: 50%;"></div>
            </div>
            <div style="position: absolute; bottom: -6px; width: 12px; height: 4px; background: rgba(0,0,0,0.25); border-radius: 50%; filter: blur(1px);"></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      // 4. Create Draggable Marker
      const marker = L.marker([defaultLat, defaultLng], {
        draggable: true,
        icon: customPinIcon
      }).addTo(map);

      if (!hasCoordinates) {
        marker.setOpacity(0);
      }

      // Drag event handler
      marker.on('dragend', (e) => {
        const { lat, lng } = e.target.getLatLng();
        if (onLocationSelected) {
          onLocationSelected(parseFloat(lat.toFixed(6)), parseFloat(lng.toFixed(6)));
        }
      });

      // Map Click event handler (move pin to clicked spot)
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        marker.setOpacity(1);
        if (circleRef.current) circleRef.current.setLatLng([lat, lng]);
        if (onLocationSelected) {
          onLocationSelected(parseFloat(lat.toFixed(6)), parseFloat(lng.toFixed(6)));
        }
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map view & marker when latitude/longitude props change
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;

    if (hasCoordinates) {
      const map = mapInstanceRef.current;
      const marker = markerRef.current;

      marker.setLatLng([latitude, longitude]);
      marker.setOpacity(1);

      // Add or update accuracy radius circle if accuracy <= 5000m
      if (accuracy && accuracy <= 5000) {
        if (circleRef.current) {
          circleRef.current.setLatLng([latitude, longitude]);
          circleRef.current.setRadius(accuracy);
        } else {
          circleRef.current = L.circle([latitude, longitude], {
            radius: accuracy,
            color: '#0284c7',
            fillColor: '#0284c7',
            fillOpacity: 0.12,
            weight: 1.5
          }).addTo(map);
        }
      } else if (circleRef.current) {
        circleRef.current.remove();
        circleRef.current = null;
      }

      map.setView([latitude, longitude], Math.max(map.getZoom(), 15), {
        animate: true,
        duration: 0.6
      });
    }
  }, [latitude, longitude, accuracy]);

  return (
    <div className={`relative rounded-xl overflow-hidden border border-surface-border bg-surface-subtle ${className}`}>
      <div ref={mapContainerRef} className="w-full h-64 sm:h-72 z-0" />
      
      {/* Visual Overlay Helper Hint */}
      <div className="absolute top-2.5 right-2.5 z-[400] bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-surface-border text-[10px] font-semibold text-dark-700 shadow-sm pointer-events-none flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse"></span>
        <span>Click map or drag pin to adjust</span>
      </div>
    </div>
  );
};
