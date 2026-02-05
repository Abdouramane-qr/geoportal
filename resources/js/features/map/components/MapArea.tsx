import type { GeoJsonObject } from 'geojson';
import type { PathOptions } from 'leaflet';
import L from 'leaflet';
import { useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, LayersControl, GeoJSON, ZoomControl, useMap } from 'react-leaflet';

export interface MapLayer {
  id: string;
  name: string;
  data: GeoJsonObject;
  style?: PathOptions;
}

interface MapAreaProps {
  layers?: MapLayer[];
}

const BURKINA_CENTER: [number, number] = [12.238, -1.561];
const BURKINA_BOUNDS: [[number, number], [number, number]] = [
  [9.3, -5.6],
  [15.1, 2.5],
];

function LayersRenderer({ layers }: { layers: MapLayer[] }) {
  const map = useMap();
  const layerRef = useRef<L.FeatureGroup | null>(null);

  useEffect(() => {
    if (!layers.length) return;

    const group = new L.FeatureGroup();
    layers.forEach((layer) => {
      const geo = L.geoJSON(layer.data, { style: layer.style });
      geo.addTo(group);
    });

    const bounds = group.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14, animate: true });
    }

    layerRef.current = group;
    return () => {
      group.clearLayers();
    };
  }, [layers, map]);

  return (
    <>
      {layers.map((layer) => (
        <GeoJSON key={layer.id} data={layer.data} style={layer.style} />
      ))}
    </>
  );
}

export default function MapArea({ layers = [] }: MapAreaProps) {
  const maxBounds = useMemo(() => BURKINA_BOUNDS, []);

  return (
    <div className="h-full w-full rounded-lg border border-border overflow-hidden">
      <MapContainer
        center={BURKINA_CENTER}
        zoom={7.3}
        minZoom={6}
        maxZoom={18}
        maxBounds={maxBounds}
        maxBoundsViscosity={0.8}
        zoomControl={false}
        className="h-full w-full"
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite (Esri)">
            <TileLayer
              attribution="Tiles &copy; Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <ZoomControl position="bottomright" />

        <LayersRenderer layers={layers} />
      </MapContainer>
    </div>
  );
}
