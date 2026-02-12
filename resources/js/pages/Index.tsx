import { Map, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { DynamicMapLegend } from '@/components/dashboard/DynamicMapLegend';
import { GeographicContextSelector } from '@/components/dashboard/GeographicContextSelector';
import { KPICard } from '@/components/dashboard/KPICard';
import { LandUnitSummary } from '@/components/dashboard/LandUnitSummary';
import { LayerControls } from '@/components/dashboard/LayerControls';
import { MapContainer } from '@/components/dashboard/MapContainer';
import { ParcelDetailsSidebar } from '@/components/dashboard/ParcelDetailsSidebar';
import { MainNav } from '@/components/layout/MainNav';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import DataImporter from '@/features/map/components/DataImporter';
import LayerManager from '@/features/map/components/LayerManager';
import {
  type StorageMode,
  getLayerStorageStatus,
  loadLayers,
  saveLayers,
} from '@/features/map/lib/layer-store';
import type { Layer } from '@/features/map/types/layers';
import { useIsMobile } from '@/hooks/use-mobile';
import { getContextFromLocation } from '@/types/geographic';
import type { GeographicContext} from '@/types/geographic';
import {
  convertToFAOClass,
  determineMainRisk,
  generateRecommendation,
} from '@/types/landUnit';
import type { ParcelData, LayerState } from '@/types/parcel';
import type { ParcelApi } from '@/types/parcel-api';
import type { ScientificStatus } from '@/types/scientificStatus';

const isLngLatPosition = (value: GeoJSON.Position): value is [number, number] =>
  Array.isArray(value)
  && value.length >= 2
  && typeof value[0] === 'number'
  && typeof value[1] === 'number';

const Index = () => {
  const [parcels, setParcels] = useState<ParcelData[]>([]);
  const [selectedParcel, setSelectedParcel] = useState<ParcelData | null>(null);
  const [activeLayers, setActiveLayers] = useState<LayerState>({
    fertility: false,
    hydrology: false,
    erosion: false,
  });

  // Contexte géographique autorisé (par défaut: région Thiès)
  const [geoContext, setGeoContext] = useState<GeographicContext>(
    getContextFromLocation('Burkina Faso') || {
      level: 'region',
      name: 'Burkina Faso',
      bounds: [[9.3, -5.6], [15.1, 2.5]],
      center: [12.238, -1.561],
      zoom: 7.3,
    }
  );

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [layers, setLayers] = useState<Layer[]>(() => loadLayers());
  const [layerManagerOpen, setLayerManagerOpen] = useState(false);
  const [layerStorageStatus, setLayerStorageStatus] = useState(() => getLayerStorageStatus());
  const didInitLayersRef = useRef(false);
  const isMobile = useIsMobile();
  const [mapPane, setMapPane] = useState<'map' | 'controls'>('map');

  useEffect(() => {
                    const fetchParcels = async () => {
                        try {
                            const [minLat, minLng] = geoContext.bounds[0];
                            const [maxLat, maxLng] = geoContext.bounds[1];
                            const queryParams = new URLSearchParams({
                                minLat: minLat.toString(),
                                minLng: minLng.toString(),
                                maxLat: maxLat.toString(),
                                maxLng: maxLng.toString(),
                            }).toString();
            
                            console.log('Fetching parcels with bounds:', geoContext.bounds);
                            console.log('Query params:', queryParams);
            
                            const response = await fetch(`/api/parcels/geojson?${queryParams}`);        if (!response.ok) return;
        const data = await response.json();
        if (!data || !Array.isArray(data.features)) return;

        const mapped: ParcelData[] = data.features.map((feature: GeoJSON.Feature, index: number) => {
          const item = feature.properties as ParcelApi;
          const geometry = feature.geometry;

          // Default to a placeholder if geometry is missing, but log a warning.
          let polygon: [number, number][] = [];
          if (geometry && geometry.type === 'Polygon' && Array.isArray(geometry.coordinates[0])) {
            polygon = geometry.coordinates[0]
              .filter(isLngLatPosition)
              .map(([lng, lat]) => [lat, lng]); // Reverse coords for Leaflet
          } else if (geometry && geometry.type === 'MultiPolygon' && Array.isArray(geometry.coordinates[0][0])) {
            polygon = geometry.coordinates[0][0]
              .filter(isLngLatPosition)
              .map(([lng, lat]) => [lat, lng]); // Use the first polygon of a MultiPolygon
          } else {
            console.warn(`Parcel ${item.id} has missing or invalid geometry.`);
            // Fallback to a small placeholder polygon around the context center
            const baseLat = geoContext.center[0] + (index * 0.002);
            const baseLng = geoContext.center[1] + (index * 0.002);
            polygon = [
              [baseLat, baseLng],
              [baseLat + 0.001, baseLng],
              [baseLat + 0.001, baseLng + 0.001],
              [baseLat, baseLng + 0.001],
              [baseLat, baseLng],
            ];
          }

          const centerOfPolygon: [number, number] = polygon.length > 0
            ? polygon.reduce((acc, curr) => [acc[0] + curr[0], acc[1] + curr[1]], [0, 0]).map(val => val / polygon.length) as [number, number]
            : [geoContext.center[0], geoContext.center[1]];

          return {
            id: item.id,
            name: item.owner_name ?? `Parcelle ${index + 1}`,
            location: {
              commune: geoContext.name,
              region: geoContext.level === 'region' ? geoContext.name : 'Région',
              coordinates: centerOfPolygon,
            },
            area: item.soil_data?.area ?? 1,
            pedology: {
              soilType: item.soil_data?.soilType ?? 'Inconnu',
              pH: item.soil_data?.pH ?? 6.5,
              phLevel: 'moyen',
              organicMatter: item.soil_data?.organicMatter ?? 2,
              organicMatterLevel: 'moyen',
              texture: item.soil_data?.texture ?? 'Inconnue',
            },
            hydrology: {
              waterTableDepth: item.soil_data?.waterTableDepth ?? 5,
              waterTableLevel: 'moyen',
              annualFlow: item.soil_data?.annualFlow ?? 500,
              flowLevel: 'moyen',
              drainageClass: item.soil_data?.drainageClass ?? 'Moyen',
            },
            conservation: {
              kFactor: item.computed_k ?? 0.2,
              kLevel: 'moyen',
              erosionRisk: item.erosion_risk_level === 'critical' || item.erosion_risk_level === 'high'
                ? 'élevé'
                : item.erosion_risk_level === 'moderate'
                  ? 'moyen'
                  : 'faible',
              slopePercent: item.soil_data?.slope ?? 3,
              vegetationCover: item.soil_data?.vegetationCover ?? 60,
            },
            fertility: 'moyenne',
            aptitude: 'apte',
            polygon,
            scientificStatus: item.status === 'official' ? 'officiel' : item.status === 'validated' ? 'valide' : 'brouillon',
          };
        });

        setParcels(mapped);
      } catch (error) {
        console.error('Failed to load parcels', error);
      }
    };

    void fetchParcels();
  }, [geoContext.center, geoContext.level, geoContext.name, geoContext.bounds]);

  useEffect(() => {
    if (!didInitLayersRef.current) {
      didInitLayersRef.current = true;
      return;
    }
    saveLayers(layers);
  }, [layers]);

  useEffect(() => {
    const handleUpdate = (event: Event) => {
      const detail = (event as CustomEvent<Layer[]>).detail;
      if (Array.isArray(detail)) {
        setLayers(detail);
      }
    };
    window.addEventListener('geoportal:layers-updated', handleUpdate);
    return () => {
      window.removeEventListener('geoportal:layers-updated', handleUpdate);
    };
  }, []);

  useEffect(() => {
    const handleStorage = (event: Event) => {
      const detail = (event as CustomEvent<StorageMode>).detail;
      if (detail) {
        setLayerStorageStatus(detail);
      }
    };
    window.addEventListener('geoportal:layers-storage', handleStorage);
    return () => {
      window.removeEventListener('geoportal:layers-storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    if (!isMobile) {
      if (mapPane !== 'map') { // Only update if it's different
        setTimeout(() => {
          setMapPane('map');
        }, 0);
      }
    }
  }, [isMobile, mapPane]); // Added mapPane to dependencies to satisfy the linter for the conditional update

  // Calculate KPIs from parcels data dynamically
  const kpiData = useMemo(() => {
    const totalParcels = parcels.length;
    
    // High erosion risk: erosionRisk === 'élevé' OR kFactor > 0.35
    const erosionRiskCount = parcels.filter(p => 
      p.conservation.erosionRisk === 'élevé' || p.conservation.kFactor > 0.35
    ).length;
    
    // Apt zones
    const aptZones = parcels.filter(p => p.aptitude === 'apte').length;
    
    // Average fertility based on organic matter (MO)
    const avgOrganicMatter = parcels.reduce((sum, p) => 
      sum + p.pedology.organicMatter, 0
    ) / (totalParcels || 1);
    // Convert to percentage (assuming max 5% as 100%)
    const avgFertility = Math.round((avgOrganicMatter / 5) * 100);

    return {
      totalParcels,
      erosionRisk: erosionRiskCount,
      aptZones,
      avgFertility,
    };
  }, [parcels]); // Added parcels to dependency array

  // Calculate visible statuses for dynamic legend
  const visibleStatuses = useMemo(() => {
    const statuses = new Set<ScientificStatus>();
    parcels.forEach(p => statuses.add(p.scientificStatus));
    return Array.from(statuses);
  }, [parcels]);

  // Calcul du résumé de l'unité de terre sélectionnée
  const landUnitSummary = useMemo(() => {
    if (!selectedParcel) return null;

    const aptitude = convertToFAOClass(
      selectedParcel.aptitude,
      selectedParcel.fertility,
      selectedParcel.conservation.erosionRisk
    );
    const mainRisk = determineMainRisk(selectedParcel);
    const recommendation = generateRecommendation(aptitude, mainRisk);

    return {
      aptitude,
      mainRisk,
      recommendation,
    };
  }, [selectedParcel]);

  const handleLayerToggle = (layer: keyof LayerState) => {
    setActiveLayers(prev => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  const handleSelectParcel = useCallback((parcel: ParcelData) => {
    setSelectedParcel(parcel);
    setIsSidebarOpen(true);
  }, []);

  const mapPanel = (
    <div className="h-[480px] min-h-[360px] relative rounded-[28px] border border-border bg-card shadow-[0_20px_40px_rgba(0,0,0,0.08)] overflow-hidden">
      <MapContainer
        parcels={parcels}
        selectedParcel={selectedParcel}
        onSelectParcel={handleSelectParcel}
        activeLayers={activeLayers}
        authorizedContext={geoContext}
        layers={layers}
      />

      <div className="absolute top-5 left-5 z-[1100] hidden md:flex flex-col gap-3">
        <LayerControls layers={activeLayers} onToggle={handleLayerToggle} />
        <DynamicMapLegend activeLayers={activeLayers} visibleStatuses={visibleStatuses} />
      </div>
      <div className="absolute top-5 right-5 z-[1100] hidden md:flex flex-col gap-2">
        <DataImporter onAddLayer={(layer) => setLayers((prev) => [...prev, layer])} />
        <Button variant="outline" onClick={() => setLayerManagerOpen(true)} className="w-full">
          Gestion des couches
        </Button>
        {layerStorageStatus !== 'inline' && layerStorageStatus !== 'none' && (
          <div className="rounded-md border border-border bg-warning/10 px-3 py-2 text-xs text-warning-foreground">
            {layerStorageStatus === 'idb'
              ? 'Couches lourdes stockées dans le navigateur (IndexedDB).'
              : 'Stockage plein: couches conservées pour la session.'}
          </div>
        )}
      </div>
    </div>
  );

  const controlsPanel = (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Couche & statuts
          </p>
        </div>
        <LayerControls layers={activeLayers} onToggle={handleLayerToggle} />
        <DynamicMapLegend activeLayers={activeLayers} visibleStatuses={visibleStatuses} />
      </div>
      <div className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Import & couches
          </p>
        </div>
        <DataImporter onAddLayer={(layer) => setLayers((prev) => [...prev, layer])} />
        <Button variant="outline" onClick={() => setLayerManagerOpen(true)} className="w-full">
          Gestion des couches
        </Button>
        {layerStorageStatus !== 'inline' && layerStorageStatus !== 'none' && (
          <div className="rounded-md border border-border bg-warning/10 px-3 py-2 text-xs text-warning-foreground">
            {layerStorageStatus === 'idb'
              ? 'Couches lourdes stockées dans le navigateur (IndexedDB).'
              : 'Stockage plein: couches conservées pour la session.'}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background app-shell">
      <MainNav />
      <div className="flex flex-1 min-h-0 flex-col">
        {/* Geographic Context Selector */}
        <div className="px-6 py-3 border-b border-border bg-muted/20">
        <GeographicContextSelector
          currentContext={geoContext}
          onContextChange={setGeoContext}
          allowedLevel="commune"
          canChangeContext={true}
        />
        </div>
      
      {/* KPI Row */}
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Parcelles totales"
            value={kpiData.totalParcels}
            unit="unités"
            icon={Map}
            variant="default"
          />
          <KPICard
            title="Risque érosion élevé"
            value={kpiData.erosionRisk}
            unit="parcelles"
            icon={AlertTriangle}
            variant="danger"
          />
          <KPICard
            title="Zones aptes"
            value={kpiData.aptZones}
            unit="parcelles"
            icon={CheckCircle}
            variant="success"
          />
          <KPICard
            title="Fertilité moyenne"
            value={kpiData.avgFertility}
            unit="%"
            icon={TrendingUp}
            variant="warning"
          />
          </div>
        </div>

      {/* Land Unit Summary (visible when parcel selected) */}
      {selectedParcel && landUnitSummary && (
        <div className="px-6 py-4 border-b border-border">
          <LandUnitSummary
              unitId={selectedParcel.id}
              unitName={selectedParcel.name}
              aptitude={landUnitSummary.aptitude}
              mainRisk={landUnitSummary.mainRisk}
              recommendation={landUnitSummary.recommendation}
            />
          </div>
        )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          {isMobile && (
            <div className="px-6 pb-4 border-b border-border bg-muted/20 flex gap-2">
              <Button
                variant={mapPane === 'map' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setMapPane('map')}
              >
                Carte
              </Button>
              <Button
                variant={mapPane === 'controls' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setMapPane('controls')}
              >
                Contrôles
              </Button>
            </div>
          )}
          <div className="flex-1 overflow-auto p-4 md:p-4">
            {(!isMobile || mapPane === 'map') && (
              <div className="mb-4">{mapPanel}</div>
            )}
            {isMobile && mapPane === 'controls' && controlsPanel}
          </div>
        </div>

        {/* Parcel Details Sidebar (Sheet) */}
        <ParcelDetailsSidebar
          parcel={selectedParcel}
          isOpen={isSidebarOpen}
          onClose={() => {
            setIsSidebarOpen(false);
            setSelectedParcel(null);
          }}
          onValidate={(parcelId) => {
            console.log('Validating parcel:', parcelId);
            // TODO: Update parcel status in database
          }}
        />

        <Sheet open={layerManagerOpen} onOpenChange={setLayerManagerOpen}>
          <SheetContent side="right" className="w-[360px] sm:max-w-[360px] p-4">
            <SheetHeader>
              <SheetTitle>Gestion des couches</SheetTitle>
            </SheetHeader>
            <LayerManager
              layers={layers}
              onToggle={(id) =>
                setLayers((prev) =>
                  prev.map((layer) =>
                    layer.id === id ? { ...layer, visible: !layer.visible } : layer,
                  ),
                )
              }
              onOpacityChange={(id, opacity) =>
                setLayers((prev) =>
                  prev.map((layer) =>
                    layer.id === id ? { ...layer, opacity } : layer,
                  ),
                )
              }
              onRemove={(id) => setLayers((prev) => prev.filter((layer) => layer.id !== id))}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </div>
  );
};

export default Index;
