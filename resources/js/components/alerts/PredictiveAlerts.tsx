import { useState, useMemo } from 'react';
import { 
  Mountain, 
  Droplets, 
  Wheat, 
  AlertTriangle, 
  ChevronRight, 
  MapPin,
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  PredictiveAlert, 
  AlertType, 
  AlertSeverity,
  SEVERITY_CONFIG 
} from '@/types/alerts';
import { cn } from '@/lib/utils';

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
  erosion: 'text-warning',
  water_deficit: 'text-info',
  crop_incompatibility: 'text-danger',
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
          indicator.exceeded ? 'text-danger' : 'text-foreground'
        )}>
          {indicator.value} {indicator.unit}
          {indicator.exceeded && (
            <TrendingUp size={12} className="inline ml-1 text-danger" />
          )}
        </span>
      </div>
      <div className="relative h-2 bg-muted rounded-full overflow-visible">
        <div 
          className={cn(
            'absolute h-full rounded-full transition-all',
            indicator.exceeded ? 'bg-danger' : 'bg-success'
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
        <div 
          className="absolute top-0 h-full w-0.5 bg-foreground/50"
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
          ? 'bg-muted/30 border-border opacity-70' 
          : alert.severity === 'critical' 
            ? 'border-danger bg-danger/5 shadow-md shadow-danger/10'
            : alert.severity === 'high'
              ? 'border-warning bg-warning/5'
              : 'border-border bg-card'
      )}
    >
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3">
          <div className={cn(
            'p-2 rounded-lg',
            alert.acknowledged ? 'bg-muted' : 'bg-muted/50'
          )}>
            <Icon size={20} className={alert.acknowledged ? 'text-muted-foreground' : typeColor} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className={cn(
                  'font-medium',
                  alert.acknowledged ? 'text-muted-foreground' : 'text-foreground'
                )}>
                  {alert.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full', severityConfig.className)}>
                    {severityConfig.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {alertTypeLabels[alert.type]}
                  </span>
                </div>
              </div>
              <ChevronRight 
                size={16} 
                className={cn(
                  'text-muted-foreground transition-transform',
                  expanded && 'rotate-90'
                )} 
              />
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <MapPin size={12} />
              <span>{alert.parcelName}</span>
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-0 space-y-4 border-t border-border/50 mt-2">
          {/* Cause Explanation */}
          <div className="p-3 bg-muted/50 rounded-md">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-warning mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Pourquoi cette alerte?</p>
                <p className="text-sm text-muted-foreground mt-1">{alert.cause}</p>
              </div>
            </div>
          </div>

          {/* Indicators */}
          <div>
            <p className="text-xs font-medium text-foreground mb-3">Indicateurs de risque</p>
            <div className="space-y-4">
              {alert.indicators.map((indicator, idx) => (
                <IndicatorBar key={idx} indicator={indicator} />
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className="p-3 bg-success/10 border border-success/30 rounded-md">
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="text-success mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Que faire?</p>
                <p className="text-sm text-muted-foreground mt-1">{alert.recommendation}</p>
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
      <CardHeader className="border-b border-border pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle size={20} className="text-warning" />
          Alertes prédictives
          {stats.total > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-warning text-warning-foreground">
              {stats.total}
            </span>
          )}
        </CardTitle>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="p-2 bg-warning/10 rounded-md text-center">
            <Mountain size={16} className="mx-auto text-warning" />
            <p className="text-lg font-semibold text-foreground">{stats.erosion}</p>
            <p className="text-[10px] text-muted-foreground">Érosion</p>
          </div>
          <div className="p-2 bg-info/10 rounded-md text-center">
            <Droplets size={16} className="mx-auto text-info" />
            <p className="text-lg font-semibold text-foreground">{stats.water}</p>
            <p className="text-[10px] text-muted-foreground">Hydrique</p>
          </div>
          <div className="p-2 bg-danger/10 rounded-md text-center">
            <Wheat size={16} className="mx-auto text-danger" />
            <p className="text-lg font-semibold text-foreground">{stats.crop}</p>
            <p className="text-[10px] text-muted-foreground">Culture</p>
          </div>
        </div>

        {/* Critical Banner */}
        {stats.critical > 0 && (
          <div className="mt-3 p-2 bg-danger text-danger-foreground rounded-md flex items-center gap-2">
            <AlertTriangle size={16} />
            <span className="text-sm font-medium">
              {stats.critical} alerte{stats.critical > 1 ? 's' : ''} critique{stats.critical > 1 ? 's' : ''} nécessite{stats.critical > 1 ? 'nt' : ''} une action immédiate
            </span>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {(['all', 'erosion', 'water_deficit', 'crop_incompatibility'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                filter === type 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {type === 'all' ? 'Toutes' : alertTypeLabels[type]}
            </button>
          ))}
          <label className="flex items-center gap-1.5 ml-auto text-xs text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={showAcknowledged}
              onChange={(e) => setShowAcknowledged(e.target.checked)}
              className="rounded border-border"
            />
            Afficher traitées
          </label>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="p-4 space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
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
