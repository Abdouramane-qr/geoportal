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
  CheckCircle2,
} from 'lucide-react';
import { ParcelData } from '@/types/parcel';
import { ScientificStatus } from '@/types/scientificStatus';
import { ScientificStatusBadge } from '@/components/ui/scientific-status-badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  convertToFAOClass, 
  determineMainRisk, 
  generateRecommendation,
  faoClassDetails,
  RiskInfo,
} from '@/types/landUnit';
import { toast } from 'sonner';

interface ParcelDetailsSidebarProps {
  parcel: ParcelData | null;
  isOpen: boolean;
  onClose: () => void;
  onValidate?: (parcelId: string) => void;
}

// Visual gauge component for scientific values
function DataGauge({ 
  label, 
  value, 
  min, 
  max, 
  unit,
  optimalMin,
  optimalMax,
  helpText,
}: { 
  label: string; 
  value: number; 
  min: number;
  max: number;
  unit?: string;
  optimalMin?: number;
  optimalMax?: number;
  helpText?: string;
}) {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  
  // Determine color based on optimal range
  let colorClass = 'bg-primary';
  if (optimalMin !== undefined && optimalMax !== undefined) {
    if (value >= optimalMin && value <= optimalMax) {
      colorClass = 'bg-success';
    } else if (value < optimalMin * 0.8 || value > optimalMax * 1.2) {
      colorClass = 'bg-danger';
    } else {
      colorClass = 'bg-warning';
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
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
        <span className="text-sm font-semibold text-foreground">
          {value.toFixed(1)}{unit && ` ${unit}`}
        </span>
      </div>
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={`absolute left-0 top-0 h-full rounded-full transition-all ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
        {/* Optimal range indicator */}
        {optimalMin !== undefined && optimalMax !== undefined && (
          <div 
            className="absolute top-0 h-full border-l-2 border-r-2 border-success/50 bg-success/10"
            style={{ 
              left: `${((optimalMin - min) / (max - min)) * 100}%`,
              width: `${((optimalMax - optimalMin) / (max - min)) * 100}%`,
            }}
          />
        )}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

// FAO Aptitude Badge with color coding
function AptitudeBadge({ aptitude }: { aptitude: string }) {
  const info = faoClassDetails[aptitude as keyof typeof faoClassDetails];
  if (!info) return <span className="text-sm">{aptitude}</span>;

  const colorClasses: Record<string, string> = {
    S1: 'bg-success text-success-foreground',
    S2: 'bg-success/80 text-success-foreground',
    S3: 'bg-warning text-warning-foreground',
    N1: 'bg-danger/80 text-danger-foreground',
    N2: 'bg-danger text-danger-foreground',
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold ${colorClasses[aptitude] || 'bg-muted'}`}>
        {aptitude}
      </span>
      <span className="text-xs text-muted-foreground text-center">{info.label}</span>
    </div>
  );
}

// Section component
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
    <div className="py-4 border-b border-border last:border-b-0">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} className={iconColor} />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

