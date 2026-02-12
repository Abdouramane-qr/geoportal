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
    className: 'bg-[#D68910] text-white', 
    label: 'Critique',
    bgClass: 'bg-[linear-gradient(135deg,#fff7ec_0%,#ffffff_100%)] border-[#D68910]/35',
  },
  élevée: { 
    className: 'bg-[#D68910]/15 text-[#D68910]', 
    label: 'Élevée',
    bgClass: 'bg-[linear-gradient(135deg,#fff7ec_0%,#ffffff_100%)] border-[#D68910]/25',
  },
  modérée: { 
    className: 'bg-[#2ECC71]/15 text-[#27AE60]', 
    label: 'Modérée',
    bgClass: 'bg-[linear-gradient(135deg,#f8f9fa_0%,#ffffff_100%)] border-[#2ECC71]/20',
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
          zone.sensitivity === 'critique' ? 'bg-[#D68910]/12' : 
          zone.sensitivity === 'élevée' ? 'bg-[#D68910]/10' : 'bg-[#2ECC71]/12'
        )}>
          <Icon size={20} className={
            zone.sensitivity === 'critique' ? 'text-[#D68910]' : 
            zone.sensitivity === 'élevée' ? 'text-[#D68910]' : 'text-[#27AE60]'
          } />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', sensitivity.className)}>
              {sensitivity.label}
            </span>
            <span className="text-xs text-[#616161]">
              {ZONE_TYPE_LABELS[zone.type]}
            </span>
          </div>
          <p className="font-medium text-foreground mt-2">{zone.name}</p>
          <div className="mt-2 flex items-center gap-3 text-xs text-[#616161]">
            <div className="flex items-center gap-1">
              <MapPin size={12} />
              <span>{zone.commune}</span>
            </div>
            <span>{zone.area} ha</span>
          </div>
        </div>
      </div>

      {/* Restrictions */}
      <div className="mt-4 border-t border-[#2ECC71]/15 pt-3">
        <div className="mb-2 flex items-center gap-1 text-xs font-medium text-[#616161]">
          <Lock size={12} />
          <span>Restrictions</span>
        </div>
        <ul className="space-y-1">
          {zone.restrictions.slice(0, 2).map((restriction, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-[#616161]">
              <span className="mt-0.5 text-[#D68910]">•</span>
              <span>{restriction}</span>
            </li>
          ))}
          {zone.restrictions.length > 2 && (
            <li className="text-xs text-[#616161]">
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
    <Card className="h-full border-[#2ECC71]/20 bg-white shadow-sm">
      <CardHeader className="border-b border-[#2ECC71]/15 pb-4">
        <CardTitle className="text-lg flex items-center gap-2 text-[#212121]">
          <AlertTriangle size={20} className="text-[#D68910]" />
          Zones sensibles
          {criticalZones.length > 0 && (
            <span className="ml-2 rounded-full bg-[#D68910] px-2 py-0.5 text-xs text-white">
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
                <h4 className="text-sm font-medium text-[#D68910] flex items-center gap-2">
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
                <h4 className="text-sm font-medium text-[#D68910]">Sensibilité élevée</h4>
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
                <h4 className="text-sm font-medium text-[#616161]">Sensibilité modérée</h4>
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
              <div className="py-8 text-center text-[#616161]">
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
