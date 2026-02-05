import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { ParcelData, LayerState } from '@/types/parcel';

interface GISMapProps {
  parcels: ParcelData[];
  selectedParcel: ParcelData | null;
  onSelectParcel: (parcel: ParcelData) => void;
  activeLayers: LayerState;
}

function getParcelColor(parcel: ParcelData, activeLayers: LayerState): string {
  if (activeLayers.erosion) {
    switch (parcel.conservation.erosionRisk) {
      case 'élevé': return '#ef4444';
      case 'moyen': return '#f59e0b';
      case 'faible': return '#22c55e';
    }
  }
  
  if (activeLayers.hydrology) {
    switch (parcel.hydrology.flowLevel) {
      case 'élevé': return '#0ea5e9';
      case 'moyen': return '#06b6d4';
      case 'faible': return '#64748b';
    }
  }
  
  if (activeLayers.fertility) {
    switch (parcel.fertility) {
      case 'haute': return '#22c55e';
      case 'moyenne': return '#f59e0b';
      case 'basse': return '#ef4444';
    }
  }
  
  return '#2d6a4f';
}

export function GISMap({ parcels, selectedParcel, onSelectParcel, activeLayers }: GISMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonsRef = useRef<Map<string, L.Polygon>>(new Map());
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [14.7, -16.5],
      zoom: 6,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapInstanceRef.current = map;
    if (!isMapReady) { // Only set if not already true
      setIsMapReady(true);
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      setIsMapReady(false);
    };
  }, []);

  // Add/update parcels
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;

    const map = mapInstanceRef.current;

    // Clear existing polygons
    polygonsRef.current.forEach(polygon => polygon.remove());
    polygonsRef.current.clear();

    // Add new polygons
    parcels.forEach(parcel => {
      const isSelected = selectedParcel?.id === parcel.id;
      const fillColor = getParcelColor(parcel, activeLayers);

      const polygon = L.polygon(
        parcel.polygon.map(([lat, lng]) => [lat, lng] as L.LatLngTuple),
        {
          color: isSelected ? '#1a365d' : fillColor,
          weight: isSelected ? 3 : 2,
          fillColor: fillColor,
          fillOpacity: isSelected ? 0.7 : 0.5,
        }
      );

      polygon.on('click', () => onSelectParcel(parcel));
      polygon.addTo(map);
      polygonsRef.current.set(parcel.id, polygon);
    });
  }, [parcels, selectedParcel, activeLayers, onSelectParcel, isMapReady]);

  return (
    <div 
      ref={mapRef}
      className="w-full h-full rounded-md overflow-hidden border border-border"
      style={{ minHeight: '500px' }}
    />
  );
}
