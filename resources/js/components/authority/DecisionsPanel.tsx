import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  MapPin,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { DecisionSummary} from '@/types/authority';
import { DECISION_TYPE_LABELS } from '@/types/authority';

interface DecisionsPanelProps {
  decisions: DecisionSummary[];
  onSelectDecision?: (decision: DecisionSummary) => void;
}

const statusConfig = {
  en_attente: { 
    icon: Clock, 
    className: 'bg-warning/15 text-warning border-warning/30',
    label: 'En attente',
  },
  approuvée: { 
    icon: CheckCircle, 
    className: 'bg-success/15 text-success border-success/30',
    label: 'Approuvée',
  },
  refusée: { 
    icon: XCircle, 
    className: 'bg-danger/15 text-danger border-danger/30',
    label: 'Refusée',
  },
};

const decisionTypeColors = {
  attribution: 'bg-primary/15 text-primary',
  régularisation: 'bg-success/15 text-success',
  interdiction: 'bg-danger/15 text-danger',
  délimitation: 'bg-warning/15 text-warning',
};

function DecisionCard({ 
  decision, 
  onSelect 
}: { 
  decision: DecisionSummary; 
  onSelect?: () => void;
}) {
  const status = statusConfig[decision.status];
  const StatusIcon = status.icon;

  return (
    <div 
      onClick={onSelect}
      className="p-4 border border-border rounded-lg bg-card transition-all cursor-pointer hover:shadow-md hover:border-primary/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-full font-medium',
              decisionTypeColors[decision.type]
            )}>
              {DECISION_TYPE_LABELS[decision.type]}
            </span>
            <span className={cn(
              'text-xs px-2 py-0.5 rounded border flex items-center gap-1',
              status.className
            )}>
              <StatusIcon size={12} />
              {status.label}
            </span>
          </div>
          <p className="font-medium text-foreground mt-2">{decision.title}</p>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {decision.summary}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin size={12} />
          <span>{decision.commune}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>{format(decision.date, 'dd MMM yyyy', { locale: fr })}</span>
        </div>
        {decision.parcelName && (
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">→</span>
            <span>{decision.parcelName}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function DecisionsPanel({ decisions, onSelectDecision }: DecisionsPanelProps) {
  const pending = decisions.filter(d => d.status === 'en_attente');
  const approved = decisions.filter(d => d.status === 'approuvée');
  const rejected = decisions.filter(d => d.status === 'refusée');

  return (
    <Card className="border-border">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText size={20} className="text-primary" />
            Décisions foncières
            {pending.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-warning text-warning-foreground">
                {pending.length} en attente
              </span>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="p-4 space-y-4">
            {/* Pending - Priority */}
            {pending.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-warning flex items-center gap-2">
                  <Clock size={14} />
                  En attente de décision
                </h4>
                {pending.map(decision => (
                  <DecisionCard 
                    key={decision.id} 
                    decision={decision}
                    onSelect={() => onSelectDecision?.(decision)}
                  />
                ))}
              </div>
            )}

            {/* Recent Decisions */}
            {(approved.length > 0 || rejected.length > 0) && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Décisions récentes</h4>
                {[...approved, ...rejected]
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .slice(0, 4)
                  .map(decision => (
                    <DecisionCard 
                      key={decision.id} 
                      decision={decision}
                      onSelect={() => onSelectDecision?.(decision)}
                    />
                  ))
                }
              </div>
            )}

            {decisions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Aucune décision récente</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
