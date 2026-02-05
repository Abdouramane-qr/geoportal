import { 
  X, 
  MapPin, 
  Layers, 
  Droplets, 
  Shield, 
  Lightbulb,
  HelpCircle,
  FlaskConical,
  ChevronRight,
} from 'lucide-react';
import { ParcelData } from '@/types/parcel';
import { ScientificStatus } from '@/types/scientificStatus';
import { ScientificStatusBadge } from '@/components/ui/scientific-status-badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  convertToFAOClass, 
  determineMainRisk, 
  generateRecommendation,
  faoClassDetails,
  RiskInfo,
} from '@/types/landUnit';

interface DetailedParcelPanelProps {
  parcel: ParcelData;
  scientificStatus: ScientificStatus;
  onClose: () => void;
}

// Badge qualificatif avec couleur
function QualifierBadge({ level }: { level: 'faible' | 'moyen' | 'élevé' }) {
  const styles = {
    faible: 'qualifier-badge qualifier-low',
    moyen: 'qualifier-badge qualifier-medium',
    élevé: 'qualifier-badge qualifier-high',
  };

  const labels = {
    faible: 'Faible',
    moyen: 'Moyen',
    élevé: 'Élevé',
  };

  return <span className={styles[level]}>{labels[level]}</span>;
}

