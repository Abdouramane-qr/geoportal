import { MapPin, Lock, Building2, Home, Map } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type {
  GeographicLevel,
  GeographicContext} from '@/types/geographic';
import {
  geographicData,
  getContextFromLocation,
} from '@/types/geographic';

interface GeographicContextSelectorProps {
  currentContext: GeographicContext;
  onContextChange: (context: GeographicContext) => void;
  allowedLevel?: GeographicLevel; // Niveau maximum autorisé
  canChangeContext?: boolean;
}

const levelLabels: Record<GeographicLevel, string> = {
  region: 'Région',
  commune: 'Commune',
  village: 'Village',
};

const levelIcons: Record<GeographicLevel, typeof Map> = {
  region: Map,
  commune: Building2,
  village: Home,
};

export function GeographicContextSelector({
  currentContext,
  onContextChange,
  allowedLevel = 'region',
  canChangeContext = true,
}: GeographicContextSelectorProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>(
    currentContext.level === 'region' ? currentContext.name : ''
  );
  const [selectedCommune, setSelectedCommune] = useState<string>(
    currentContext.level === 'commune' ? currentContext.name : ''
  );
  const [selectedVillage, setSelectedVillage] = useState<string>(
    currentContext.level === 'village' ? currentContext.name : ''
  );

  const regions = useMemo(() => geographicData.regions.map(r => r.name), []);

  const communes = useMemo(() => {
    const region = geographicData.regions.find(r => r.name === selectedRegion);
    return region?.communes.map(c => c.name) || [];
  }, [selectedRegion]);

  const villages = useMemo(() => {
    const region = geographicData.regions.find(r => r.name === selectedRegion);
    const commune = region?.communes.find(c => c.name === selectedCommune);
    return commune?.villages.map(v => v.name) || [];
  }, [selectedRegion, selectedCommune]);

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    setSelectedCommune('');
    setSelectedVillage('');
    const context = getContextFromLocation(value);
    if (context) onContextChange(context);
  };

  const handleCommuneChange = (value: string) => {
    setSelectedCommune(value);
    setSelectedVillage('');
    const context = getContextFromLocation(selectedRegion, value);
    if (context) onContextChange(context);
  };

  const handleVillageChange = (value: string) => {
    setSelectedVillage(value);
    const context = getContextFromLocation(selectedRegion, selectedCommune, value);
    if (context) onContextChange(context);
  };

  const LevelIcon = levelIcons[currentContext.level];

  const canSelectCommune = allowedLevel !== 'region';
  const canSelectVillage = allowedLevel === 'village';

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-card border border-border rounded-lg">
      {/* Indicateur de contexte actuel */}
      <div className="flex items-center gap-2 pr-4 border-r border-border">
        <div className="p-1.5 bg-primary/10 rounded">
          <MapPin size={14} className="text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            Zone active
          </span>
          <div className="flex items-center gap-1.5">
            <LevelIcon size={12} className="text-foreground/70" />
            <span className="text-sm font-medium text-foreground">
              {currentContext.name}
            </span>
            <Badge 
              variant="outline" 
              className="text-[10px] px-1.5 py-0 h-4 bg-muted/50"
            >
              {levelLabels[currentContext.level]}
            </Badge>
          </div>
        </div>
      </div>

      {/* Sélecteurs */}
      {canChangeContext ? (
        <div className="flex items-center gap-2">
          {/* Région */}
          <Select value={selectedRegion} onValueChange={handleRegionChange}>
            <SelectTrigger className="h-8 w-[140px] text-xs bg-background">
              <SelectValue placeholder="Région" />
            </SelectTrigger>
            <SelectContent>
              {regions.map(region => (
                <SelectItem key={region} value={region} className="text-xs">
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Commune */}
          {canSelectCommune && (
            <Select 
              value={selectedCommune} 
              onValueChange={handleCommuneChange}
              disabled={!selectedRegion}
            >
              <SelectTrigger className={cn(
                "h-8 w-[140px] text-xs bg-background",
                !selectedRegion && "opacity-50"
              )}>
                <SelectValue placeholder="Commune" />
              </SelectTrigger>
              <SelectContent>
                {communes.map(commune => (
                  <SelectItem key={commune} value={commune} className="text-xs">
                    {commune}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Village */}
          {canSelectVillage && (
            <Select 
              value={selectedVillage} 
              onValueChange={handleVillageChange}
              disabled={!selectedCommune}
            >
              <SelectTrigger className={cn(
                "h-8 w-[140px] text-xs bg-background",
                !selectedCommune && "opacity-50"
              )}>
                <SelectValue placeholder="Village" />
              </SelectTrigger>
              <SelectContent>
                {villages.map(village => (
                  <SelectItem key={village} value={village} className="text-xs">
                    {village}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock size={12} />
          <span>Périmètre restreint</span>
        </div>
      )}
    </div>
  );
}
