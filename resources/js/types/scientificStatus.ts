// Scientific data validation status system
// Provides institutional rigor and confidence in data quality

export type ScientificStatus = 'brouillon' | 'valide' | 'officiel';

export interface ScientificStatusConfig {
  label: string;
  description: string;
  mapStyle: {
    dashArray: string;
    weight: number;
    opacity: number;
    color: string;
  };
  badgeClass: string;
  iconName: 'FileEdit' | 'CheckCircle2' | 'BadgeCheck';
}

export const scientificStatusConfig: Record<ScientificStatus, ScientificStatusConfig> = {
  brouillon: {
    label: 'Brouillon',
    description: 'Données en cours de saisie, non vérifiées',
    mapStyle: {
      dashArray: '6, 6',
      weight: 2,
      opacity: 0.5,
      color: '#f97316', // Orange for draft
    },
    badgeClass: 'status-draft',
    iconName: 'FileEdit',
  },
  valide: {
    label: 'Validé scientifiquement',
    description: 'Données vérifiées par un expert agronome',
    mapStyle: {
      dashArray: '4, 2',
      weight: 2,
      opacity: 0.65,
      color: '#22c55e', // Green for validated
    },
    badgeClass: 'status-validated',
    iconName: 'CheckCircle2',
  },
  officiel: {
    label: 'Officiel',
    description: 'Données certifiées par l\'autorité compétente',
    mapStyle: {
      dashArray: '',
      weight: 4,
      opacity: 0.85,
      color: '#16a34a', // Dark green with thick border for official
    },
    badgeClass: 'status-official',
    iconName: 'BadgeCheck',
  },
};

export function getStatusConfig(status: ScientificStatus): ScientificStatusConfig {
  return scientificStatusConfig[status];
}
