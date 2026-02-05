import { 
  MapPin, 
  AlertTriangle, 
  Lock,
  TreePine,
  Waves,
  Landmark,
  Building2,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { SensitiveZone} from '@/types/authority';
import { ZONE_TYPE_LABELS } from '@/types/authority';

interface SensitiveZonesProps {
  zones: SensitiveZone[];
  onSelectZone?: (zone: SensitiveZone) => void;
}

const sensitivityConfig = {
  critique: { 
    className: 'bg-danger text-danger-foreground', 
    label: 'Critique',
    bgClass: 'bg-danger/5 border-danger',
  },
  élevée: { 
    className: 'bg-warning text-warning-foreground', 
    label: 'Élevée',
    bgClass: 'bg-warning/5 border-warning',
  },
  modérée: { 
    className: 'bg-info/15 text-info', 
    label: 'Modérée',
    bgClass: 'bg-card border-border',
  },
};

const zoneTypeIcons = {
  zone_protégée: TreePine,
  zone_inondable: Waves,
  patrimoine: Landmark,
  réserve_foncière: Building2,
};

function ZoneCard({ 
  zone, 
  onSelect 
}: { 
  zone: SensitiveZone; 
  onSelect?: () => void;
}) {
  const sensitivity = sensitivityConfig[zone.sensitivity];
  const Icon = zoneTypeIcons[zone.type];

  return (
    <div 
      onClick={onSelect}
      className={cn(
        'p-4 border rounded-lg transition-all cursor-pointer hover:shadow-md',
        sensitivity.bgClass
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'p-2 rounded-lg',
          zone.sensitivity === 'critique' ? 'bg-danger/15' : 
          zone.sensitivity === 'élevée' ? 'bg-warning/15' : 'bg-muted'
        )}>
          <Icon size={20} className={
            zone.sensitivity === 'critique' ? 'text-danger' : 
            zone.sensitivity === 'élevée' ? 'text-warning' : 'text-muted-foreground'
          } />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', sensitivity.className)}>
              {sensitivity.label}
            </span>
            <span className="text-xs text-muted-foreground">
              {ZONE_TYPE_LABELS[zone.type]}
            </span>
          </div>
          <p className="font-medium text-foreground mt-2">{zone.name}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin size={12} />
              <span>{zone.commune}</span>
            </div>
            <span>{zone.area} ha</span>
          </div>
        </div>
      </div>

      {/* Restrictions */}
      <div className="mt-4 pt-3 border-t border-border/50">
        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground mb-2">
          <Lock size={12} />
          <span>Restrictions</span>
        </div>
        <ul className="space-y-1">
          {zone.restrictions.slice(0, 2).map((restriction, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="text-danger mt-0.5">•</span>
              <span>{restriction}</span>
            </li>
          ))}
          {zone.restrictions.length > 2 && (
            <li className="text-xs text-muted-foreground">
              +{zone.restrictions.length - 2} autre{zone.restrictions.length > 3 ? 's' : ''}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export function SensitiveZones({ zones, onSelectZone }: SensitiveZonesProps) {
  const criticalZones = zones.filter(z => z.sensitivity === 'critique');
  const highZones = zones.filter(z => z.sensitivity === 'élevée');
  const moderateZones = zones.filter(z => z.sensitivity === 'modérée');

  return (
    <Card className="border-border h-full">
      <CardHeader className="border-b border-border pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle size={20} className="text-warning" />
          Zones sensibles
          {criticalZones.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-danger text-danger-foreground">
              {criticalZones.length} critique{criticalZones.length > 1 ? 's' : ''}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="p-4 space-y-4">
            {/* Critical Zones */}
            {criticalZones.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-danger flex items-center gap-2">
                  <AlertTriangle size={14} />
                  Zones critiques
                </h4>
                {criticalZones.map(zone => (
                  <ZoneCard 
                    key={zone.id} 
                    zone={zone}
                    onSelect={() => onSelectZone?.(zone)}
                  />
                ))}
              </div>
            )}

            {/* High Sensitivity */}
            {highZones.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-warning">Sensibilité élevée</h4>
                {highZones.map(zone => (
                  <ZoneCard 
                    key={zone.id} 
                    zone={zone}
                    onSelect={() => onSelectZone?.(zone)}
                  />
                ))}
              </div>
            )}

            {/* Moderate */}
            {moderateZones.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Sensibilité modérée</h4>
                {moderateZones.map(zone => (
                  <ZoneCard 
                    key={zone.id} 
                    zone={zone}
                    onSelect={() => onSelectZone?.(zone)}
                  />
                ))}
              </div>
            )}

            {zones.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Info size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Aucune zone sensible identifiée</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
