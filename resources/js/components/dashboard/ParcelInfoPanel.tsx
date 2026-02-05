import { X, MapPin, Ruler, Layers, Droplets, Shield } from 'lucide-react';
import { ParcelData } from '@/types/parcel';
import { Button } from '@/components/ui/button';

interface ParcelInfoPanelProps {
  parcel: ParcelData | null;
  onClose: () => void;
}

function QualifierBadge({ level }: { level: 'faible' | 'moyen' | 'élevé' }) {
  const styles = {
    faible: 'qualifier-badge qualifier-low',
    moyen: 'qualifier-badge qualifier-medium',
    élevé: 'qualifier-badge qualifier-high',
  };

  const labels = {
    faible: 'Faible',
    moyen: 'Moyen',
    élevé: 'Élevé',
  };

  return <span className={styles[level]}>{labels[level]}</span>;
}

function InfoRow({ label, value, qualifier }: { 
  label: string; 
  value: string | number; 
  qualifier?: 'faible' | 'moyen' | 'élevé';
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="info-label">{label}</span>
      <div className="flex items-center gap-2">
        <span className="info-value">{value}</span>
        {qualifier && <QualifierBadge level={qualifier} />}
      </div>
    </div>
  );
}

export function ParcelInfoPanel({ parcel, onClose }: ParcelInfoPanelProps) {
  if (!parcel) return null;

  const aptitudeColors = {
    apte: 'text-success',
    marginale: 'text-warning',
    inapte: 'text-danger',
  };

  return (
    <div className="w-80 bg-card border-l border-border h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground">{parcel.name}</h2>
            <p className="text-sm text-muted-foreground">ID: {parcel.id}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
        <div className={`mt-2 text-sm font-medium ${aptitudeColors[parcel.aptitude]}`}>
          Aptitude: {parcel.aptitude.charAt(0).toUpperCase() + parcel.aptitude.slice(1)}
        </div>
      </div>

      <div className="p-4 space-y-0">
        {/* Informations générales */}
        <div className="info-section">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-primary" />
            <h3 className="text-sm font-medium text-foreground">Informations générales</h3>
          </div>
          <InfoRow label="Commune" value={parcel.location.commune} />
          <InfoRow label="Région" value={parcel.location.region} />
          <InfoRow label="Superficie" value={`${parcel.area} ha`} />
          <InfoRow 
            label="Coordonnées" 
            value={`${parcel.location.coordinates[0].toFixed(3)}°, ${parcel.location.coordinates[1].toFixed(3)}°`} 
          />
        </div>

        {/* Pédologie */}
        <div className="info-section">
          <div className="flex items-center gap-2 mb-3">
            <Layers size={16} className="text-secondary" />
            <h3 className="text-sm font-medium text-foreground">Pédologie</h3>
          </div>
          <InfoRow label="Type de sol" value={parcel.pedology.soilType} />
          <InfoRow label="Texture" value={parcel.pedology.texture} />
          <InfoRow 
            label="pH" 
            value={parcel.pedology.pH.toFixed(1)} 
            qualifier={parcel.pedology.phLevel}
          />
          <InfoRow 
            label="Matière organique" 
            value={`${parcel.pedology.organicMatter}%`} 
            qualifier={parcel.pedology.organicMatterLevel}
          />
        </div>

        {/* Hydrologie */}
        <div className="info-section">
          <div className="flex items-center gap-2 mb-3">
            <Droplets size={16} className="text-blue-500" />
            <h3 className="text-sm font-medium text-foreground">Hydrologie</h3>
          </div>
          <InfoRow 
            label="Profondeur nappe" 
            value={`${parcel.hydrology.waterTableDepth} m`} 
            qualifier={parcel.hydrology.waterTableLevel}
          />
          <InfoRow 
            label="Débit annuel" 
            value={`${parcel.hydrology.annualFlow} mm/an`} 
            qualifier={parcel.hydrology.flowLevel}
          />
          <InfoRow label="Classe drainage" value={parcel.hydrology.drainageClass} />
        </div>

        {/* Conservation */}
        <div className="info-section">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} className="text-danger" />
            <h3 className="text-sm font-medium text-foreground">Conservation</h3>
          </div>
          <InfoRow 
            label="Facteur K" 
            value={parcel.conservation.kFactor.toFixed(2)} 
            qualifier={parcel.conservation.kLevel}
          />
          <InfoRow 
            label="Risque érosion" 
            value={parcel.conservation.erosionRisk.charAt(0).toUpperCase() + parcel.conservation.erosionRisk.slice(1)} 
            qualifier={parcel.conservation.erosionRisk}
          />
          <InfoRow label="Pente" value={`${parcel.conservation.slopePercent}%`} />
          <InfoRow label="Couverture végétale" value={`${parcel.conservation.vegetationCover}%`} />
        </div>
      </div>
    </div>
  );
}
