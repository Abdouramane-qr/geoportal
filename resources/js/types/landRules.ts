export type RuleStatus = 'valide' | 'conflit' | 'révision';

export interface LandRule {
  id: string;
  zoneName: string;
  polygon: [number, number][];
  ruleText: string;
  documents: DocumentAttachment[];
  status: RuleStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface DocumentAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
}
