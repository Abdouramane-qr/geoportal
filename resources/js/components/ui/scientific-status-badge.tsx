import { FileEdit, CheckCircle2, BadgeCheck } from 'lucide-react';
import { ScientificStatus, getStatusConfig } from '@/types/scientificStatus';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ScientificStatusBadgeProps {
  status: ScientificStatus;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const iconComponents = {
  FileEdit,
  CheckCircle2,
  BadgeCheck,
};

const sizeClasses = {
  sm: 'px-1.5 py-0.5 text-[10px] gap-1',
  md: 'px-2 py-1 text-xs gap-1.5',
  lg: 'px-3 py-1.5 text-sm gap-2',
};

const iconSizes = {
  sm: 10,
  md: 12,
  lg: 14,
};

export function ScientificStatusBadge({ 
  status, 
  showLabel = true,
  size = 'md',
  className,
}: ScientificStatusBadgeProps) {
  const config = getStatusConfig(status);
  const Icon = iconComponents[config.iconName];

  const badge = (
    <span className={cn(
      'inline-flex items-center rounded font-medium border',
      config.badgeClass,
      sizeClasses[size],
      className,
    )}>
      <Icon size={iconSizes[size]} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );

  if (!showLabel) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{badge}</TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-medium">{config.label}</p>
              <p className="text-xs text-muted-foreground">{config.description}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
}

// Compact status indicator for tables
export function StatusDot({ status }: { status: ScientificStatus }) {
  const config = getStatusConfig(status);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn(
            'inline-block w-2.5 h-2.5 rounded-full border',
            config.badgeClass,
          )} />
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-xs">{config.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
