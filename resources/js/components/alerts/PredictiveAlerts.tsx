import { 
  Mountain, 
  Droplets, 
  Wheat, 
  AlertTriangle, 
  ChevronRight, 
  MapPin,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { 
  PredictiveAlert, 
  AlertType, 
  AlertSeverity} from '@/types/alerts';
import {
  SEVERITY_CONFIG 
} from '@/types/alerts';

interface PredictiveAlertsProps {
  alerts: PredictiveAlert[];
  onAcknowledge: (alertId: string) => void;
  onNavigateToParcel?: (parcelId: string) => void;
}

const alertTypeIcons: Record<AlertType, typeof Mountain> = {
  erosion: Mountain,
  water_deficit: Droplets,
  crop_incompatibility: Wheat,
};

const alertTypeLabels: Record<AlertType, string> = {
  erosion: 'Risque d\'érosion',
  water_deficit: 'Déficit hydrique',
  crop_incompatibility: 'Incompatibilité culturale',
};

const alertTypeColors: Record<AlertType, string> = {
  erosion: 'text-[#D68910]',
  water_deficit: 'text-[#27AE60]',
  crop_incompatibility: 'text-[#D68910]',
};

function IndicatorBar({ 
  indicator 
}: { 
  indicator: { name: string; value: number; threshold: number; unit: string; exceeded: boolean } 
}) {
  const percentage = Math.min((indicator.value / indicator.threshold) * 100, 150);
  const thresholdPosition = 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{indicator.name}</span>
        <span className={cn(
          'font-medium',
          indicator.exceeded ? 'text-[#D68910]' : 'text-[#212121]'
        )}>
          {indicator.value} {indicator.unit}
          {indicator.exceeded && (
            <TrendingUp size={12} className="inline ml-1 text-[#D68910]" />
          )}
        </span>
      </div>
      <div className="relative h-2 overflow-visible rounded-full bg-[#616161]/20">
        <div 
          className={cn(
            'absolute h-full rounded-full transition-all',
            indicator.exceeded ? 'bg-[#D68910]' : 'bg-[#2ECC71]'
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
        <div 
          className="absolute top-0 h-full w-0.5 bg-[#212121]/50"
          style={{ left: `${thresholdPosition / 1.5}%` }}
        />
        <span 
          className="absolute -top-5 text-[10px] text-muted-foreground transform -translate-x-1/2"
          style={{ left: `${thresholdPosition / 1.5}%` }}
        >
          Seuil: {indicator.threshold}
        </span>
      </div>
    </div>
  );
}

function AlertCard({ 
  alert, 
  onAcknowledge,
  onNavigate,
}: { 
  alert: PredictiveAlert; 
  onAcknowledge: () => void;
  onNavigate?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const Icon = alertTypeIcons[alert.type];
  const severityConfig = SEVERITY_CONFIG[alert.severity];
  const typeColor = alertTypeColors[alert.type];

  return (
    <div 
      className={cn(
        'border rounded-lg overflow-hidden transition-all',
        alert.acknowledged 
          ? 'border-[#2ECC71]/20 bg-[#f8f9fa] opacity-70' 
          : alert.severity === 'critical' 
            ? 'border-[#D68910]/40 bg-[linear-gradient(135deg,#fff7ec_0%,#ffffff_100%)] shadow-md shadow-[#D68910]/10'
            : alert.severity === 'high'
              ? 'border-[#D68910]/30 bg-[linear-gradient(135deg,#fff7ec_0%,#ffffff_100%)]'
              : 'border-[#2ECC71]/20 bg-white'
      )}
    >
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3">
          <div className={cn(
            'p-2 rounded-lg',
            alert.acknowledged ? 'bg-[#616161]/15' : 'bg-[#2ECC71]/10'
          )}>
            <Icon size={20} className={alert.acknowledged ? 'text-[#616161]' : typeColor} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className={cn(
                  'font-medium',
                  alert.acknowledged ? 'text-[#616161]' : 'text-[#212121]'
                )}>
                  {alert.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full', severityConfig.className)}>
                    {severityConfig.label}
                  </span>
                  <span className="text-xs text-[#616161]">
                    {alertTypeLabels[alert.type]}
                  </span>
                </div>
              </div>
              <ChevronRight 
                size={16} 
                className={cn(
                  'text-[#616161] transition-transform',
                  expanded && 'rotate-90'
                )} 
              />
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-[#616161]">
              <MapPin size={12} />
              <span>{alert.parcelName}</span>
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-2 space-y-4 border-t border-[#2ECC71]/15 px-4 pb-4 pt-0">
          {/* Cause Explanation */}
          <div className="rounded-md bg-[#f8f9fa] p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 text-[#D68910]" />
              <div>
                <p className="text-sm font-medium text-[#212121]">Pourquoi cette alerte?</p>
                <p className="mt-1 text-sm text-[#616161]">{alert.cause}</p>
              </div>
            </div>
          </div>

          {/* Indicators */}
          <div>
            <p className="mb-3 text-xs font-medium text-[#212121]">Indicateurs de risque</p>
            <div className="space-y-4">
              {alert.indicators.map((indicator, idx) => (
                <IndicatorBar key={idx} indicator={indicator} />
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className="rounded-md border border-[#2ECC71]/30 bg-[#2ECC71]/10 p-3">
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="mt-0.5 text-[#27AE60]" />
              <div>
                <p className="text-sm font-medium text-[#212121]">Que faire?</p>
                <p className="mt-1 text-sm text-[#616161]">{alert.recommendation}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            {!alert.acknowledged && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onAcknowledge();
                }}
              >
                <CheckCircle size={14} className="mr-1" />
                Prendre en compte
              </Button>
            )}
            {onNavigate && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate();
                }}
              >
                <MapPin size={14} className="mr-1" />
                Voir la parcelle
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function PredictiveAlerts({ 
  alerts, 
  onAcknowledge,
  onNavigateToParcel,
}: PredictiveAlertsProps) {
  const [filter, setFilter] = useState<'all' | AlertType>('all');
  const [showAcknowledged, setShowAcknowledged] = useState(false);

  const filteredAlerts = useMemo(() => {
    return alerts
      .filter(a => filter === 'all' || a.type === filter)
      .filter(a => showAcknowledged || !a.acknowledged)
      .sort((a, b) => {
        const severityOrder: Record<AlertSeverity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      });
  }, [alerts, filter, showAcknowledged]);

  const stats = useMemo(() => ({
    total: alerts.filter(a => !a.acknowledged).length,
    critical: alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length,
    erosion: alerts.filter(a => a.type === 'erosion' && !a.acknowledged).length,
    water: alerts.filter(a => a.type === 'water_deficit' && !a.acknowledged).length,
    crop: alerts.filter(a => a.type === 'crop_incompatibility' && !a.acknowledged).length,
  }), [alerts]);

  return (
    <Card className="w-full max-w-lg border-border">
      <CardHeader className="border-b border-[#2ECC71]/15 bg-white pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle size={20} className="text-[#D68910]" />
          Alertes prédictives
          {stats.total > 0 && (
            <span className="ml-2 rounded-full bg-[#D68910] px-2 py-0.5 text-xs text-white">
              {stats.total}
            </span>
          )}
        </CardTitle>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="rounded-md border border-[#D68910]/20 bg-[#D68910]/10 p-2 text-center">
            <Mountain size={16} className="mx-auto text-[#D68910]" />
            <p className="text-lg font-semibold text-[#212121]">{stats.erosion}</p>
            <p className="text-[10px] text-[#616161]">Érosion</p>
          </div>
          <div className="rounded-md border border-[#2ECC71]/20 bg-[#2ECC71]/10 p-2 text-center">
            <Droplets size={16} className="mx-auto text-[#27AE60]" />
            <p className="text-lg font-semibold text-[#212121]">{stats.water}</p>
            <p className="text-[10px] text-[#616161]">Hydrique</p>
          </div>
          <div className="rounded-md border border-[#D68910]/20 bg-[#D68910]/10 p-2 text-center">
            <Wheat size={16} className="mx-auto text-[#D68910]" />
            <p className="text-lg font-semibold text-[#212121]">{stats.crop}</p>
            <p className="text-[10px] text-[#616161]">Culture</p>
          </div>
        </div>

        {/* Critical Banner */}
        {stats.critical > 0 && (
          <div className="mt-3 flex items-center gap-2 rounded-md bg-[#D68910] p-2 text-white">
            <AlertTriangle size={16} />
            <span className="text-sm font-medium">
              {stats.critical} alerte{stats.critical > 1 ? 's' : ''} critique{stats.critical > 1 ? 's' : ''} nécessite{stats.critical > 1 ? 'nt' : ''} une action immédiate
            </span>
          </div>
        )}

        {/* Filters */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {(['all', 'erosion', 'water_deficit', 'crop_incompatibility'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                filter === type 
                  ? 'bg-[#27AE60] text-white' 
                  : 'bg-[#f8f9fa] text-[#616161] hover:bg-[#2ECC71]/10'
              )}
            >
              {type === 'all' ? 'Toutes' : alertTypeLabels[type]}
            </button>
          ))}
          <label className="ml-0 flex cursor-pointer items-center gap-1.5 text-xs text-[#616161] sm:ml-auto">
            <input
              type="checkbox"
              checked={showAcknowledged}
              onChange={(e) => setShowAcknowledged(e.target.checked)}
              className="rounded border-[#2ECC71]/40"
            />
            Afficher traitées
          </label>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="p-4 space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="py-8 text-center text-[#616161]">
                <CheckCircle size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Aucune alerte active</p>
                <p className="text-xs mt-1">Les parcelles sont conformes aux seuils de risque</p>
              </div>
            ) : (
              filteredAlerts.map(alert => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={() => onAcknowledge(alert.id)}
                  onNavigate={
                    onNavigateToParcel 
                      ? () => onNavigateToParcel(alert.parcelId) 
                      : undefined
                  }
                />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
