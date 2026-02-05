import { useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ValidationRecord } from '@/types/validation';
import { AlertTriangle, MapPin } from 'lucide-react';

interface ValidationMapViewProps {
  record: ValidationRecord;
}

export function ValidationMapView({ record }: ValidationMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Generate mock polygon coordinates based on parcel ID
  const parcelCoords = useMemo(() => {
    const baseCoords: Record<string, [number, number][]> = {
      'P001': [[14.75, -17.0], [14.85, -17.0], [14.85, -16.85], [14.75, -16.85]],
      'P002': [[14.35, -17.05], [14.50, -17.05], [14.50, -16.90], [14.35, -16.90]],
      'P003': [[14.25, -16.50], [14.45, -16.50], [14.45, -16.30], [14.25, -16.30]],
    };
    return baseCoords[record.parcelId] || [[14.79, -16.92], [14.89, -16.92], [14.89, -16.82], [14.79, -16.82]];
  }, [record.parcelId]);

  const center = useMemo(() => {
    const latSum = parcelCoords.reduce((sum, c) => sum + c[0], 0);
    const lngSum = parcelCoords.reduce((sum, c) => sum + c[1], 0);
    return [latSum / parcelCoords.length, lngSum / parcelCoords.length] as [number, number];
  }, [parcelCoords]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Cleanup existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Create new map
    const map = L.map(mapRef.current, {
      center: center,
      zoom: 10,
      zoomControl: true,
    });

    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Determine polygon style based on errors
    const hasErrors = record.errors.length > 0;
    const hasOnlyWarnings = record.errors.every(e => e.severity === 'warning');

    const polygonStyle = {
      color: hasErrors ? (hasOnlyWarnings ? '#f59e0b' : '#ef4444') : '#22c55e',
      weight: 3,
      fillOpacity: 0.3,
      fillColor: hasErrors ? (hasOnlyWarnings ? '#f59e0b' : '#ef4444') : '#22c55e',
      dashArray: hasErrors ? '5, 10' : undefined,
    };

    // Add parcel polygon
    const polygon = L.polygon(
      parcelCoords.map(c => [c[0], c[1]] as [number, number]),
      polygonStyle
    ).addTo(map);

    // Add error markers
    if (hasErrors) {
      record.errors.forEach((error, idx) => {
        // Offset each marker slightly within the polygon
        const offset = (idx + 1) * 0.02;
        const markerPos: [number, number] = [center[0] + offset, center[1] - offset];

        const icon = L.divIcon({
          className: 'custom-error-marker',
          html: `
            <div class="flex items-center justify-center w-8 h-8 rounded-full ${
              error.severity === 'error' ? 'bg-danger' : 'bg-warning'
            } text-white shadow-lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        L.marker(markerPos, { icon })
          .addTo(map)
          .bindPopup(`
            <div class="p-2">
              <strong class="text-sm">${error.field}</strong>
              <p class="text-xs text-gray-600 mt-1">${error.message}</p>
              <p class="text-xs mt-1">Valeur: <code>${error.value}</code></p>
            </div>
          `);
      });
    }

    // Fit bounds to polygon
    map.fitBounds(polygon.getBounds(), { padding: [30, 30] });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [record, parcelCoords, center]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-border bg-muted/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-primary" />
          <span className="font-medium text-sm">{record.parcelName}</span>
        </div>
        {record.errors.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-danger">
            <AlertTriangle size={14} />
            <span>{record.errors.length} erreur(s) détectée(s)</span>
          </div>
        )}
      </div>
      <div ref={mapRef} className="flex-1 min-h-[300px]" />
      
      {/* Legend */}
      <div className="p-3 border-t border-border bg-muted/30">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-danger/30 border-2 border-danger border-dashed" />
            <span>Erreur critique</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-warning/30 border-2 border-warning border-dashed" />
            <span>Alerte</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-success/30 border-2 border-success" />
            <span>Validé</span>
          </div>
        </div>
      </div>
    </div>
  );
}
