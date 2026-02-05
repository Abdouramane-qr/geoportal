export type ImportStatus = 'brouillon' | 'validé' | 'rejeté';

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationIssue {
  row: number;
  column: string;
  value: string;
  message: string;
  severity: ValidationSeverity;
}

export interface ImportedRow {
  id: string;
  data: Record<string, string | number | null>;
  issues: ValidationIssue[];
  isValid: boolean;
}

export interface ImportSession {
  id: string;
  fileName: string;
  fileType: 'csv' | 'excel' | 'shapefile' | 'json' | 'geojson';
  uploadedAt: Date;
  status: ImportStatus;
  totalRows: number;
  validRows: number;
  errorRows: number;
  rows: ImportedRow[];
}

// Scientific validation rules
export const VALIDATION_RULES = {
  pH: { min: 0, max: 14, label: 'pH' },
  organicMatter: { min: 0, max: 100, label: 'Matière organique (%)' },
  slope: { min: 0, max: 90, label: 'Pente (%)' },
  waterTableDepth: { min: 0, max: 500, label: 'Profondeur nappe (m)' },
  kFactor: { min: 0, max: 1, label: 'Facteur K' },
  vegetationCover: { min: 0, max: 100, label: 'Couverture végétale (%)' },
  area: { min: 0, max: 100000, label: 'Superficie (ha)' },
};
