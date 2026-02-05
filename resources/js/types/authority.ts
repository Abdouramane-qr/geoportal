export type ConflictStatus = 'actif' | 'en_cours' | 'résolu';
export type ConflictPriority = 'haute' | 'moyenne' | 'basse';
export type ZoneSensitivity = 'critique' | 'élevée' | 'modérée';

export interface LandConflict {
  id: string;
  parcelIds: string[];
  parcelNames: string[];
  type: 'chevauchement' | 'limite_contestée' | 'usage_non_conforme' | 'occupation_illégale';
  description: string;
  status: ConflictStatus;
  priority: ConflictPriority;
  parties: string[];
  reportedAt: Date;
  lastUpdate: Date;
  commune: string;
}

export interface SensitiveZone {
  id: string;
  name: string;
  type: 'zone_protégée' | 'zone_inondable' | 'patrimoine' | 'réserve_foncière';
  sensitivity: ZoneSensitivity;
  area: number; // hectares
  restrictions: string[];
  commune: string;
  coordinates: [number, number];
}

export interface DecisionSummary {
  id: string;
  title: string;
  type: 'attribution' | 'régularisation' | 'interdiction' | 'délimitation';
  date: Date;
  status: 'en_attente' | 'approuvée' | 'refusée';
  commune: string;
  parcelId?: string;
  parcelName?: string;
  summary: string;
}

export const CONFLICT_TYPE_LABELS: Record<LandConflict['type'], string> = {
  chevauchement: 'Chevauchement de limites',
  limite_contestée: 'Limite contestée',
  usage_non_conforme: 'Usage non conforme',
  occupation_illégale: 'Occupation illégale',
};

export const ZONE_TYPE_LABELS: Record<SensitiveZone['type'], string> = {
  zone_protégée: 'Zone protégée',
  zone_inondable: 'Zone inondable',
  patrimoine: 'Patrimoine',
  réserve_foncière: 'Réserve foncière',
};

export const DECISION_TYPE_LABELS: Record<DecisionSummary['type'], string> = {
  attribution: 'Attribution',
  régularisation: 'Régularisation',
  interdiction: 'Interdiction',
  délimitation: 'Délimitation',
};
