import type { ErosionRiskLevel } from '@/types/parcel-api';
import { getRiskColor, getRiskLabel } from '@/lib/soil-utils';
import { cn } from '@/lib/utils';

const DEFAULT_LEVELS: ErosionRiskLevel[] = ['low', 'moderate', 'high', 'critical', 'unknown'];

interface RiskLegendProps {
  levels?: ErosionRiskLevel[];
  className?: string;
}

export default function RiskLegend({ levels = DEFAULT_LEVELS, className }: RiskLegendProps) {
  return (
    <div className={cn('rounded-lg border border-border bg-card/90 p-3 shadow-sm', className)}>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
        Niveau de risque d&apos;érosion
      </p>
      <div className="space-y-2 text-sm">
        {levels.map((level) => (
          <div key={level} className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 12 12" className={getRiskColor(level)}>
              <circle cx="6" cy="6" r="4.5" strokeWidth="1.5" />
            </svg>
            <span className="text-foreground">{getRiskLabel(level)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
