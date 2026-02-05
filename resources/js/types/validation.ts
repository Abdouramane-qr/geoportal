export type ValidationStep = 'import' | 'detection' | 'correction' | 'validation';

export type ValidationStepStatus = 'pending' | 'active' | 'completed' | 'error';

export interface CorrectionProposal {
  field: string;
  originalValue: string | number;
  proposedValue: string | number;
  reason: string;
  accepted: boolean | null;
}

export interface ValidationRecord {
  id: string;
  parcelId: string;
  parcelName: string;
  originalData: Record<string, string | number>;
  errors: ValidationError[];
  corrections: CorrectionProposal[];
  currentStep: ValidationStep;
  stepStatus: Record<ValidationStep, ValidationStepStatus>;
  validatedBy: string | null;
  validatedAt: Date | null;
}

export interface ValidationError {
  field: string;
  value: string | number;
  rule: string;
  message: string;
  severity: 'error' | 'warning';
}

export const STEP_CONFIG: Record<ValidationStep, { label: string; description: string }> = {
  import: {
    label: 'Import',
    description: 'Données importées depuis le fichier source',
  },
  detection: {
    label: 'Détection',
    description: 'Analyse automatique des erreurs scientifiques',
  },
  correction: {
    label: 'Correction',
    description: 'Propositions de corrections automatiques',
  },
  validation: {
    label: 'Validation',
    description: 'Validation finale par un agronome',
  },
};
