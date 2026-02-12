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
      color: activeConflicts > 0 ? 'text-[#D68910]' : 'text-[#27AE60]',
      bgColor: activeConflicts > 0 ? 'bg-[#D68910]/12' : 'bg-[#2ECC71]/12',
      urgent: activeConflicts > 0,
    },
    {
      label: 'Zones sensibles',
      value: sensitiveZones,
      icon: AlertTriangle,
      color: 'text-[#D68910]',
      bgColor: 'bg-[#D68910]/12',
      urgent: false,
    },
    {
      label: 'Décisions en attente',
      value: pendingDecisions,
      icon: FileText,
      color: pendingDecisions > 0 ? 'text-[#D68910]' : 'text-[#616161]',
      bgColor: pendingDecisions > 0 ? 'bg-[#D68910]/12' : 'bg-[#616161]/10',
      urgent: pendingDecisions > 3,
    },
    {
      label: 'Résolus ce mois',
      value: resolvedThisMonth,
      icon: TrendingUp,
      color: 'text-[#27AE60]',
      bgColor: 'bg-[#2ECC71]/12',
      urgent: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => (
        <div 
          key={idx}
          className={cn(
            'rounded-xl border p-4 shadow-sm',
            kpi.urgent
              ? 'border-[#D68910]/35 bg-[linear-gradient(135deg,#fff7ec_0%,#ffffff_100%)]'
              : 'border-[#2ECC71]/20 bg-[linear-gradient(135deg,#f8f9fa_0%,#ffffff_100%)]'
          )}
        >
          <div className="flex items-center justify-between">
            <div className={cn('rounded-lg p-2', kpi.bgColor)}>
              <kpi.icon size={20} className={kpi.color} />
            </div>
            {kpi.urgent && (
              <span className="rounded-full bg-[#D68910] px-2 py-0.5 text-xs font-medium text-white">
                Urgent
              </span>
            )}
          </div>
          <div className="mt-3">
            <p className="text-2xl font-semibold text-[#212121]">
              {kpi.value}
              {kpi.total && (
                <span className="text-sm font-normal text-[#616161]">
                  /{kpi.total}
                </span>
              )}
            </p>
            <p className="text-sm text-[#616161]">{kpi.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
