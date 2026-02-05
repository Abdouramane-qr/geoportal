import { Layers, Droplets, Leaf, Mountain } from 'lucide-react';
import type { LayerState } from '@/types/parcel';

interface LayerControlsProps {
  layers: LayerState;
  onToggle: (layer: keyof LayerState) => void;
}

export function LayerControls({ layers, onToggle }: LayerControlsProps) {
  const layerConfig = [
    { key: 'fertility' as const, label: 'Fertilité', icon: Leaf },
    { key: 'hydrology' as const, label: 'Hydrologie', icon: Droplets },
    { key: 'erosion' as const, label: 'Érosion', icon: Mountain },
  ];

  return (
    <div className="bg-card border border-border rounded-md p-3 shadow-sm">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
        <Layers size={16} className="text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Couches</span>
      </div>
      <div className="flex flex-col gap-2">
        {layerConfig.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onToggle(key)}
            className={`layer-toggle text-sm ${layers[key] ? 'active' : ''}`}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
