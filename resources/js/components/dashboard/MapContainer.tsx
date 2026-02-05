import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { ParcelData, LayerState } from '@/types/parcel';
import { GeographicContext } from '@/types/geographic';
import { getStatusConfig, ScientificStatus } from '@/types/scientificStatus';
import type { Layer } from '@/features/map/types/layers';

interface MapContainerProps {
  parcels: ParcelData[];
  selectedParcel: ParcelData | null;
  onSelectParcel: (parcel: ParcelData) => void;
  activeLayers: LayerState;
  authorizedContext: GeographicContext;
  layers?: Layer[];
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
function getStatusStyle(status: ScientificStatus) {
  const config = getStatusConfig(status);
  return {
    color: config.mapStyle.color,
    dashArray: config.mapStyle.dashArray,
    weight: config.mapStyle.weight,
    fillOpacity: config.mapStyle.opacity,
  };
}

// Create mask polygon for restricted area visualization
function createMaskPolygon(bounds: [[number, number], [number, number]]): L.LatLngExpression[][] {
  const worldBounds: L.LatLngExpression[] = [
    [-90, -180],
    [-90, 180],
    [90, 180],
    [90, -180],
  ];

  const hole: L.LatLngExpression[] = [
    [bounds[0][0], bounds[0][1]],
    [bounds[0][0], bounds[1][1]],
    [bounds[1][0], bounds[1][1]],
    [bounds[1][0], bounds[0][1]],
  ];

  return [worldBounds, hole];
}

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const formatPopupValue = (value: unknown) => {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const formatFeaturePopup = (properties: GeoJSON.GeoJsonProperties | null | undefined) => {
  if (!properties || typeof properties !== 'object') {
    return '<div><strong>Aucune propriété</strong></div>';
  }

  const entries = Object.entries(properties)
    .filter(([key]) => key !== 'geometry' && key !== 'bbox')
    .map(([key, value]) => {
      const safeKey = escapeHtml(String(key));
      const safeValue = escapeHtml(formatPopupValue(value));
      return `<tr><td style="padding:2px 8px 2px 0;font-weight:600;white-space:nowrap;">${safeKey}</td><td style="padding:2px 0;">${safeValue}</td></tr>`;
    });

  if (!entries.length) {
    return '<div><strong>Aucune propriété</strong></div>';
  }

  return `<table style="border-collapse:collapse;min-width:220px;">${entries.join('')}</table>`;
};

const formatParcelPopup = (parcel: ParcelData) => {
  const statusLabel = escapeHtml(parcel.scientificStatus);
  const statusColor =
    parcel.scientificStatus === 'officiel'
      ? '#0f766e'
      : parcel.scientificStatus === 'valide'
        ? '#2563eb'
        : '#6b7280';

  const header = `
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:10px;">
      <div>
        <div style="font-weight:700;font-size:14px;color:#111827;">${escapeHtml(parcel.name)}</div>
        <div style="font-size:11px;color:#6b7280;">${escapeHtml(parcel.location.commune)} · ${escapeHtml(
          parcel.location.region,
        )}</div>
      </div>
      <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;background:${statusColor}1A;color:${statusColor};border:1px solid ${statusColor}33;padding:2px 6px;border-radius:999px;">
        ${statusLabel}
      </span>
    </div>
  `;

  const section = (title: string, rows: Array<[string, string]>) => `
    <div style="margin-top:8px;">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#374151;margin-bottom:4px;">
        ${escapeHtml(title)}
      </div>
      <table style="border-collapse:collapse;width:100%;font-size:12px;">
        ${rows
          .map(
            ([key, value]) =>
              `<tr><td style="padding:2px 8px 2px 0;color:#6b7280;white-space:nowrap;">${escapeHtml(
                key,
              )}</td><td style="padding:2px 0;color:#111827;font-weight:600;">${escapeHtml(value)}</td></tr>`,
          )
          .join('')}
      </table>
    </div>
  `;

  const sol = section('Sol', [
    ['Type', parcel.pedology.soilType],
    ['pH', String(parcel.pedology.pH)],
    ['Matière org.', `${parcel.pedology.organicMatter}%`],
    ['Texture', parcel.pedology.texture],
  ]);

  const hydro = section('Hydrologie', [
    ['Nappe', `${parcel.hydrology.waterTableDepth} m`],
    ['Écoulement', `${parcel.hydrology.annualFlow}`],
    ['Drainage', parcel.hydrology.drainageClass],
  ]);

  const conservation = section('Conservation', [
    ['K', String(parcel.conservation.kFactor)],
    ['Risque érosion', parcel.conservation.erosionRisk],
    ['Pente', `${parcel.conservation.slopePercent}%`],
    ['Couverture', `${parcel.conservation.vegetationCover}%`],
  ]);

  const footer = `
    <div style="margin-top:10px;padding-top:6px;border-top:1px solid #e5e7eb;font-size:11px;color:#6b7280;display:flex;gap:10px;flex-wrap:wrap;">
      <span>Aptitude: <strong style="color:#111827;">${escapeHtml(parcel.aptitude)}</strong></span>
      <span>Fertilité: <strong style="color:#111827;">${escapeHtml(parcel.fertility)}</strong></span>
    </div>
  `;

  return `<div style="min-width:260px;max-width:340px;">${header}${sol}${hydro}${conservation}${footer}</div>`;
};

const parcelToPopupProperties = (parcel: ParcelData): GeoJSON.GeoJsonProperties => ({
  id: parcel.id,
  name: parcel.name,
  region: parcel.location.region,
  commune: parcel.location.commune,
  latitude: parcel.location.coordinates[0],
  longitude: parcel.location.coordinates[1],
  area: parcel.area,
  soilType: parcel.pedology.soilType,
  pH: parcel.pedology.pH,
  organicMatter: parcel.pedology.organicMatter,
  texture: parcel.pedology.texture,
  waterTableDepth: parcel.hydrology.waterTableDepth,
  annualFlow: parcel.hydrology.annualFlow,
  drainageClass: parcel.hydrology.drainageClass,
  kFactor: parcel.conservation.kFactor,
  erosionRisk: parcel.conservation.erosionRisk,
  slopePercent: parcel.conservation.slopePercent,
  vegetationCover: parcel.conservation.vegetationCover,
  fertility: parcel.fertility,
  aptitude: parcel.aptitude,
  scientificStatus: parcel.scientificStatus,
});

export function MapContainer({
  parcels,
  selectedParcel,
  onSelectParcel,
  activeLayers,
  authorizedContext,
  layers,
}: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonsRef = useRef<Map<string, L.Polygon>>(new Map());
  const parcelByIdRef = useRef<Map<string, ParcelData>>(new Map());
  const activeLayersRef = useRef<LayerState>(activeLayers);
  const selectedParcelRef = useRef<ParcelData | null>(selectedParcel);
  const uploadedLayersRef = useRef<Map<string, L.GeoJSON>>(new Map());
  const maskRef = useRef<L.Polygon | null>(null);
  const boundaryRef = useRef<L.Rectangle | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const prevLayerIdsRef = useRef<Set<string>>(new Set());
  const styleUpdateRafRef = useRef<number | null>(null);
  const lastImportedFitKeyRef = useRef<string | null>(null);
  const perfEnabled =
    typeof window !== 'undefined' && Boolean((window as Window & { __MAP_PERF__?: boolean }).__MAP_PERF__);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: authorizedContext.center,
      zoom: authorizedContext.zoom,
      scrollWheelZoom: true,
      maxBoundsViscosity: 0.8,
      preferCanvas: true,
    });

