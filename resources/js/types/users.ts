export type UserRole = 'agronome' | 'admin' | 'autorite';

export interface Permission {
  id: string;
  label: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  region?: string;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    'Gérer les utilisateurs',
    'Modifier les données',
    'Valider les imports',
    'Gérer les règles foncières',
    'Accès complet au système',
  ],
  agronome: [
    'Consulter les données',
    'Importer des données',
    'Modifier les parcelles',
    'Générer des rapports',
  ],
  autorite: [
    'Consulter les données',
    'Valider les règles foncières',
    'Consulter les rapports',
  ],
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrateur',
  agronome: 'Agronome',
  autorite: 'Autorité locale',
};
