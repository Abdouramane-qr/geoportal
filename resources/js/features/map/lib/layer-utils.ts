import type { Layer } from '@/features/map/types/layers';

const LAYER_COLORS = ['#1a9850', '#d95f02', '#2c7fb8', '#a6761d', '#7570b3', '#e7298a'];

const getRandomId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const normalizeGeoJSON = (data: unknown): GeoJSON.FeatureCollection | null => {
  if (!data) return null;

  if (typeof data === 'object' && (data as { type?: string }).type === 'FeatureCollection') {
    const fc = data as GeoJSON.FeatureCollection;
    return {
      type: 'FeatureCollection',
      features: (fc.features ?? []).map((feature, index) => ({
        ...feature,
        properties: {
          id: (feature.properties as Record<string, unknown>)?.id ?? `P${index + 1}`,
          name: (feature.properties as Record<string, unknown>)?.name ?? `Parcelle ${index + 1}`,
          scientificStatus:
            (feature.properties as Record<string, unknown>)?.scientificStatus ?? 'brouillon',
          ...(feature.properties as Record<string, unknown>),
        },
      })) as GeoJSON.Feature[],
    };
  }

  if (Array.isArray(data)) {
    const features = data.map((feature, index) => ({
      type: 'Feature',
      geometry: (feature as { geometry?: GeoJSON.Geometry }).geometry ?? null,
      properties: {
        id: (feature as { id?: string }).id ?? `P${index + 1}`,
        name: (feature as { name?: string }).name ?? `Parcelle ${index + 1}`,
        scientificStatus: (feature as { scientificStatus?: string }).scientificStatus ?? 'brouillon',
      },
    })) as GeoJSON.Feature[];

    return { type: 'FeatureCollection', features };
  }

  return null;
};

type Bbox = {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
  coordCount: number;
  sumLng: number;
  sumLat: number;
};

const createBbox = (): Bbox => ({
  minLng: Number.POSITIVE_INFINITY,
  minLat: Number.POSITIVE_INFINITY,
  maxLng: Number.NEGATIVE_INFINITY,
  maxLat: Number.NEGATIVE_INFINITY,
  coordCount: 0,
  sumLng: 0,
  sumLat: 0,
});

const visitGeometry = (geometry: GeoJSON.Geometry, onPoint: (lng: number, lat: number) => void) => {
  if (geometry.type === 'GeometryCollection') {
    geometry.geometries.forEach((child) => visitGeometry(child, onPoint));
    return;
  }

  visitCoords(
    geometry.coordinates as GeoJSON.Position | GeoJSON.Position[] | GeoJSON.Position[][] | GeoJSON.Position[][][],
    onPoint,
  );
};

const visitCoords = (coords: GeoJSON.Position | GeoJSON.Position[] | GeoJSON.Position[][] | GeoJSON.Position[][][], onPoint: (lng: number, lat: number) => void) => {
  if (!Array.isArray(coords)) return;
  if (coords.length === 0) return;
  const first = coords[0];
  if (typeof first === 'number') {
    const [lng, lat] = coords as GeoJSON.Position;
    if (Number.isFinite(lng) && Number.isFinite(lat)) {
      onPoint(lng, lat);
    }
    return;
  }
  (coords as GeoJSON.Position[] | GeoJSON.Position[][] | GeoJSON.Position[][][]).forEach((child) => visitCoords(child, onPoint));
};

const updateBbox = (bbox: Bbox, lng: number, lat: number) => {
  bbox.minLng = Math.min(bbox.minLng, lng);
  bbox.minLat = Math.min(bbox.minLat, lat);
  bbox.maxLng = Math.max(bbox.maxLng, lng);
  bbox.maxLat = Math.max(bbox.maxLat, lat);
  bbox.coordCount += 1;
  bbox.sumLng += lng;
  bbox.sumLat += lat;
};

const computeBbox = (data: GeoJSON.FeatureCollection): Bbox => {
  const bbox = createBbox();
  data.features.forEach((feature) => {
    const geom = feature.geometry;
    if (!geom) return;
    visitGeometry(geom, (lng, lat) => {
      updateBbox(bbox, lng, lat);
    });
  });
  return bbox;
};

export const countValidGeometries = (data: GeoJSON.FeatureCollection): number =>
  data.features.filter((feature) => feature.geometry && feature.geometry.type).length;

type CoordinateAssessment = {
  status: 'ok' | 'suspect';
  reason?: string;
  bbox: Bbox;
};

export const assessGeoJsonCoordinates = (data: GeoJSON.FeatureCollection): CoordinateAssessment => {
  const bbox = computeBbox(data);
  if (!Number.isFinite(bbox.minLng) || !Number.isFinite(bbox.minLat)) {
    return { status: 'suspect', reason: 'Coordonnées non valides.', bbox };
  }

  const exceedsLng = bbox.minLng < -180 || bbox.maxLng > 180;
  const exceedsLat = bbox.minLat < -90 || bbox.maxLat > 90;
  const veryLarge = Math.max(
    Math.abs(bbox.minLng),
    Math.abs(bbox.maxLng),
    Math.abs(bbox.minLat),
    Math.abs(bbox.maxLat),
  ) > 1000;

  if (exceedsLng || exceedsLat || veryLarge) {
    return {
      status: 'suspect',
      reason:
        'Les coordonnées semblent ne pas être en EPSG:4326 (latitude/longitude). Vérifiez la projection.',
      bbox,
    };
  }

  return { status: 'ok', bbox };
};

export const computeGeoJsonFingerprint = (data: GeoJSON.FeatureCollection): string => {
  const bbox = computeBbox(data);
  const types = Array.from(
    new Set(
      data.features
        .map((feature) => feature.geometry?.type)
        .filter((value): value is GeoJSON.GeoJsonGeometryTypes => Boolean(value)),
    ),
  ).sort();
  const bboxPart = [
    Number.isFinite(bbox.minLng) ? bbox.minLng.toFixed(6) : 'na',
    Number.isFinite(bbox.minLat) ? bbox.minLat.toFixed(6) : 'na',
    Number.isFinite(bbox.maxLng) ? bbox.maxLng.toFixed(6) : 'na',
    Number.isFinite(bbox.maxLat) ? bbox.maxLat.toFixed(6) : 'na',
  ].join(',');
  const sumPart = [
    bbox.sumLng.toFixed(3),
    bbox.sumLat.toFixed(3),
  ].join(',');
  return [
    `features:${data.features.length}`,
    `coords:${bbox.coordCount}`,
    `bbox:${bboxPart}`,
    `sum:${sumPart}`,
    `types:${types.join('|') || 'na'}`,
  ].join('|');
};

export const createLayer = (data: GeoJSON.FeatureCollection, name: string, index: number): Layer => ({
  id: getRandomId(),
  name,
  data,
  color: LAYER_COLORS[index % LAYER_COLORS.length],
  opacity: 0.6,
  visible: true,
  fingerprint: computeGeoJsonFingerprint(data),
});
