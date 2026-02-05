import { LocateFixed, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Layer } from '@/features/map/types/layers';

interface LayerManagerProps {
  layers: Layer[];
  onToggle: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
  onRemove: (id: string) => void;
  className?: string;
}

export default function LayerManager({
  layers,
  onToggle,
  onOpacityChange,
  onRemove,
  className,
}: LayerManagerProps) {
  return (
    <div className={cn('rounded-lg border border-border bg-card/95 shadow-sm p-3 w-80', className)}>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
        Gestion des couches
      </p>
      {layers.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune couche importée.</p>
      ) : (
        <div className="space-y-3">
          {layers.map((layer) => (
            <div key={layer.id} className="rounded-md border border-border p-2">
              <div className="flex items-center gap-2">
                <Checkbox checked={layer.visible} onCheckedChange={() => onToggle(layer.id)} />
                <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: layer.color }} />
                <span className="text-sm font-medium text-foreground truncate flex-1">{layer.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Zoom sur la couche"
                  onClick={() => window.dispatchEvent(new CustomEvent('geoportal:layer-focus', { detail: layer.id }))}
                >
                  <LocateFixed size={14} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onRemove(layer.id)}>
                  <X size={14} />
                </Button>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-10">Opacité</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={layer.opacity}
                  onChange={(event) => onOpacityChange(layer.id, Number(event.target.value))}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-10 text-right">
                  {Math.round(layer.opacity * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