    const maskPane = map.createPane('mask');
    maskPane.style.zIndex = '200';

    const parcelsPane = map.createPane('parcels');
    parcelsPane.style.zIndex = '460';

    const importedPane = map.createPane('imported');
    importedPane.style.zIndex = '520';

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

  const hasVisibleImportedLayer = (layers ?? []).some((layer) => layer.visible);

  // Update map when context changes
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;

    const map = mapInstanceRef.current;

    map.flyTo(authorizedContext.center, authorizedContext.zoom, {
      duration: 1,
    });

    if (!hasVisibleImportedLayer) {
      const bounds = L.latLngBounds(
        [authorizedContext.bounds[0][0] - 0.5, authorizedContext.bounds[0][1] - 0.5],
        [authorizedContext.bounds[1][0] + 0.5, authorizedContext.bounds[1][1] + 0.5]
      );
      map.setMaxBounds(bounds);
    } else {
      map.setMaxBounds(undefined);
    }
  }, [authorizedContext, isMapReady, hasVisibleImportedLayer]);

  // Add/update mask overlay
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;

    const map = mapInstanceRef.current;

    if (maskRef.current) {
      maskRef.current.remove();
    }
    if (boundaryRef.current) {
      boundaryRef.current.remove();
    }

    if (hasVisibleImportedLayer) {
      maskRef.current = null;
      boundaryRef.current = null;
      return;
    }

    const maskCoords = createMaskPolygon(authorizedContext.bounds);
    const mask = L.polygon(maskCoords, {
      pane: 'mask',
      color: 'transparent',
      fillColor: '#1a1a2e',
      fillOpacity: 0.7,
      interactive: false,
    });
    mask.addTo(map);
    maskRef.current = mask;

    const boundary = L.rectangle(
      [authorizedContext.bounds[0], authorizedContext.bounds[1]],
      {
        pane: 'mask',
        color: '#2d6a4f',
        weight: 3,
        fill: false,
        dashArray: '10, 5',
        interactive: false,
      }
    );
    boundary.addTo(map);
    boundaryRef.current = boundary;
  }, [authorizedContext, isMapReady, hasVisibleImportedLayer]);

  // Handle uploaded GeoJSON layers - fitBounds and style by layer
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;

    const map = mapInstanceRef.current;
    const perfStart = perfEnabled ? performance.now() : 0;

    const layerList = layers ?? [];
    const incomingIds = new Set(layerList.map((layer) => layer.id));

    // Remove layers that no longer exist
    uploadedLayersRef.current.forEach((layer, id) => {
      if (!incomingIds.has(id)) {
        layer.remove();
        uploadedLayersRef.current.delete(id);
      }
    });

    const previousIds = prevLayerIdsRef.current;

    layerList.forEach((layerItem) => {
      const existing = uploadedLayersRef.current.get(layerItem.id);
      if (!existing) {
        let geoLayer: L.GeoJSON | null = null;
        try {
          geoLayer = L.geoJSON(layerItem.data, {
          pane: 'imported',
          style: () => ({
            color: layerItem.color,
            weight: 2,
            fillColor: layerItem.color,
            fillOpacity: layerItem.opacity,
          }),
          onEachFeature: (feature, featureLayer) => {
            const html = formatFeaturePopup(feature.properties);
            featureLayer.bindPopup(html, { maxWidth: 320 });
          },
          });
        } catch (error) {
          console.warn('Unable to render GeoJSON layer', layerItem.name, error);
        }

        if (!geoLayer) return;
        const initialBounds = geoLayer.getBounds();
        if (!initialBounds.isValid()) {
          console.warn('GeoJSON layer has invalid bounds', layerItem.name);
        }

        // Always add the layer to the map when created, its visibility will be managed later
        geoLayer.addTo(map);
        if (!layerItem.visible) {
          geoLayer.remove();
        }
        geoLayer.bringToFront();

        uploadedLayersRef.current.set(layerItem.id, geoLayer);

        if (!previousIds.has(layerItem.id) && layerItem.visible) {
          const bounds = geoLayer.getBounds();
          if (bounds.isValid()) {
            map.fitBounds(bounds, {
              padding: [50, 50],
              maxZoom: 14,
              animate: true,
              duration: 1,
            });
          }
        }
      } else {
        existing.setStyle({
          color: layerItem.color,
          weight: 2,
          fillColor: layerItem.color,
          fillOpacity: layerItem.opacity,
        });

        const onMap = map.hasLayer(existing);
        if (layerItem.visible && !onMap) {
          existing.addTo(map);
          existing.bringToFront();
        } else if (!layerItem.visible && onMap) {
          existing.remove();
        }
      }
    });

    prevLayerIdsRef.current = incomingIds;

    const visibleIds = layerList.filter((layer) => layer.visible).map((layer) => layer.id).sort();
    const visibleKey = visibleIds.join('|');
    if (visibleKey && visibleKey !== lastImportedFitKeyRef.current) {
      const unionBounds = L.latLngBounds([]);
      visibleIds.forEach((id) => {
        const layer = uploadedLayersRef.current.get(id);
        if (!layer) return;
        const bounds = layer.getBounds();
        if (bounds.isValid()) {
          unionBounds.extend(bounds);
        }
      });
      if (unionBounds.isValid()) {
        const mapBounds = map.getBounds();
        if (!mapBounds.intersects(unionBounds)) {
          map.fitBounds(unionBounds, {
            padding: [50, 50],
            maxZoom: 14,
            animate: true,
            duration: 1,
          });
        }
      }
      lastImportedFitKeyRef.current = visibleKey;
    } else if (!visibleKey) {
      lastImportedFitKeyRef.current = null;
    }

    if (perfEnabled) {
      const duration = performance.now() - perfStart;
      console.info('[MapPerf] Imported layers update', {
        layers: layerList.length,
        durationMs: Math.round(duration),
      });
    }
  }, [layers, isMapReady]);

  useEffect(() => {
    activeLayersRef.current = activeLayers;
  }, [activeLayers]);

  useEffect(() => {
    selectedParcelRef.current = selectedParcel;
  }, [selectedParcel]);

  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;
    const map = mapInstanceRef.current;
    const handleFocus = (event: Event) => {
      const layerId = (event as CustomEvent<string>).detail;
      if (!layerId) return;
      const layer = uploadedLayersRef.current.get(layerId);
      if (!layer) return;
      const bounds = layer.getBounds();
      if (!bounds.isValid()) {
        console.warn('GeoJSON layer has invalid bounds', layerId);
        return;
      }
      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 15,
        animate: true,
        duration: 0.9,
      });
    };
    window.addEventListener('geoportal:layer-focus', handleFocus);
    return () => {
      window.removeEventListener('geoportal:layer-focus', handleFocus);
    };
  }, [isMapReady]);

  // Add/update existing parcels (diff update)
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;

    const map = mapInstanceRef.current;
    const perfStart = perfEnabled ? performance.now() : 0;

    const authorizedParcels = parcels.filter(parcel => {
      const [lat, lng] = parcel.location.coordinates;
      return (
        lat >= authorizedContext.bounds[0][0] &&
        lat <= authorizedContext.bounds[1][0] &&
        lng >= authorizedContext.bounds[0][1] &&
        lng <= authorizedContext.bounds[1][1]
      );
    });

    const nextIds = new Set<string>();
    const nextParcelMap = new Map<string, ParcelData>();

    authorizedParcels.forEach((parcel) => {
      nextIds.add(parcel.id);
      nextParcelMap.set(parcel.id, parcel);

      const existing = polygonsRef.current.get(parcel.id);
      if (!existing) {
        const fillColor = getParcelColor(parcel, activeLayersRef.current);
        const statusStyle = getStatusStyle(parcel.scientificStatus);
        const isSelected = selectedParcelRef.current?.id === parcel.id;

        const polygon = L.polygon(
          parcel.polygon.map(([lat, lng]) => [lat, lng] as L.LatLngTuple),
          {
            pane: 'parcels',
            color: isSelected ? '#1a365d' : statusStyle.color,
            weight: isSelected ? 4 : statusStyle.weight,
            fillColor: fillColor,
            fillOpacity: isSelected ? 0.7 : statusStyle.fillOpacity,
            dashArray: isSelected ? '' : statusStyle.dashArray,
          },
        );

        polygon.on('click', () => onSelectParcel(parcel));
        polygon.bindPopup(formatParcelPopup(parcel), { maxWidth: 360 });
        polygon.bindTooltip(parcel.name, {
          permanent: false,
          direction: 'top',
        });

        polygon.addTo(map);
        polygonsRef.current.set(parcel.id, polygon);
      } else {
        existing.setLatLngs(parcel.polygon.map(([lat, lng]) => [lat, lng] as L.LatLngTuple));
      }
    });

    polygonsRef.current.forEach((polygon, id) => {
      if (!nextIds.has(id)) {
        polygon.remove();
        polygonsRef.current.delete(id);
      }
    });

    parcelByIdRef.current = nextParcelMap;

    if (perfEnabled) {
      const duration = performance.now() - perfStart;
      console.info('[MapPerf] Parcels geometry update', {
        parcels: authorizedParcels.length,
        durationMs: Math.round(duration),
      });
    }
  }, [parcels, authorizedContext, onSelectParcel, isMapReady]);

  // Update parcel styles without rebuilding geometry
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;

    if (styleUpdateRafRef.current !== null) {
      cancelAnimationFrame(styleUpdateRafRef.current);
    }

    styleUpdateRafRef.current = requestAnimationFrame(() => {
      const perfStart = perfEnabled ? performance.now() : 0;

      polygonsRef.current.forEach((polygon, id) => {
        const parcel = parcelByIdRef.current.get(id);
        if (!parcel) return;
        const isSelected = selectedParcel?.id === parcel.id;
        const fillColor = getParcelColor(parcel, activeLayers);
        const statusStyle = getStatusStyle(parcel.scientificStatus);

        polygon.setStyle({
          color: isSelected ? '#1a365d' : statusStyle.color,
          weight: isSelected ? 4 : statusStyle.weight,
          fillColor: fillColor,
          fillOpacity: isSelected ? 0.7 : statusStyle.fillOpacity,
          dashArray: isSelected ? '' : statusStyle.dashArray,
        });
      });

      if (perfEnabled) {
        const duration = performance.now() - perfStart;
        console.info('[MapPerf] Parcels style update', {
          parcels: polygonsRef.current.size,
          durationMs: Math.round(duration),
        });
      }

      styleUpdateRafRef.current = null;
    });

    return () => {
      if (styleUpdateRafRef.current !== null) {
        cancelAnimationFrame(styleUpdateRafRef.current);
        styleUpdateRafRef.current = null;
      }
    };
  }, [selectedParcel, activeLayers, isMapReady]);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapRef}
        className="w-full h-full rounded-md overflow-hidden border border-border"
      />
      
      {/* Authorized zone indicator */}
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
