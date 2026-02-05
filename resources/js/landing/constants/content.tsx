import type { Feature, UseCase } from '@/landing/types/landing.types';
import {
  ClipboardCheck,
  FileText,
  Layers,
  LineChart,
  Lock,
  ShieldCheck,
} from 'lucide-react';

export const HERO_CONTENT = {
  headline:
    'La plateforme SIG agricole de référence pour des décisions publiques fiables et traçables',
  subheadline:
    'LandSense Hub centralise les données sol, eau et foncier dans une interface lisible et auditée',
  ctaPrimary: 'Demander une démonstration',
  ctaSecondary: 'Recevoir la documentation',
  ctaMap: 'Accéder à la carte',
};

export const FEATURES_DATA: Feature[] = [
  {
    id: 'multi-couches',
    icon: <Layers size={18} />,
    title: 'Cartographie Multi-Couches',
    description: 'Données sol, eau et foncier superposées pour une lecture globale.',
  },
  {
    id: 'validation',
    icon: <ClipboardCheck size={18} />,
    title: 'Validation Scientifique',
    description: 'Les équipes techniques valident chaque donnée avant publication.',
  },
  {
    id: 'traceabilite',
    icon: <FileText size={18} />,
    title: 'Traçabilité Complète',
    description: 'Historique des modifications documenté et accessible.',
  },
  {
    id: 'audit',
    icon: <LineChart size={18} />,
    title: 'Audits Exploitables',
    description: 'Rapports conformes et prêts pour la gouvernance institutionnelle.',
  },
  {
    id: 'acces',
    icon: <Lock size={18} />,
    title: 'Accès Multi-Niveaux',
    description: 'Droits granulaires par rôle institutionnel et unité territoriale.',
  },
  {
    id: 'export',
    icon: <ShieldCheck size={18} />,
    title: 'Export Standardisé',
    description: 'Formats compatibles avec les décisions publiques et la conformité.',
  },
];

export const USE_CASES_DATA: UseCase[] = [
  {
    id: 'planification',
    role: "Ministère de l'Agriculture",
    title: 'Planification Agricole Régionale',
    description:
      'Identifier les zones aptes au maraîchage irrigué pour le programme national.',
    imageSrc: '/images/landing/planification.svg',
    imageAlt: 'Carte de planification agricole régionale',
  },
  {
    id: 'conflits',
    role: 'Collectivité Territoriale',
    title: 'Gestion des Conflits Fonciers',
    description:
      'Arbitrer les litiges avec des données cadastrales vérifiées et horodatées.',
    imageSrc: '/images/landing/conflits.svg',
    imageAlt: 'Interface d’arbitrage foncier avec audit',
  },
  {
    id: 'hydraulique',
    role: 'Bailleur International',
    title: 'Évaluation de Projets Hydrauliques',
    description:
      'Prioriser les forages selon la profondeur de nappe et le besoin.',
    imageSrc: '/images/landing/hydraulique.svg',
    imageAlt: 'Analyse hydrologique pour projets de forage',
  },
  {
    id: 'suivi',
    role: 'ONG Développement',
    title: 'Suivi Programmes Agricoles',
    description:
      "Monitorer l'impact des formations techniques sur 500 parcelles.",
    imageSrc: '/images/landing/suivi.svg',
    imageAlt: 'Tableau de suivi des programmes agricoles',
  },
];
