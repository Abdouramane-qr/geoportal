import { Upload } from 'lucide-react';
import { useCallback, useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { createLayer, normalizeGeoJSON } from '@/features/map/lib/layer-utils';
import type { Layer } from '@/features/map/types/layers';
import { cn } from '@/lib/utils';

interface DataImporterProps {
  onAddLayer: (layer: Layer) => void;
}

export default function DataImporter({ onAddLayer }: DataImporterProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [layerCount, setLayerCount] = useState(0);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        const normalized = normalizeGeoJSON(parsed);
        if (!normalized || !normalized.features.length) {
          setError('Le fichier ne contient aucun GeoJSON valide.');
          return;
        }
        const nextIndex = layerCount + 1;
        const layer: Layer = createLayer(
          normalized,
          file.name.replace(/\.(geojson|json)$/i, ''),
          nextIndex,
        );
        setLayerCount(nextIndex);
        onAddLayer(layer);
      } catch (err) {
        console.error(err);
        setError('Fichier invalide. Utilisez un GeoJSON valide.');
      }
    },
    [layerCount, onAddLayer],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files?.[0];
      if (file) {
        void handleFile(file);
      }
    },
    [handleFile],
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      void handleFile(file);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload size={16} />
          Importer données
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Importer un fichier GeoJSON</DialogTitle>
        </DialogHeader>
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 text-center text-sm',
            isDragging ? 'border-primary bg-primary/5' : 'border-border',
          )}
        >
          <Upload className="text-muted-foreground" />
          <div>
            <p className="font-medium text-foreground">Déposez un GeoJSON ici</p>
            <p className="text-xs text-muted-foreground">Formats acceptés: .geojson, .json</p>
          </div>
          <input
            id={inputId}
            type="file"
            accept=".geojson,.json"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button variant="outline" asChild>
            <label htmlFor={inputId} className="cursor-pointer">
              Choisir un fichier
            </label>
          </Button>
          {error && <p className="text-xs text-danger">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
