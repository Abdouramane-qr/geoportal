import { 
  Shield, 
  AlertTriangle, 
  FileText, 
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthorityKPIProps {
  totalConflicts: number;
  activeConflicts: number;
  sensitiveZones: number;
  pendingDecisions: number;
  resolvedThisMonth: number;
}

export function AuthorityKPIs({
  totalConflicts,
  activeConflicts,
  sensitiveZones,
  pendingDecisions,
  resolvedThisMonth,
}: AuthorityKPIProps) {
  const kpis = [
    {
      label: 'Conflits actifs',
      value: activeConflicts,
      total: totalConflicts,
      icon: Shield,
      color: activeConflicts > 0 ? 'text-danger' : 'text-success',
      bgColor: activeConflicts > 0 ? 'bg-danger/10' : 'bg-success/10',
      urgent: activeConflicts > 0,
    },
    {
      label: 'Zones sensibles',
      value: sensitiveZones,
      icon: AlertTriangle,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      urgent: false,
    },
    {
      label: 'Décisions en attente',
      value: pendingDecisions,
      icon: FileText,
      color: pendingDecisions > 0 ? 'text-warning' : 'text-muted-foreground',
      bgColor: pendingDecisions > 0 ? 'bg-warning/10' : 'bg-muted',
      urgent: pendingDecisions > 3,
    },
    {
      label: 'Résolus ce mois',
      value: resolvedThisMonth,
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
      urgent: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => (
        <div 
          key={idx}
          className={cn(
            'p-4 rounded-lg border',
            kpi.urgent ? 'border-danger bg-danger/5' : 'border-border bg-card'
          )}
        >
          <div className="flex items-center justify-between">
            <div className={cn('p-2 rounded-lg', kpi.bgColor)}>
              <kpi.icon size={20} className={kpi.color} />
            </div>
            {kpi.urgent && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-danger text-danger-foreground font-medium">
                Urgent
              </span>
            )}
          </div>
          <div className="mt-3">
            <p className="text-2xl font-semibold text-foreground">
              {kpi.value}
              {kpi.total && (
                <span className="text-sm text-muted-foreground font-normal">
                  /{kpi.total}
                </span>
              )}
            </p>
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
