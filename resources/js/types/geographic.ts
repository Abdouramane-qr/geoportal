export type GeographicLevel = 'village' | 'commune' | 'region';

export interface GeographicContext {
  level: GeographicLevel;
  name: string;
  bounds: [[number, number], [number, number]]; // [[south, west], [north, east]]
  center: [number, number];
  zoom: number;
}

export interface GeographicHierarchy {
  regions: {
    name: string;
    bounds: [[number, number], [number, number]];
    center: [number, number];
    communes: {
      name: string;
      bounds: [[number, number], [number, number]];
      center: [number, number];
      villages: {
        name: string;
        bounds: [[number, number], [number, number]];
        center: [number, number];
      }[];
    }[];
  }[];
}

// Données géographiques du Sénégal
export const geographicData: GeographicHierarchy = {
  regions: [
    {
      name: 'Thiès',
      bounds: [[14.2, -17.2], [15.1, -16.5]],
      center: [14.79, -16.92],
      communes: [
        {
          name: 'Thiès',
          bounds: [[14.7, -17.05], [14.9, -16.8]],
          center: [14.79, -16.92],
          villages: [
            { name: 'Thiès Nord', bounds: [[14.8, -17.0], [14.9, -16.85]], center: [14.85, -16.92] },
            { name: 'Thiès Sud', bounds: [[14.7, -17.0], [14.8, -16.85]], center: [14.75, -16.92] },
          ],
        },
        {
          name: 'Mbour',
          bounds: [[14.3, -17.1], [14.55, -16.85]],
          center: [14.42, -16.97],
          villages: [
            { name: 'Mbour Centre', bounds: [[14.4, -17.0], [14.5, -16.9]], center: [14.45, -16.95] },
            { name: 'Saly', bounds: [[14.35, -17.0], [14.45, -16.9]], center: [14.40, -16.95] },
          ],
        },
      ],
    },
    {
      name: 'Fatick',
      bounds: [[13.8, -16.7], [14.5, -15.8]],
      center: [14.33, -16.41],
      communes: [
        {
          name: 'Fatick',
          bounds: [[14.2, -16.55], [14.5, -16.25]],
          center: [14.33, -16.41],
          villages: [
            { name: 'Fatick Ville', bounds: [[14.3, -16.5], [14.4, -16.35]], center: [14.35, -16.42] },
          ],
        },
      ],
    },
    {
      name: 'Kaolack',
      bounds: [[13.9, -16.3], [14.4, -15.7]],
      center: [14.15, -16.07],
      communes: [
        {
          name: 'Kaolack',
          bounds: [[14.0, -16.25], [14.3, -15.9]],
          center: [14.15, -16.07],
          villages: [
            { name: 'Kaolack Centre', bounds: [[14.1, -16.15], [14.2, -16.0]], center: [14.15, -16.08] },
          ],
        },
      ],
    },
    {
      name: 'Saint-Louis',
      bounds: [[15.7, -16.8], [16.3, -15.8]],
      center: [16.02, -16.50],
      communes: [
        {
          name: 'Saint-Louis',
          bounds: [[15.85, -16.65], [16.2, -16.35]],
          center: [16.02, -16.50],
          villages: [
            { name: 'Île de Saint-Louis', bounds: [[15.95, -16.55], [16.05, -16.45]], center: [16.0, -16.5] },
          ],
        },
      ],
    },
  ],
};

export function getContextFromLocation(
  regionName: string,
  communeName?: string,
  villageName?: string
): GeographicContext | null {
  const region = geographicData.regions.find(r => r.name === regionName);
  if (!region) return null;

  if (!communeName) {
    return {
      level: 'region',
      name: region.name,
      bounds: region.bounds,
      center: region.center,
      zoom: 8,
    };
  }

  const commune = region.communes.find(c => c.name === communeName);
  if (!commune) return null;

  if (!villageName) {
    return {
      level: 'commune',
      name: commune.name,
      bounds: commune.bounds,
      center: commune.center,
      zoom: 10,
    };
  }

  const village = commune.villages.find(v => v.name === villageName);
  if (!village) return null;

  return {
    level: 'village',
    name: village.name,
    bounds: village.bounds,
    center: village.center,
    zoom: 12,
  };
}
