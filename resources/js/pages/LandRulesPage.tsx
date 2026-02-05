import L from 'leaflet';
import { 
  Plus, 
  Save, 
  Trash2, 
  FileText, 
  Upload as UploadIcon, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Pencil
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { MainNav } from '@/components/layout/MainNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { LandRule, RuleStatus} from '@/types/landRules';



function StatusBadge({ status }: { status: RuleStatus }) {
  const config = {
    valide: { label: 'Valide', icon: CheckCircle, className: 'bg-success/15 text-success' },
    conflit: { label: 'Conflit', icon: AlertTriangle, className: 'bg-danger/15 text-danger' },
    révision: { label: 'En révision', icon: Clock, className: 'bg-warning/15 text-warning' },
  };

  const { label, icon: Icon, className } = config[status];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${className}`}>
      <Icon size={12} />
      {label}
    </span>
  );
}

export default function LandRulesPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonsRef = useRef<Map<string, L.Polygon>>(new Map());
  
  const [rules, setRules] = useState<LandRule[]>([]);
  const [selectedRule, setSelectedRule] = useState<LandRule | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ zoneName: '', ruleText: '' });

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [14.7, -16.5],
      zoom: 7,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Draw zones
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    polygonsRef.current.forEach(p => p.remove());
    polygonsRef.current.clear();

    rules.forEach(rule => {
      const color = rule.status === 'valide' ? '#22c55e' : rule.status === 'conflit' ? '#ef4444' : '#f59e0b';
      const isSelected = selectedRule?.id === rule.id;

      const polygon = L.polygon(rule.polygon as L.LatLngTuple[], {
        color: isSelected ? '#1a365d' : color,
        weight: isSelected ? 3 : 2,
        fillColor: color,
        fillOpacity: isSelected ? 0.5 : 0.3,
      });

      polygon.on('click', () => {
        setSelectedRule(rule);
        setIsEditing(false);
      });

      polygon.addTo(map);
      polygonsRef.current.set(rule.id, polygon);
    });
  }, [rules, selectedRule]);

  const handleStartDrawing = () => {
    setIsDrawing(true);
    setSelectedRule(null);
    // In a real app, you'd enable Leaflet.draw or similar
  };

  const handleEdit = () => {
    if (selectedRule) {
      setEditForm({ zoneName: selectedRule.zoneName, ruleText: selectedRule.ruleText });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (selectedRule && isEditing) {
      const updated = rules.map(r => 
        r.id === selectedRule.id 
          ? { ...r, zoneName: editForm.zoneName, ruleText: editForm.ruleText, updatedAt: new Date() }
          : r
      );
      setRules(updated);
      setSelectedRule({ ...selectedRule, zoneName: editForm.zoneName, ruleText: editForm.ruleText });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (selectedRule) {
      setRules(rules.filter(r => r.id !== selectedRule.id));
      setSelectedRule(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNav />
      
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Map Area */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full" style={{ minHeight: '600px' }} />
          
          {/* Drawing Tools */}
          <div className="absolute top-4 right-4 z-[1000] bg-card border border-border rounded-md shadow-lg p-2">
            <Button
              size="sm"
              variant={isDrawing ? 'default' : 'outline'}
              onClick={handleStartDrawing}
              className="w-full"
            >
              <Plus size={16} className="mr-2" />
              Nouvelle zone
            </Button>
          </div>

          {/* Zone List */}
          <div className="absolute bottom-4 left-4 z-[1000] bg-card border border-border rounded-md shadow-lg p-3 max-w-[80vw] sm:max-w-xs">
            <h4 className="text-sm font-medium text-foreground mb-2">Zones définies</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {rules.map(rule => (
                <button
                  key={rule.id}
                  onClick={() => { setSelectedRule(rule); setIsEditing(false); }}
                  className={`w-full text-left p-2 rounded text-sm transition-colors ${
                    selectedRule?.id === rule.id ? 'bg-accent' : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{rule.zoneName}</span>
                    <StatusBadge status={rule.status} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-border bg-card overflow-y-auto">
          {selectedRule ? (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {isEditing ? 'Modifier la zone' : 'Détails de la zone'}
                </h3>
                <StatusBadge status={selectedRule.status} />
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Nom de la zone</label>
                    <Input
                      value={editForm.zoneName}
                      onChange={(e) => setEditForm({ ...editForm, zoneName: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Règles applicables</label>
                    <Textarea
                      value={editForm.ruleText}
                      onChange={(e) => setEditForm({ ...editForm, ruleText: e.target.value })}
                      rows={6}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="flex-1">
                      <Save size={16} className="mr-2" />
                      Enregistrer
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Nom de la zone</h4>
                    <p className="text-foreground mt-1">{selectedRule.zoneName}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Règles applicables</h4>
                    <p className="text-sm text-foreground mt-1 leading-relaxed">
                      {selectedRule.ruleText}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Documents joints</h4>
                    {selectedRule.documents.length > 0 ? (
                      <div className="space-y-2">
                        {selectedRule.documents.map(doc => (
                          <div key={doc.id} className="flex items-center gap-2 p-2 bg-muted rounded">
                            <FileText size={16} className="text-danger" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">{formatFileSize(doc.size)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Aucun document</p>
                    )}
                    <Button variant="outline" size="sm" className="mt-2 w-full">
                      <UploadIcon size={14} className="mr-2" />
                      Joindre un PDF
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t border-border">
                    <p>Créé le {selectedRule.createdAt.toLocaleDateString('fr-FR')} par {selectedRule.createdBy}</p>
                    <p>Modifié le {selectedRule.updatedAt.toLocaleDateString('fr-FR')}</p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleEdit} variant="outline" className="flex-1">
                      <Pencil size={16} className="mr-2" />
                      Modifier
                    </Button>
                    <Button onClick={handleDelete} variant="destructive">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>Sélectionnez une zone sur la carte pour voir ses règles foncières</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
