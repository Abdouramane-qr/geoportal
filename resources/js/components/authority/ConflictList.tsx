import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  AlertTriangle, 
  Shield, 
  MapPin, 
  Clock, 
  Users,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { LandConflict} from '@/types/authority';
import { CONFLICT_TYPE_LABELS } from '@/types/authority';

interface ConflictListProps {
  conflicts: LandConflict[];
  onSelectConflict?: (conflict: LandConflict) => void;
}

const priorityConfig = {
  haute: { className: 'bg-[#D68910] text-white', label: 'Priorité haute' },
  moyenne: { className: 'bg-[#D68910]/15 text-[#D68910]', label: 'Priorité moyenne' },
  basse: { className: 'bg-[#616161]/15 text-[#616161]', label: 'Priorité basse' },
};

const statusConfig = {
  actif: { className: 'border-[#D68910]/30 bg-[#D68910]/12 text-[#D68910]', label: 'Actif' },
  en_cours: { className: 'border-[#D68910]/25 bg-[#D68910]/10 text-[#D68910]', label: 'En cours' },
  résolu: { className: 'border-[#2ECC71]/30 bg-[#2ECC71]/12 text-[#27AE60]', label: 'Résolu' },
};

function ConflictCard({ 
  conflict, 
  onSelect 
}: { 
  conflict: LandConflict; 
  onSelect?: () => void;
}) {
  const priority = priorityConfig[conflict.priority];
  const status = statusConfig[conflict.status];

  return (
    <div 
      onClick={onSelect}
      className={cn(
        'p-4 border rounded-lg transition-all cursor-pointer hover:shadow-md',
        conflict.priority === 'haute' && conflict.status === 'actif'
          ? 'border-[#D68910]/35 bg-[linear-gradient(135deg,#fff7ec_0%,#ffffff_100%)]'
          : 'border-[#2ECC71]/20 bg-[linear-gradient(135deg,#f8f9fa_0%,#ffffff_100%)]'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={cn(
            'p-2 rounded-lg',
            conflict.priority === 'haute' ? 'bg-[#D68910]/12' : 'bg-[#2ECC71]/12'
          )}>
            <AlertTriangle size={20} className={
              conflict.priority === 'haute' ? 'text-[#D68910]' : 'text-[#27AE60]'
            } />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', priority.className)}>
                {priority.label}
              </span>
              <span className={cn('text-xs px-2 py-0.5 rounded border', status.className)}>
                {status.label}
              </span>
            </div>
            <p className="font-medium text-foreground mt-2">
              {CONFLICT_TYPE_LABELS[conflict.type]}
            </p>
            <p className="text-sm text-[#616161] mt-1 line-clamp-2">
              {conflict.description}
            </p>
          </div>
        </div>
        <ChevronRight size={16} className="text-[#616161] mt-2" />
      </div>

      <div className="mt-4 pt-3 border-t border-[#2ECC71]/15 flex items-center gap-4 text-xs text-[#616161] flex-wrap">
        <div className="flex items-center gap-1">
          <MapPin size={12} />
          <span>{conflict.commune}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={12} />
          <span>{conflict.parties.length} parties</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={12} />
          <span>Mis à jour {formatDistanceToNow(conflict.lastUpdate, { locale: fr, addSuffix: true })}</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {conflict.parcelNames.map((name, idx) => (
          <span key={idx} className="rounded bg-[#2ECC71]/12 px-2 py-0.5 text-xs text-[#27AE60]">
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ConflictList({ conflicts, onSelectConflict }: ConflictListProps) {
  const activeConflicts = conflicts.filter(c => c.status === 'actif');
  const inProgressConflicts = conflicts.filter(c => c.status === 'en_cours');
  const resolvedConflicts = conflicts.filter(c => c.status === 'résolu');

  return (
    <Card className="h-full border-[#2ECC71]/20 bg-white shadow-sm">
      <CardHeader className="border-b border-[#2ECC71]/15 pb-4">
        <CardTitle className="text-lg flex items-center gap-2 text-[#212121]">
          <Shield size={20} className="text-[#D68910]" />
          Conflits fonciers
          {activeConflicts.length > 0 && (
            <span className="ml-2 rounded-full bg-[#D68910] px-2 py-0.5 text-xs text-white">
              {activeConflicts.length} actif{activeConflicts.length > 1 ? 's' : ''}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="p-4 space-y-4">
            {/* Active Conflicts - Priority Display */}
            {activeConflicts.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} className="text-[#D68910]" />
                  <h4 className="text-sm font-medium text-[#D68910]">Conflits actifs</h4>
                </div>
                {activeConflicts.map(conflict => (
                  <ConflictCard 
                    key={conflict.id} 
                    conflict={conflict}
                    onSelect={() => onSelectConflict?.(conflict)}
                  />
                ))}
              </div>
            )}

            {/* In Progress */}
            {inProgressConflicts.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-[#616161]">En cours de traitement</h4>
                {inProgressConflicts.map(conflict => (
                  <ConflictCard 
                    key={conflict.id} 
                    conflict={conflict}
                    onSelect={() => onSelectConflict?.(conflict)}
                  />
                ))}
              </div>
            )}

            {/* Resolved */}
            {resolvedConflicts.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-[#616161]">Résolus récemment</h4>
                {resolvedConflicts.map(conflict => (
                  <ConflictCard 
                    key={conflict.id} 
                    conflict={conflict}
                    onSelect={() => onSelectConflict?.(conflict)}
                  />
                ))}
              </div>
            )}

            {conflicts.length === 0 && (
              <div className="py-8 text-center text-[#616161]">
                <Shield size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Aucun conflit signalé</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
