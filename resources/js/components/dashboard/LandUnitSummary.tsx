import { AlertTriangle, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type {
  AptitudeClass,
  RiskInfo} from '@/types/landUnit';
import {
  aptitudeClasses,
} from '@/types/landUnit';

interface LandUnitSummaryProps {
  unitId: string;
  unitName: string;
  aptitude: AptitudeClass;
  mainRisk: RiskInfo;
  recommendation: string;
}

const aptitudeColors: Record<AptitudeClass, { bg: string; text: string; border: string }> = {
  S1: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/30' },
  S2: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/30' },
  S3: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30' },
  N1: { bg: 'bg-danger/10', text: 'text-danger', border: 'border-danger/30' },
  N2: { bg: 'bg-danger/10', text: 'text-danger', border: 'border-danger/30' },
};

const riskColors: Record<RiskInfo['level'], { bg: string; text: string; icon: typeof AlertTriangle }> = {
  faible: { bg: 'bg-success/10', text: 'text-success', icon: CheckCircle },
  moyen: { bg: 'bg-warning/10', text: 'text-warning', icon: AlertTriangle },
  élevé: { bg: 'bg-danger/10', text: 'text-danger', icon: XCircle },
};

export function LandUnitSummary({
  unitId,
  unitName,
  aptitude,
  mainRisk,
  recommendation,
}: LandUnitSummaryProps) {
  const aptitudeInfo = aptitudeClasses[aptitude];
  const aptitudeStyle = aptitudeColors[aptitude];
  const riskStyle = riskColors[mainRisk.level];
  const RiskIcon = riskStyle.icon;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* En-tête avec ID et nom */}
      <div className="px-4 py-3 bg-muted/30 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground font-mono">{unitId}</span>
            <h3 className="text-base font-semibold text-foreground">{unitName}</h3>
          </div>
          <Badge variant="outline" className="text-xs">
            Unité de Terre
          </Badge>
        </div>
      </div>

      {/* Indicateurs principaux */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Aptitude culturale */}
          <div className={cn(
            "p-3 rounded-lg border",
            aptitudeStyle.bg,
            aptitudeStyle.border
          )}>
            <div className="flex items-start gap-3">
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg font-bold text-lg",
                aptitudeStyle.bg,
                aptitudeStyle.text
              )}>
                {aptitude}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                  Aptitude culturale
                </span>
                <span className={cn("text-sm font-semibold", aptitudeStyle.text)}>
                  {aptitudeInfo.label}
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                  {aptitudeInfo.description}
                </p>
              </div>
            </div>
          </div>

          {/* Risque principal */}
          <div className={cn(
            "p-3 rounded-lg border",
            riskStyle.bg,
            `border-${mainRisk.level === 'faible' ? 'success' : mainRisk.level === 'moyen' ? 'warning' : 'danger'}/30`
          )}>
            <div className="flex items-start gap-3">
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg",
                riskStyle.bg
              )}>
                <RiskIcon size={20} className={riskStyle.text} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                  Risque principal
                </span>
                <div className="flex items-center gap-2">
                  <span className={cn("text-sm font-semibold", riskStyle.text)}>
                    {mainRisk.label}
                  </span>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-[9px] px-1.5 py-0 h-4",
                      riskStyle.text,
                      riskStyle.bg
                    )}
                  >
                    {mainRisk.level}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                  {mainRisk.description}
                </p>
              </div>
            </div>
          </div>

          {/* Recommandation */}
          <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Lightbulb size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                  Recommandation
                </span>
                <p className="text-sm font-medium text-foreground mt-0.5">
                  {recommendation}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
