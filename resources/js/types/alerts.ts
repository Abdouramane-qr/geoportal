export type AlertType = 'erosion' | 'water_deficit' | 'crop_incompatibility';

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface PredictiveAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  parcelId: string;
  parcelName: string;
  title: string;
  description: string;
  cause: string;
  recommendation: string;
  indicators: AlertIndicator[];
  createdAt: Date;
  acknowledged: boolean;
}

export interface AlertIndicator {
  name: string;
  value: number;
  threshold: number;
  unit: string;
  exceeded: boolean;
}

export const ALERT_TYPE_CONFIG: Record<AlertType, { 
  label: string; 
  icon: string;
  color: string;
}> = {
  erosion: {
    label: 'Risque d\'érosion',
    icon: 'mountain-snow',
    color: 'warning',
  },
  water_deficit: {
    label: 'Déficit hydrique',
    icon: 'droplets',
    color: 'info',
  },
  crop_incompatibility: {
    label: 'Incompatibilité culturale',
    icon: 'wheat-off',
    color: 'danger',
  },
};

export const SEVERITY_CONFIG: Record<AlertSeverity, {
  label: string;
  className: string;
}> = {
  low: { label: 'Faible', className: 'bg-muted text-muted-foreground' },
  medium: { label: 'Modéré', className: 'bg-warning/15 text-warning' },
  high: { label: 'Élevé', className: 'bg-danger/15 text-danger' },
  critical: { label: 'Critique', className: 'bg-danger text-danger-foreground' },
};
