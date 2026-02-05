import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { ParcelData, LayerState } from '@/types/parcel';
import { GeographicContext } from '@/types/geographic';
import { getStatusConfig } from '@/types/scientificStatus';

interface RestrictedGISMapProps {
  parcels: ParcelData[];
  selectedParcel: ParcelData | null;
  onSelectParcel: (parcel: ParcelData) => void;
  activeLayers: LayerState;
  authorizedContext: GeographicContext;
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

// Get polygon style based on scientific status
function getStatusStyle(parcel: ParcelData) {
  const config = getStatusConfig(parcel.scientificStatus);
  return {
    dashArray: config.mapStyle.dashArray,
    weight: config.mapStyle.weight,
    fillOpacity: config.mapStyle.opacity,
  };
}

// Créer un polygone couvrant le monde entier avec un trou pour la zone autorisée
function createMaskPolygon(bounds: [[number, number], [number, number]]): L.LatLngExpression[][] {
  const worldBounds: L.LatLngExpression[] = [
    [-90, -180],
    [-90, 180],
    [90, 180],
    [90, -180],
  ];

  // Le trou (zone autorisée)
  const hole: L.LatLngExpression[] = [
    [bounds[0][0], bounds[0][1]],
    [bounds[0][0], bounds[1][1]],
    [bounds[1][0], bounds[1][1]],
    [bounds[1][0], bounds[0][1]],
  ];

  return [worldBounds, hole];
}

export function RestrictedGISMap({
  parcels,
  selectedParcel,
  onSelectParcel,
  activeLayers,
  authorizedContext,
}: RestrictedGISMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonsRef = useRef<Map<string, L.Polygon>>(new Map());
  const maskRef = useRef<L.Polygon | null>(null);
  const boundaryRef = useRef<L.Rectangle | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: authorizedContext.center,
      zoom: authorizedContext.zoom,
      scrollWheelZoom: true,
      maxBoundsViscosity: 0.8,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapInstanceRef.current = map;
    setIsMapReady(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      setIsMapReady(false);
    };
  }, []);

  // Update map when context changes
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;

    const map = mapInstanceRef.current;

    // Zoom to authorized area
    map.flyTo(authorizedContext.center, authorizedContext.zoom, {
      duration: 1,
    });

    // Set max bounds with some padding
    const bounds = L.latLngBounds(
      [authorizedContext.bounds[0][0] - 0.5, authorizedContext.bounds[0][1] - 0.5],
      [authorizedContext.bounds[1][0] + 0.5, authorizedContext.bounds[1][1] + 0.5]
    );
    map.setMaxBounds(bounds);
  }, [authorizedContext, isMapReady]);

  // Add/update mask overlay
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;

    const map = mapInstanceRef.current;

    // Remove existing mask
    if (maskRef.current) {
      maskRef.current.remove();
    }
    if (boundaryRef.current) {
      boundaryRef.current.remove();
    }

    // Create mask polygon (world with hole for authorized area)
    const maskCoords = createMaskPolygon(authorizedContext.bounds);
    const mask = L.polygon(maskCoords, {
      color: 'transparent',
      fillColor: '#1a1a2e',
      fillOpacity: 0.7,
      interactive: false,
    });
    mask.addTo(map);
    maskRef.current = mask;

    // Add boundary rectangle for authorized zone
    const boundary = L.rectangle(
      [authorizedContext.bounds[0], authorizedContext.bounds[1]],
      {
        color: '#2d6a4f',
        weight: 3,
        fill: false,
        dashArray: '10, 5',
        interactive: false,
      }
    );
    boundary.addTo(map);
    boundaryRef.current = boundary;
  }, [authorizedContext, isMapReady]);

  // Add/update parcels
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;

    const map = mapInstanceRef.current;

    // Clear existing polygons
    polygonsRef.current.forEach(polygon => polygon.remove());
    polygonsRef.current.clear();

    // Filter parcels within authorized bounds
    const authorizedParcels = parcels.filter(parcel => {
      const [lat, lng] = parcel.location.coordinates;
      return (
        lat >= authorizedContext.bounds[0][0] &&
        lat <= authorizedContext.bounds[1][0] &&
        lng >= authorizedContext.bounds[0][1] &&
        lng <= authorizedContext.bounds[1][1]
      );
    });

    // Add new polygons with status-based styling
    authorizedParcels.forEach(parcel => {
      const isSelected = selectedParcel?.id === parcel.id;
      const fillColor = getParcelColor(parcel, activeLayers);
      const statusStyle = getStatusStyle(parcel);

      const polygon = L.polygon(
        parcel.polygon.map(([lat, lng]) => [lat, lng] as L.LatLngTuple),
        {
          color: isSelected ? '#1a365d' : fillColor,
          weight: isSelected ? 3 : statusStyle.weight,
          fillColor: fillColor,
          fillOpacity: isSelected ? 0.7 : statusStyle.fillOpacity,
          dashArray: isSelected ? '' : statusStyle.dashArray,
        }
      );

      polygon.on('click', () => onSelectParcel(parcel));
      polygon.addTo(map);
      polygonsRef.current.set(parcel.id, polygon);
    });
  }, [parcels, selectedParcel, activeLayers, authorizedContext, onSelectParcel, isMapReady]);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapRef}
        className="w-full h-full rounded-md overflow-hidden border border-border"
        style={{ minHeight: '500px' }}
      />
      
      {/* Indicateur de zone autorisée */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-card/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-md">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 border-2 border-dashed border-primary rounded" />
          <span className="text-muted-foreground">
            Périmètre autorisé : <span className="font-medium text-foreground">{authorizedContext.name}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
