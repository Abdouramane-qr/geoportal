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
    <div className="rounded-lg border border-[#2ECC71]/20 bg-[linear-gradient(135deg,#f8f9fa_0%,#ffffff_100%)] p-3 shadow-sm">
      <div className="mb-3 flex items-center gap-2 border-b border-[#2ECC71]/15 pb-2">
        <Layers size={16} className="text-[#27AE60]" />
        <span className="text-sm font-medium text-[#212121]">Couches</span>
      </div>
      <div className="flex flex-col gap-2">
        {layerConfig.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onToggle(key)}
            className={`layer-toggle text-sm ${layers[key] ? 'active' : ''} ${layers[key] ? 'ring-1 ring-[#2ECC71]/30' : ''}`}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