// Info row for simple values
function InfoRow({ 
  label, 
  value, 
}: { 
  label: string; 
  value: string | number; 
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export function ParcelDetailsSidebar({ 
  parcel, 
  isOpen,
  onClose,
  onValidate,
}: ParcelDetailsSidebarProps) {
  if (!parcel) return null;

  // Computed values
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

  const handleValidate = () => {
    if (onValidate) {
      onValidate(parcel.id);
      toast.success(`Parcelle ${parcel.name} validée scientifiquement`, {
        description: 'Le statut a été mis à jour en base de données.',
      });
    }
  };

  const canValidate = parcel.scientificStatus === 'brouillon' || parcel.scientificStatus === 'valide';

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[420px] sm:max-w-[420px] p-0">
        <SheetHeader className="sticky top-0 bg-card border-b border-border p-4 z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <SheetTitle className="text-lg font-semibold text-foreground">
                {parcel.name}
              </SheetTitle>
              <p className="text-sm text-muted-foreground mt-0.5">ID: {parcel.id}</p>
            </div>
          </div>
          
          {/* Status badge */}
          <div className="mt-3">
            <ScientificStatusBadge status={parcel.scientificStatus} size="md" />
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-4 space-y-0">
            {/* RÉSUMÉ - FAO Badge */}
            <Section title="Résumé" icon={Lightbulb} iconColor="text-warning">
              <div className="flex items-center justify-center py-4">
                <AptitudeBadge aptitude={faoClass} />
              </div>
              
              <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Risque principal</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getRiskColorClass(mainRisk)}`}>
                    {mainRisk.label}
                  </span>
                </div>
                
                <div className="pt-2 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Recommandation</p>
                  <p className="text-sm text-foreground leading-relaxed">{recommendation}</p>
                </div>
              </div>
            </Section>

            {/* PÉDOLOGIE avec jauges */}
            <Section title="Pédologie" icon={Layers} iconColor="text-secondary">
              <DataGauge 
                label="pH du sol"
                value={parcel.pedology.pH}
                min={0}
                max={14}
                optimalMin={6.0}
                optimalMax={7.5}
                helpText="Acidité du sol. Optimal entre 6.0 et 7.5 pour la plupart des cultures"
              />
              
              <DataGauge 
                label="Phosphore (P2O5)"
                value={25} // Simulated value
                min={0}
                max={100}
                unit="mg/kg"
                optimalMin={20}
                optimalMax={60}
                helpText="Phosphore assimilable. >20 mg/kg est considéré bon"
              />
              
              <DataGauge 
                label="Matière Organique"
                value={parcel.pedology.organicMatter}
                min={0}
                max={10}
                unit="%"
                optimalMin={2}
                optimalMax={5}
                helpText="Indicateur clé de fertilité. >3% est considéré bon"
              />
              
              <InfoRow label="Type de sol" value={parcel.pedology.soilType} />
              <InfoRow label="Texture" value={parcel.pedology.texture} />
            </Section>

            {/* HYDROLOGIE */}
            <Section title="Hydrologie" icon={Droplets} iconColor="text-info">
              <DataGauge 
                label="Profondeur nappe"
                value={parcel.hydrology.waterTableDepth}
                min={0}
                max={20}
                unit="m"
                optimalMin={3}
                optimalMax={12}
                helpText="Profondeur moyenne de la nappe phréatique"
              />
              
              <DataGauge 
                label="Débit annuel"
                value={parcel.hydrology.annualFlow}
                min={0}
                max={1000}
                unit="mm/an"
                optimalMin={400}
                optimalMax={800}
                helpText="Précipitations effectives utilisables par les cultures"
              />
              
              <InfoRow label="Classe de drainage" value={parcel.hydrology.drainageClass} />
            </Section>

            {/* CONSERVATION */}
            <Section title="Conservation" icon={Shield} iconColor="text-danger">
              <DataGauge 
                label="Facteur K (érodibilité)"
                value={parcel.conservation.kFactor}
                min={0}
                max={0.7}
                optimalMin={0}
                optimalMax={0.25}
                helpText="Plus la valeur est élevée, plus le sol est sensible à l'érosion"
              />
              
              <DataGauge 
                label="Pente"
                value={parcel.conservation.slopePercent}
                min={0}
                max={30}
                unit="%"
                optimalMin={0}
                optimalMax={8}
                helpText=">8% augmente significativement le risque d'érosion"
              />
              
              <DataGauge 
                label="Couverture végétale"
                value={parcel.conservation.vegetationCover}
                min={0}
                max={100}
                unit="%"
                optimalMin={60}
                optimalMax={100}
                helpText="Taux de couverture protégeant le sol. >60% est recommandé"
              />
              
              {/* Conservation warning */}
              {parcel.conservation.erosionRisk !== 'faible' && (
                <div className="mt-3 p-2.5 bg-danger/5 border border-danger/20 rounded-md">
                  <div className="flex items-start gap-2">
                    <ChevronRight size={14} className="text-danger mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-foreground leading-relaxed">
                      {parcel.conservation.erosionRisk === 'élevé' 
                        ? "Mesures anti-érosives urgentes recommandées : bandes enherbées, cultures de couverture."
                        : "Maintenir la couverture végétale et pratiques de conservation préventives."}
                    </p>
                  </div>
                </div>
              )}
            </Section>

            {/* LOCALISATION */}
            <Section title="Localisation" icon={MapPin} iconColor="text-primary">
              <InfoRow label="Commune" value={parcel.location.commune} />
              <InfoRow label="Région" value={parcel.location.region} />
              <InfoRow label="Superficie" value={`${parcel.area} ha`} />
              <InfoRow 
                label="Coordonnées" 
                value={`${parcel.location.coordinates[0].toFixed(4)}°, ${parcel.location.coordinates[1].toFixed(4)}°`} 
              />
            </Section>

            {/* STATUT */}
            <Section title="Statut de la donnée" icon={FlaskConical} iconColor="text-primary">
              <div className="flex items-center justify-between py-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Niveau de validation</span>
                <ScientificStatusBadge status={parcel.scientificStatus} size="sm" />
              </div>
              
              <div className="text-xs text-muted-foreground bg-muted/30 rounded p-2.5 leading-relaxed">
                {parcel.scientificStatus === 'brouillon' && (
                  "Ces données n'ont pas encore été vérifiées par un expert."
                )}
                {parcel.scientificStatus === 'valide' && (
                  "Ces données ont été vérifiées et validées par un expert agronome."
                )}
                {parcel.scientificStatus === 'officiel' && (
                  "Ces données sont officiellement certifiées par l'autorité compétente."
                )}
              </div>
            </Section>
          </div>
        </ScrollArea>

        {/* Action Button */}
        {canValidate && (
          <div className="sticky bottom-0 bg-card border-t border-border p-4">
            <Button 
              onClick={handleValidate}
              className="w-full"
              size="lg"
            >
              <CheckCircle2 size={18} className="mr-2" />
              {parcel.scientificStatus === 'brouillon' 
                ? 'Valider scientifiquement' 
                : 'Certifier comme officiel'}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
