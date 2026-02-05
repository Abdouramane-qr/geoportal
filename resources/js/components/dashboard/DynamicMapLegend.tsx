import type { LayerState } from '@/types/parcel';
import type { ScientificStatus } from '@/types/scientificStatus';
import { scientificStatusConfig } from '@/types/scientificStatus';

interface DynamicMapLegendProps {
  activeLayers: LayerState;
  visibleStatuses?: ScientificStatus[];
}

export function DynamicMapLegend({ activeLayers, visibleStatuses }: DynamicMapLegendProps) {
  const legendItems = {
    fertility: [
      { color: '#22c55e', label: 'Haute fertilité' },
      { color: '#f59e0b', label: 'Fertilité moyenne' },
      { color: '#ef4444', label: 'Basse fertilité' },
    ],
    hydrology: [
      { color: '#0ea5e9', label: 'Ressource élevée' },
      { color: '#06b6d4', label: 'Ressource moyenne' },
      { color: '#64748b', label: 'Ressource faible' },
    ],
    erosion: [
      { color: '#22c55e', label: 'Risque faible' },
      { color: '#f59e0b', label: 'Risque moyen' },
      { color: '#ef4444', label: 'Risque élevé' },
    ],
  };

  // Dynamic status items based on visible statuses
  const allStatuses: ScientificStatus[] = ['brouillon', 'valide', 'officiel'];
  const statusesToShow = visibleStatuses || allStatuses;

  const statusItems = statusesToShow.map(status => {
    const config = scientificStatusConfig[status];
    return {
      status,
      label: config.label,
      color: config.mapStyle.color,
      dashArray: config.mapStyle.dashArray,
      weight: config.mapStyle.weight,
    };
  });

  const activeLayerKeys = Object.entries(activeLayers)
    .filter(([, active]) => active)
    .map(([key]) => key as keyof LayerState);

  return (
    <div className="bg-card border border-border rounded-md p-3 shadow-sm min-w-[180px]">
      <p className="text-sm font-medium text-foreground mb-3">Légende</p>
      <div className="space-y-4">
        {/* Dynamic Scientific Status Legend */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            Statut des données
          </p>
          <div className="space-y-1.5">
            {statusItems.map((item) => (
              <div key={item.status} className="flex items-center gap-2">
                <div 
                  className="w-5 h-3 rounded-sm"
                  style={{ 
                    backgroundColor: item.color,
                    opacity: 0.7,
                    border: `${item.weight}px ${item.dashArray ? 'dashed' : 'solid'} ${item.color}`,
                  }}
                />
                <span className="text-muted-foreground text-xs">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Layer-specific legends */}
        {activeLayerKeys.length > 0 ? (
          activeLayerKeys.map((layerKey) => (
            <div key={layerKey}>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                {layerKey === 'fertility' && 'Fertilité'}
                {layerKey === 'hydrology' && 'Hydrologie'}
                {layerKey === 'erosion' && 'Érosion'}
              </p>
              <div className="space-y-1.5">
                {legendItems[layerKey].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-3 rounded-sm" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground text-xs">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              Parcelles
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 rounded-sm bg-primary/60" />
                <span className="text-muted-foreground text-xs">Zone agricole</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 rounded-sm border-2 border-primary bg-primary/30" />
                <span className="text-muted-foreground text-xs">Sélectionnée</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
