import type { ErosionRiskLevel } from '@/types/parcel-api';

export const getRiskColor = (level: ErosionRiskLevel): string => {
  switch (level) {
    case 'low':
      return 'fill-[#1a9850] stroke-[#006837]';
    case 'moderate':
      return 'fill-[#fdae61] stroke-[#f46d43]';
    case 'high':
      return 'fill-[#f46d43] stroke-[#d73027]';
    case 'critical':
      return 'fill-[#d73027] stroke-[#a50026]';
    default:
      return 'fill-gray-400 stroke-gray-600';
  }
};

export const getRiskLabel = (level: ErosionRiskLevel): string => {
  const labels: Record<ErosionRiskLevel, string> = {
    low: 'Risque Faible (< 5t/ha)',
    moderate: 'Risque Modéré (5-12t/ha)',
    high: 'Risque Élevé (12-25t/ha)',
    critical: 'Zone Critique (> 25t/ha)',
    unknown: 'Données insuffisantes',
  };

  return labels[level] ?? 'Inconnu';
};
