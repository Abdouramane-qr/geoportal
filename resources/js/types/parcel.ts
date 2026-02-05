import { ScientificStatus } from './scientificStatus';

export interface ParcelData {
  id: string;
  name: string;
  location: {
    commune: string;
    region: string;
    coordinates: [number, number];
  };
  area: number; // hectares
  pedology: {
    soilType: string;
    pH: number;
    phLevel: 'faible' | 'moyen' | 'élevé';
    organicMatter: number; // percentage
    organicMatterLevel: 'faible' | 'moyen' | 'élevé';
    texture: string;
  };
  hydrology: {
    waterTableDepth: number; // meters
    waterTableLevel: 'faible' | 'moyen' | 'élevé';
    annualFlow: number; // mm/year
    flowLevel: 'faible' | 'moyen' | 'élevé';
    drainageClass: string;
  };
  conservation: {
    kFactor: number;
    kLevel: 'faible' | 'moyen' | 'élevé';
    erosionRisk: 'faible' | 'moyen' | 'élevé';
    slopePercent: number;
    vegetationCover: number; // percentage
  };
  fertility: 'haute' | 'moyenne' | 'basse';
  aptitude: 'apte' | 'marginale' | 'inapte';
  polygon: [number, number][];
  scientificStatus: ScientificStatus;
}

export interface LayerState {
  fertility: boolean;
  hydrology: boolean;
  erosion: boolean;
}

export interface KPIData {
  totalParcels: number;
  erosionRisk: number;
  aptZones: number;
  avgFertility: number;
}