// Ligne d'information avec aide contextuelle
function InfoRow({ 
  label, 
  value, 
  qualifier,
  helpText,
}: { 
  label: string; 
  value: string | number; 
  qualifier?: 'faible' | 'moyen' | 'élevé';
  helpText?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-b-0">
      <div className="flex items-center gap-1.5">
        <span className="info-label">{label}</span>
        {helpText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle size={12} className="text-muted-foreground/60 cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-xs">{helpText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="info-value">{value}</span>
        {qualifier && <QualifierBadge level={qualifier} />}
      </div>
    </div>
  );
}

// Section pliable
function Section({ 
  title, 
  icon: Icon, 
  iconColor,
  children,
}: { 
  title: string; 
  icon: React.ElementType;
  iconColor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="info-section">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} className={iconColor} />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className="pl-6">{children}</div>
    </div>
  );
}

// Badge d'aptitude FAO
function AptitudeBadge({ aptitude }: { aptitude: string }) {
  const info = faoClassDetails[aptitude as keyof typeof faoClassDetails];
  if (!info) return <span className="text-sm">{aptitude}</span>;

  const colorClasses: Record<string, string> = {
    S1: 'bg-success/20 text-success border-success/30',
    S2: 'bg-success/15 text-success border-success/20',
    S3: 'bg-warning/20 text-warning border-warning/30',
    N1: 'bg-danger/15 text-danger border-danger/20',
    N2: 'bg-danger/20 text-danger border-danger/30',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm font-bold border ${colorClasses[aptitude] || ''}`}>
      {aptitude}
    </span>
  );
}

export function DetailedParcelPanel({ 
  parcel, 
  scientificStatus,
  onClose,
}: DetailedParcelPanelProps) {
  // Calculs dérivés
  const faoClass = convertToFAOClass(
    parcel.aptitude,
    parcel.fertility,
    parcel.conservation.erosionRisk
  );
  const mainRisk = determineMainRisk(parcel);
  const recommendation = generateRecommendation(faoClass, mainRisk);
  const faoInfo = faoClassDetails[faoClass as keyof typeof faoClassDetails];

  const getRiskColorClass = (risk: RiskInfo): string => {
    if (risk.level === 'faible') return 'bg-success/15 text-success';
    if (risk.level === 'élevé') return 'bg-danger/15 text-danger';
    return 'bg-warning/15 text-warning';
  };

  return (
    <div className="w-96 bg-card border-l border-border h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border p-4 z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-semibold text-foreground text-lg">{parcel.name}</h2>
            </div>
            <p className="text-sm text-muted-foreground">ID: {parcel.id}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
        
        {/* Status badge */}
        <div className="mt-3">
          <ScientificStatusBadge status={scientificStatus} size="md" />
        </div>
      </div>

      <div className="p-4 space-y-0">
        {/* RÉSUMÉ DÉCISIONNEL */}
        <Section title="Résumé décisionnel" icon={Lightbulb} iconColor="text-warning">
          <div className="space-y-3 bg-muted/30 rounded-lg p-3 -ml-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Aptitude FAO</span>
              <div className="flex items-center gap-2">
                <AptitudeBadge aptitude={faoClass} />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle size={14} className="text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <p className="font-medium">{faoInfo?.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{faoInfo?.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Risque principal</span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getRiskColorClass(mainRisk)}`}>
                {mainRisk.label}
              </span>
            </div>
            
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Recommandation</p>
              <p className="text-sm text-foreground leading-relaxed">{recommendation}</p>
            </div>
          </div>
        </Section>

        {/* SOL (Pédologie) */}
        <Section title="Sol" icon={Layers} iconColor="text-secondary">
          <InfoRow 
            label="Type de sol" 
            value={parcel.pedology.soilType}
            helpText="Classification pédologique selon le référentiel national"
          />
          <InfoRow 
            label="Texture" 
            value={parcel.pedology.texture}
            helpText="Proportion relative d'argile, limon et sable"
          />
          <InfoRow 
            label="pH" 
            value={parcel.pedology.pH.toFixed(1)} 
            qualifier={parcel.pedology.phLevel}
            helpText="Acidité du sol. Optimal entre 6.0 et 7.5 pour la plupart des cultures"
          />
          <InfoRow 
            label="Matière organique" 
            value={`${parcel.pedology.organicMatter}%`} 
            qualifier={parcel.pedology.organicMatterLevel}
            helpText="Indicateur clé de fertilité. >3% est considéré bon"
          />
          <InfoRow 
            label="Phosphore" 
            value="—"
            helpText="Phosphore assimilable (P2O5). Donnée non disponible"
          />
        </Section>

        {/* EAU (Hydrologie) */}
        <Section title="Eau" icon={Droplets} iconColor="text-info">
          <InfoRow 
            label="Profondeur nappe" 
            value={`${parcel.hydrology.waterTableDepth} m`} 
            qualifier={parcel.hydrology.waterTableLevel}
            helpText="Profondeur moyenne de la nappe phréatique"
          />
          <InfoRow 
            label="Débit annuel" 
            value={`${parcel.hydrology.annualFlow} mm/an`} 
            qualifier={parcel.hydrology.flowLevel}
            helpText="Précipitations effectives utilisables par les cultures"
          />
          <InfoRow 
            label="Classe de drainage" 
            value={parcel.hydrology.drainageClass}
            helpText="Capacité du sol à évacuer l'excès d'eau"
          />
          <InfoRow 
            label="Eau utile" 
            value="—"
            helpText="Réserve en eau facilement utilisable. Donnée non disponible"
          />
        </Section>

        {/* CONSERVATION */}
        <Section title="Conservation" icon={Shield} iconColor="text-danger">
          <InfoRow 
            label="Facteur K" 
            value={parcel.conservation.kFactor.toFixed(2)} 
            qualifier={parcel.conservation.kLevel}
            helpText="Érodibilité du sol (équation USLE). Plus la valeur est élevée, plus le sol est sensible à l'érosion"
          />
          <InfoRow 
            label="Risque d'érosion" 
            value={parcel.conservation.erosionRisk.charAt(0).toUpperCase() + parcel.conservation.erosionRisk.slice(1)} 
            qualifier={parcel.conservation.erosionRisk}
            helpText="Évaluation globale du risque de perte de sol"
          />
          <InfoRow 
            label="Pente" 
            value={`${parcel.conservation.slopePercent}%`}
            helpText="Inclinaison moyenne du terrain. >8% augmente significativement le risque d'érosion"
          />
          <InfoRow 
            label="Couverture végétale" 
            value={`${parcel.conservation.vegetationCover}%`}
            helpText="Taux de couverture protégeant le sol. >60% est recommandé"
          />
          
          {/* Conseil de conservation */}
          {parcel.conservation.erosionRisk !== 'faible' && (
            <div className="mt-3 p-2.5 bg-danger/5 border border-danger/20 rounded-md">
              <div className="flex items-start gap-2">
                <ChevronRight size={14} className="text-danger mt-0.5 flex-shrink-0" />
                <p className="text-xs text-foreground leading-relaxed">
                  {parcel.conservation.erosionRisk === 'élevé' 
                    ? "Mesures anti-érosives urgentes recommandées : bandes enherbées, cultures de couverture, aménagements en courbes de niveau."
                    : "Maintenir la couverture végétale et envisager des pratiques de conservation préventives."}
                </p>
              </div>
            </div>
          )}
        </Section>

        {/* STATUT SCIENTIFIQUE */}
        <Section title="Statut de la donnée" icon={FlaskConical} iconColor="text-primary">
          <div className="space-y-3 -ml-6 pl-6">
            <div className="flex items-center justify-between py-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Niveau de validation</span>
              <ScientificStatusBadge status={scientificStatus} size="sm" />
            </div>
            
            <div className="text-xs text-muted-foreground bg-muted/30 rounded p-2.5 leading-relaxed">
              {scientificStatus === 'brouillon' && (
                "Ces données sont en cours de collecte ou de saisie. Elles n'ont pas encore été vérifiées par un expert et peuvent contenir des erreurs."
              )}
              {scientificStatus === 'valide' && (
                "Ces données ont été vérifiées et validées par un expert agronome. Elles sont fiables pour la prise de décision technique."
              )}
              {scientificStatus === 'officiel' && (
                "Ces données sont officiellement certifiées par l'autorité compétente. Elles font foi pour les démarches administratives et juridiques."
              )}
            </div>
          </div>
        </Section>

        {/* Localisation */}
        <Section title="Localisation" icon={MapPin} iconColor="text-primary">
          <InfoRow label="Commune" value={parcel.location.commune} />
          <InfoRow label="Région" value={parcel.location.region} />
          <InfoRow label="Superficie" value={`${parcel.area} ha`} />
          <InfoRow 
            label="Coordonnées" 
            value={`${parcel.location.coordinates[0].toFixed(4)}°, ${parcel.location.coordinates[1].toFixed(4)}°`} 
          />
        </Section>
      </div>
    </div>
  );
}
