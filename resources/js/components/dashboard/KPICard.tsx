import type { LucideIcon } from 'lucide-react';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  animate?: boolean;
}

export function KPICard({ 
  title, 
  value, 
  unit, 
  icon: Icon,
  variant = 'default',
  animate = true,
}: KPICardProps) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  const animatedValue = useAnimatedCounter(numericValue, { 
    duration: 1200,
    decimals: Number.isInteger(numericValue) ? 0 : 1,
  });

  const variantStyles = {
    default: 'border-l-primary',
    success: 'border-l-success',
    warning: 'border-l-warning',
    danger: 'border-l-danger',
  };

  const iconStyles = {
    default: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
  };

  return (
    <div className={`kpi-card border-l-4 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="kpi-label">{title}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="kpi-value tabular-nums">
              {animate ? animatedValue : value}
            </span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
        </div>
        <div className={`p-2 rounded-md bg-muted ${iconStyles[variant]}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
