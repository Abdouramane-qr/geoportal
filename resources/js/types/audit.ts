export type AuditAction = 
  | 'create'
  | 'update'
  | 'delete'
  | 'validate'
  | 'reject'
  | 'transfer'
  | 'attach_document';

export type EntityType = 
  | 'parcel'
  | 'land_rule'
  | 'user'
  | 'import_session'
  | 'document';

export interface AuditEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userRole: string;
  action: AuditAction;
  entityType: EntityType;
  entityId: string;
  entityName: string;
  field?: string;
  previousValue?: string;
  newValue?: string;
  justification: string;
  justificationType: 'scientific' | 'legal' | 'administrative';
  ipAddress: string;
  checksum: string;
}

export const ACTION_LABELS: Record<AuditAction, string> = {
  create: 'Création',
  update: 'Modification',
  delete: 'Suppression',
  validate: 'Validation',
  reject: 'Rejet',
  transfer: 'Transfert',
  attach_document: 'Ajout document',
};

export const ENTITY_LABELS: Record<EntityType, string> = {
  parcel: 'Parcelle',
  land_rule: 'Règle foncière',
  user: 'Utilisateur',
  import_session: 'Session d\'import',
  document: 'Document',
};

export const JUSTIFICATION_LABELS: Record<string, string> = {
  scientific: 'Scientifique',
  legal: 'Juridique',
  administrative: 'Administratif',
};
