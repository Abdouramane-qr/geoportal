// Classification FAO pour l'aptitude culturale
export type AptitudeClass = 'S1' | 'S2' | 'S3' | 'N1' | 'N2';

export interface AptitudeInfo {
  class: AptitudeClass;
  label: string;
  description: string;
}

export interface FAOClassInfo {
  label: string;
  description: string;
}

export const faoClassDetails: Record<AptitudeClass, FAOClassInfo> = {
  S1: {
    label: 'Très apte',
    description: 'Terres hautement appropriées sans limitations significatives pour la culture',
  },
  S2: {
    label: 'Modérément apte',
    description: 'Terres appropriées avec des limitations modérées qui réduisent les rendements',
  },
  S3: {
    label: 'Marginalement apte',
    description: 'Terres appropriées avec des limitations sévères qui réduisent fortement les rendements',
  },
  N1: {
    label: 'Actuellement inapte',
    description: 'Terres non appropriées mais avec des limitations potentiellement corrigeables',
  },
  N2: {
    label: 'Définitivement inapte',
    description: 'Terres non appropriées avec des limitations permanentes et non corrigeables',
  },
};

export const aptitudeClasses: Record<AptitudeClass, AptitudeInfo> = {
  S1: {
    class: 'S1',
    label: 'Très apte',
    description: 'Terres hautement appropriées sans limitations significatives',
  },
  S2: {
    class: 'S2',
    label: 'Modérément apte',
    description: 'Terres appropriées avec limitations modérées',
  },
  S3: {
    class: 'S3',
    label: 'Marginalement apte',
    description: 'Terres appropriées avec limitations sévères',
  },
  N1: {
    class: 'N1',
    label: 'Actuellement inapte',
    description: 'Terres non appropriées avec limitations corrigeables',
  },
  N2: {
    class: 'N2',
    label: 'Définitivement inapte',
    description: 'Terres non appropriées avec limitations permanentes',
  },
};

export type RiskType = 
  | 'erosion'
  | 'deficit_hydrique'
  | 'acidite'
  | 'salinite'
  | 'drainage'
  | 'pente';

export interface RiskInfo {
  type: RiskType;
  label: string;
  level: 'faible' | 'moyen' | 'élevé';
  description: string;
}

export const riskLabels: Record<RiskType, string> = {
  erosion: 'Érosion',
  deficit_hydrique: 'Déficit hydrique',
  acidite: 'Acidité du sol',
  salinite: 'Salinité',
  drainage: 'Mauvais drainage',
  pente: 'Pente excessive',
};

export interface LandUnitSummary {
  id: string;
  name: string;
  aptitude: AptitudeClass;
  mainRisk: RiskInfo;
  recommendation: string;
}

// Fonction pour convertir l'aptitude existante vers la classification FAO
export function convertToFAOClass(
  aptitude: 'apte' | 'marginale' | 'inapte',
  fertility: 'haute' | 'moyenne' | 'basse',
  erosionRisk: 'faible' | 'moyen' | 'élevé'
): AptitudeClass {
  if (aptitude === 'apte') {
    if (fertility === 'haute' && erosionRisk === 'faible') return 'S1';
    return 'S2';
  }
  if (aptitude === 'marginale') {
    return 'S3';
  }
  // inapte
  if (erosionRisk === 'élevé') return 'N2';
  return 'N1';
}

// Déterminer le risque principal
export function determineMainRisk(parcel: {
  conservation: { erosionRisk: 'faible' | 'moyen' | 'élevé' };
  hydrology: { flowLevel: 'faible' | 'moyen' | 'élevé'; drainageClass: string };
  pedology: { phLevel: 'faible' | 'moyen' | 'élevé' };
}): RiskInfo {
  const { conservation, hydrology, pedology } = parcel;

  // Priorité des risques
  if (conservation.erosionRisk === 'élevé') {
    return {
      type: 'erosion',
      label: 'Érosion',
      level: 'élevé',
      description: 'Risque majeur de perte de sol',
    };
  }

  if (hydrology.flowLevel === 'faible') {
    return {
      type: 'deficit_hydrique',
      label: 'Déficit hydrique',
      level: 'élevé',
      description: 'Apport en eau insuffisant',
    };
  }

  if (pedology.phLevel === 'faible') {
    return {
      type: 'acidite',
      label: 'Acidité du sol',
      level: 'moyen',
      description: 'pH trop bas pour certaines cultures',
    };
  }

  if (hydrology.drainageClass.toLowerCase().includes('mal')) {
    return {
      type: 'drainage',
      label: 'Mauvais drainage',
      level: 'moyen',
      description: 'Évacuation de l\'eau insuffisante',
    };
  }

  if (conservation.erosionRisk === 'moyen') {
    return {
      type: 'erosion',
      label: 'Érosion',
      level: 'moyen',
      description: 'Risque modéré de perte de sol',
    };
  }

  return {
    type: 'erosion',
    label: 'Aucun risque majeur',
    level: 'faible',
    description: 'Conditions favorables',
  };
}

// Générer une recommandation synthétique
export function generateRecommendation(
  aptitude: AptitudeClass,
  mainRisk: RiskInfo
): string {
  const recommendations: Record<AptitudeClass, Record<RiskType, string>> = {
    S1: {
      erosion: 'Culture intensive recommandée avec rotation standard',
      deficit_hydrique: 'Irrigation complémentaire optionnelle',
      acidite: 'Chaulage léger recommandé',
      salinite: 'Aucune action requise',
      drainage: 'Aucune action requise',
      pente: 'Aucune action requise',
    },
    S2: {
      erosion: 'Cultures pérennes ou bandes enherbées conseillées',
      deficit_hydrique: 'Irrigation complémentaire nécessaire',
      acidite: 'Chaulage régulier recommandé',
      salinite: 'Choix de variétés tolérantes',
      drainage: 'Amélioration du drainage conseillée',
      pente: 'Cultures en courbes de niveau',
    },
    S3: {
      erosion: 'Agroforesterie ou pâturage extensif uniquement',
      deficit_hydrique: 'Cultures résistantes à la sécheresse',
      acidite: 'Amendement calcaire obligatoire',
      salinite: 'Lessivage et cultures halophytes',
      drainage: 'Drainage artificiel nécessaire',
      pente: 'Terrasses obligatoires',
    },
    N1: {
      erosion: 'Restauration du couvert végétal prioritaire',
      deficit_hydrique: 'Mise en jachère ou reboisement',
      acidite: 'Correction pH avant toute culture',
      salinite: 'Réhabilitation des sols salins',
      drainage: 'Assainissement complet requis',
      pente: 'Non exploitable sans aménagement majeur',
    },
    N2: {
      erosion: 'Protection et conservation uniquement',
      deficit_hydrique: 'Zone de conservation naturelle',
      acidite: 'Non cultivable - zone tampon',
      salinite: 'Non récupérable - zone humide',
      drainage: 'Non exploitable',
      pente: 'Zone de protection forestière',
    },
  };

  return recommendations[aptitude][mainRisk.type] || 'Analyse détaillée requise';
}
