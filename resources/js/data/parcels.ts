import type { ParcelData } from '@/types/parcel';

export const parcelsData: ParcelData[] = [
  {
    id: 'P001',
    name: 'Parcelle Nord-Est',
    location: {
      commune: 'Thiès',
      region: 'Thiès',
      coordinates: [14.79, -16.92],
    },
    area: 12.5,
    pedology: {
      soilType: 'Sols ferrugineux tropicaux',
      pH: 6.2,
      phLevel: 'moyen',
      organicMatter: 2.1,
      organicMatterLevel: 'moyen',
      texture: 'Sablo-limoneuse',
    },
    hydrology: {
      waterTableDepth: 8.5,
      waterTableLevel: 'moyen',
      annualFlow: 450,
      flowLevel: 'moyen',
      drainageClass: 'Bien drainé',
    },
    conservation: {
      kFactor: 0.28,
      kLevel: 'moyen',
      erosionRisk: 'moyen',
      slopePercent: 3.5,
      vegetationCover: 45,
    },
    fertility: 'moyenne',
    aptitude: 'apte',
    polygon: [
      [14.75, -17.0],
      [14.85, -17.0],
      [14.85, -16.85],
      [14.75, -16.85],
    ],
    scientificStatus: 'officiel',
  },
  {
    id: 'P002',
    name: 'Parcelle Centrale',
    location: {
      commune: 'Mbour',
      region: 'Thiès',
      coordinates: [14.42, -16.97],
    },
    area: 8.3,
    pedology: {
      soilType: 'Sols bruns subarides',
      pH: 7.1,
      phLevel: 'moyen',
      organicMatter: 3.2,
      organicMatterLevel: 'élevé',
      texture: 'Argilo-limoneuse',
    },
    hydrology: {
      waterTableDepth: 4.2,
      waterTableLevel: 'faible',
      annualFlow: 620,
      flowLevel: 'élevé',
      drainageClass: 'Modérément drainé',
    },
    conservation: {
      kFactor: 0.15,
      kLevel: 'faible',
      erosionRisk: 'faible',
      slopePercent: 1.2,
      vegetationCover: 72,
    },
    fertility: 'haute',
    aptitude: 'apte',
    polygon: [
      [14.35, -17.05],
      [14.50, -17.05],
      [14.50, -16.90],
      [14.35, -16.90],
    ],
    scientificStatus: 'valide',
  },
  {
    id: 'P003',
    name: 'Parcelle Sud',
    location: {
      commune: 'Fatick',
      region: 'Fatick',
      coordinates: [14.33, -16.41],
    },
    area: 15.8,
    pedology: {
      soilType: 'Sols halomorphes',
      pH: 8.4,
      phLevel: 'élevé',
      organicMatter: 0.8,
      organicMatterLevel: 'faible',
      texture: 'Argileuse',
    },
    hydrology: {
      waterTableDepth: 1.5,
      waterTableLevel: 'faible',
      annualFlow: 280,
      flowLevel: 'faible',
      drainageClass: 'Mal drainé',
    },
    conservation: {
      kFactor: 0.42,
      kLevel: 'élevé',
      erosionRisk: 'élevé',
      slopePercent: 6.8,
      vegetationCover: 18,
    },
    fertility: 'basse',
    aptitude: 'inapte',
    polygon: [
      [14.25, -16.50],
      [14.45, -16.50],
      [14.45, -16.30],
      [14.25, -16.30],
    ],
    scientificStatus: 'brouillon',
  },
  {
    id: 'P004',
    name: 'Parcelle Ouest',
    location: {
      commune: 'Kaolack',
      region: 'Kaolack',
      coordinates: [14.15, -16.07],
    },
    area: 22.1,
    pedology: {
      soilType: 'Sols ferralitiques',
      pH: 5.8,
      phLevel: 'faible',
      organicMatter: 1.9,
      organicMatterLevel: 'moyen',
      texture: 'Sableuse',
    },
    hydrology: {
      waterTableDepth: 12.3,
      waterTableLevel: 'élevé',
      annualFlow: 380,
      flowLevel: 'moyen',
      drainageClass: 'Excessivement drainé',
    },
    conservation: {
      kFactor: 0.35,
      kLevel: 'moyen',
      erosionRisk: 'moyen',
      slopePercent: 4.2,
      vegetationCover: 35,
    },
    fertility: 'moyenne',
    aptitude: 'marginale',
    polygon: [
      [14.05, -16.20],
      [14.25, -16.20],
      [14.25, -15.95],
      [14.05, -15.95],
    ],
    scientificStatus: 'valide',
  },
  {
    id: 'P005',
    name: 'Parcelle Delta',
    location: {
      commune: 'Saint-Louis',
      region: 'Saint-Louis',
      coordinates: [16.02, -16.50],
    },
    area: 18.7,
    pedology: {
      soilType: 'Sols alluviaux',
      pH: 6.8,
      phLevel: 'moyen',
      organicMatter: 4.1,
      organicMatterLevel: 'élevé',
      texture: 'Limoneuse',
    },
    hydrology: {
      waterTableDepth: 2.1,
      waterTableLevel: 'faible',
      annualFlow: 850,
      flowLevel: 'élevé',
      drainageClass: 'Bien drainé',
    },
    conservation: {
      kFactor: 0.12,
      kLevel: 'faible',
      erosionRisk: 'faible',
      slopePercent: 0.5,
      vegetationCover: 85,
    },
    fertility: 'haute',
    aptitude: 'apte',
    polygon: [
      [15.90, -16.60],
      [16.15, -16.60],
      [16.15, -16.40],
      [15.90, -16.40],
    ],
    scientificStatus: 'officiel',
  },
];

export const getKPIData = () => {
  const totalParcels = parcelsData.length;
  const erosionRisk = parcelsData.filter(p => p.conservation.erosionRisk === 'élevé').length;
  const aptZones = parcelsData.filter(p => p.aptitude === 'apte').length;
  const fertilityScores = parcelsData.map(p => 
    p.fertility === 'haute' ? 3 : p.fertility === 'moyenne' ? 2 : 1
  );
  const avgFertility = Math.round((fertilityScores.reduce((a, b) => a + b, 0) / totalParcels) * 33.3);

  return {
    totalParcels,
    erosionRisk,
    aptZones,
    avgFertility,
  };
};
