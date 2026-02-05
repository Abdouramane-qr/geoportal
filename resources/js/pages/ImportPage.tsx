import { Upload, FileSpreadsheet, AlertTriangle, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useState, useCallback, useId } from 'react';
import { MainNav } from '@/components/layout/MainNav';
import { Button } from '@/components/ui/button';
import { addLayerToStore } from '@/features/map/lib/layer-store';
import { assessGeoJsonCoordinates, countValidGeometries, createLayer, normalizeGeoJSON } from '@/features/map/lib/layer-utils';
import type { 
  ImportSession, 
  ImportedRow, 
  ImportStatus, 
  ValidationIssue} from '@/types/import';
import {
  VALIDATION_RULES 
} from '@/types/import';

type RawRow = Record<string, string | number | null | undefined>;



const normalizeHeader = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');

const HEADER_MAP: Record<string, keyof RawRow> = {
  parcelid: 'parcelId',
  parcelle: 'parcelId',
  id: 'parcelId',
  ph: 'pH',
  matiereorganique: 'organicMatter',
  matorg: 'organicMatter',
  slope: 'slope',
  pente: 'slope',
  profondeurnappe: 'waterTableDepth',
  nappe: 'waterTableDepth',
  kfactor: 'kFactor',
  couverturevegetale: 'vegetationCover',
  vegetation: 'vegetationCover',
  superficie: 'area',
  area: 'area',
};

const mapRowKeys = (row: Record<string, unknown>): RawRow => {
  const mapped: RawRow = {};
  Object.entries(row).forEach(([key, value]) => {
    const normalized = normalizeHeader(key);
    const target = HEADER_MAP[normalized];
    if (target) {
      mapped[target] = value as string | number;
    }
  });
  return mapped;
};

const coerceNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const num = typeof value === 'number' ? value : Number(String(value).replace(',', '.'));
  return Number.isFinite(num) ? num : null;
};

const validateRow = (row: RawRow, rowIndex: number): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];

  Object.entries(VALIDATION_RULES).forEach(([key, rule]) => {
    const value = row[key];
    const numericValue = coerceNumber(value);
    if (numericValue === null) return;
    if (numericValue < rule.min || numericValue > rule.max) {
      issues.push({
        row: rowIndex,
        column: key,
        value: String(value ?? ''),
        message: `${rule.label} doit être entre ${rule.min} et ${rule.max}`,
        severity: 'error',
      });
    }
  });

  return issues;
};

const buildSession = (fileName: string, fileType: ImportSession['fileType'], rows: ImportedRow[]): ImportSession => ({
  id: crypto.randomUUID(),
  fileName,
  fileType,
  uploadedAt: new Date(),
  status: 'brouillon',
  totalRows: rows.length,
  validRows: rows.filter((r) => r.isValid).length,
  errorRows: rows.filter((r) => !r.isValid).length,
  rows,
});

const parseGeoJson = (data: unknown): RawRow[] => {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data.map((item) => item as RawRow);
  }
  if (typeof data === 'object' && (data as { type?: string }).type === 'FeatureCollection') {
    const fc = data as { features?: Array<{ properties?: RawRow }> };
    return (fc.features ?? []).map((feature) => feature.properties ?? {});
  }
  return [];
};

const parseTabularRows = (rows: Array<Record<string, unknown>>): RawRow[] =>
  rows.map((row) => mapRowKeys(row));

const getRowValues = (row: { values?: unknown }) => {
  const values = row.values;
  return Array.isArray(values) ? values : [];
};

function StatusBadge({ status }: { status: ImportStatus }) {
  const config = {
    brouillon: { label: 'Brouillon', className: 'bg-muted text-muted-foreground' },
    validé: { label: 'Validé', className: 'bg-success/15 text-success' },
    rejeté: { label: 'Rejeté', className: 'bg-danger/15 text-danger' },
  };

  const { label, className } = config[status];

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${className}`}>
      {status === 'validé' && <CheckCircle size={14} className="mr-1" />}
      {status === 'rejeté' && <XCircle size={14} className="mr-1" />}
      {label}
    </span>
  );
}

function ValidationTable({ rows }: { rows: ImportedRow[] }) {
  const hasIssue = (row: ImportedRow, column: keyof RawRow) =>
    row.issues.some((issue) => issue.column === column);

  const formatValue = (value: number | null | undefined) =>
    value === null || value === undefined ? '—' : value;

  return (
    <div className="space-y-4">
      <div className="hidden md:block border border-border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-foreground">ID Parcelle</th>
                <th className="px-4 py-3 text-left font-medium text-foreground">pH</th>
                <th className="px-4 py-3 text-left font-medium text-foreground">Mat. Org. (%)</th>
                <th className="px-4 py-3 text-left font-medium text-foreground">Pente (%)</th>
                <th className="px-4 py-3 text-left font-medium text-foreground">Statut</th>
                <th className="px-4 py-3 text-left font-medium text-foreground">Erreurs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.id} className={!row.isValid ? 'bg-danger/5' : ''}>
                  <td className="px-4 py-3 font-mono text-xs">{row.data.parcelId ?? row.id}</td>
                  <td
                    className={`px-4 py-3 ${
                      hasIssue(row, 'pH') ? 'text-danger font-semibold' : ''
                    }`}
                  >
                    {formatValue(row.data.pH)}
                  </td>
                  <td
                    className={`px-4 py-3 ${
                      hasIssue(row, 'organicMatter') ? 'text-danger font-semibold' : ''
                    }`}
                  >
                    {formatValue(row.data.organicMatter)}
                  </td>
                  <td
                    className={`px-4 py-3 ${
                      hasIssue(row, 'slope') ? 'text-danger font-semibold' : ''
                    }`}
                  >
                    {formatValue(row.data.slope)}
                  </td>
                  <td className="px-4 py-3">
                    {row.isValid ? (
                      <span className="inline-flex items-center text-success">
                        <CheckCircle size={14} className="mr-1" />
                        Valide
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-danger">
                        <XCircle size={14} className="mr-1" />
                        Erreur
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {row.issues.map((issue, idx) => (
                      <div key={idx} className="text-xs text-danger">
                        {issue.message}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="md:hidden flex flex-col gap-3">
        {rows.map((row) => (
          <article
            key={row.id}
            className={[
              'flex flex-col gap-3 border rounded-lg p-4 bg-card shadow-sm',
              row.isValid ? 'border-border' : 'border-danger/40 bg-danger/5',
            ].join(' ')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Ligne {row.id}
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {row.data.parcelId ? `Parcelle ${row.data.parcelId}` : `ID ${row.id}`}
                </p>
              </div>
              <span
                className={`text-xs font-semibold uppercase tracking-wide ${
                  row.isValid ? 'text-success' : 'text-danger'
                }`}
              >
                {row.isValid ? 'Valide' : 'Erreur'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-foreground">
              <div>
                <p className="text-xs text-muted-foreground">pH</p>
                <p className={`font-semibold ${hasIssue(row, 'pH') ? 'text-danger' : ''}`}>
                  {formatValue(row.data.pH)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mat. Org. (%)</p>
                <p
                  className={`font-semibold ${hasIssue(row, 'organicMatter') ? 'text-danger' : ''}`}
                >
                  {formatValue(row.data.organicMatter)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pente (%)</p>
                <p className={`font-semibold ${hasIssue(row, 'slope') ? 'text-danger' : ''}`}>
                  {formatValue(row.data.slope)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Statut</p>
                <p className="font-semibold">
                  {row.isValid ? 'Valide' : 'Erreur'}
                </p>
              </div>
            </div>
            {row.issues.length > 0 && (
              <div className="bg-danger/10 border border-danger/30 rounded-md px-3 py-2 text-xs text-danger space-y-1">
                {row.issues.map((issue, idx) => (
                  <p key={idx}>{issue.message}</p>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

export default function ImportPage() {
  const inputId = useId();
  const [session, setSession] = useState<ImportSession | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [geojsonData, setGeojsonData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [mapMessage, setMapMessage] = useState<string | null>(null);
  const [sentToMap, setSentToMap] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      void handleFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      void handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setErrorMessage(null);
    const extension = file.name.split('.').pop()?.toLowerCase();

    try {
      if (extension === 'json' || extension === 'geojson') {
        const text = await file.text();
        const parsed = JSON.parse(text);
        const normalized = normalizeGeoJSON(parsed);
        const rawRows = parseGeoJson(parsed);

        if (!rawRows.length || !normalized) {
          setErrorMessage('Aucune donnée valide trouvée dans le fichier JSON/GeoJSON.');
          return;
        }

        if (countValidGeometries(normalized) === 0) {
          setErrorMessage('Aucune géométrie valide trouvée dans le GeoJSON. Vérifiez la projection et le contenu.');
          return;
        }

        const assessment = assessGeoJsonCoordinates(normalized);
        if (assessment.status === 'suspect') {
          setErrorMessage(assessment.reason ?? 'Coordonnées suspectes. Vérifiez la projection.');
          return;
        }

        const rows: ImportedRow[] = rawRows.map((raw, index) => {
          const data = {
            parcelId: raw.parcelId ?? raw.id ?? `P${index + 1}`,
            pH: coerceNumber(raw.pH),
            organicMatter: coerceNumber(raw.organicMatter),
            slope: coerceNumber(raw.slope),
            waterTableDepth: coerceNumber(raw.waterTableDepth),
            kFactor: coerceNumber(raw.kFactor),
            vegetationCover: coerceNumber(raw.vegetationCover),
            area: coerceNumber(raw.area),
          };
          const issues = validateRow(data, index + 1);
          return {
            id: String(data.parcelId ?? index + 1),
            data,
            issues,
            isValid: issues.length === 0,
          };
        });

        setSession(buildSession(file.name, extension === 'geojson' ? 'geojson' : 'json', rows));
        setGeojsonData(normalized);
        setSentToMap(false);
        setMapMessage(null);

        // Auto-send GeoJSON layers to the map for immediate visibility
    const layer = createLayer(
      normalized,
      file.name.replace(/\.(geojson|json)$/i, ''),
      Date.now(),
    );
    addLayerToStore(layer);
    setSentToMap(true);
    setMapMessage("Couche envoyée vers la carte. Ouvrez l'onglet Carte pour l'afficher.");
        return;
      }

      if (extension === 'csv') {
        setGeojsonData(null);
        setMapMessage(null);
        setSentToMap(false);
        const Papa = await import('papaparse');
        const text = await file.text();
        const parsed = Papa.parse<Record<string, unknown>>(text, {
          header: true,
          skipEmptyLines: true,
        });

        if (parsed.errors?.length) {
          setErrorMessage('Erreur de parsing CSV. Vérifiez le fichier.');
          return;
        }

        const mappedRows = parseTabularRows(parsed.data);
        if (!mappedRows.length) {
          setErrorMessage('Aucune donnée valide trouvée dans le fichier.');
          return;
        }

        const rows: ImportedRow[] = mappedRows.map((raw, index) => {
          const data = {
            parcelId: raw.parcelId ?? raw.id ?? `P${index + 1}`,
            pH: coerceNumber(raw.pH),
            organicMatter: coerceNumber(raw.organicMatter),
            slope: coerceNumber(raw.slope),
            waterTableDepth: coerceNumber(raw.waterTableDepth),
            kFactor: coerceNumber(raw.kFactor),
            vegetationCover: coerceNumber(raw.vegetationCover),
            area: coerceNumber(raw.area),
          };
          const issues = validateRow(data, index + 1);
          return {
            id: String(data.parcelId ?? index + 1),
            data,
            issues,
            isValid: issues.length === 0,
          };
        });

        setSession(buildSession(file.name, 'csv', rows));
        return;
      }

      if (extension === 'xlsx' || extension === 'xls') {
        setGeojsonData(null);
        setMapMessage(null);
        setSentToMap(false);
        const ExcelJS = await import('exceljs');
        const buffer = await file.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const sheet = workbook.worksheets[0];

        if (!sheet) {
          setErrorMessage('Aucune feuille trouvée dans le fichier.');
          return;
        }

        const headerRow = sheet.getRow(1);
        const headers = getRowValues(headerRow)
          .slice(1)
          .map((value) => String(value ?? '').trim());

        const rawTable: Array<Record<string, unknown>> = [];
        sheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return;
          const rowValues = getRowValues(row).slice(1);
          const record: Record<string, unknown> = {};
          headers.forEach((header, idx) => {
            if (!header) return;
            record[header] = rowValues[idx] ?? null;
          });
          rawTable.push(record);
        });

        const mappedRows = parseTabularRows(rawTable);
        if (!mappedRows.length) {
          setErrorMessage('Aucune donnée valide trouvée dans le fichier.');
          return;
        }

        const rows: ImportedRow[] = mappedRows.map((raw, index) => {
          const data = {
            parcelId: raw.parcelId ?? raw.id ?? `P${index + 1}`,
            pH: coerceNumber(raw.pH),
            organicMatter: coerceNumber(raw.organicMatter),
            slope: coerceNumber(raw.slope),
            waterTableDepth: coerceNumber(raw.waterTableDepth),
            kFactor: coerceNumber(raw.kFactor),
            vegetationCover: coerceNumber(raw.vegetationCover),
            area: coerceNumber(raw.area),
          };
          const issues = validateRow(data, index + 1);
          return {
            id: String(data.parcelId ?? index + 1),
            data,
            issues,
            isValid: issues.length === 0,
          };
        });

        setSession(buildSession(file.name, 'excel', rows));
        return;
      }

      setErrorMessage('Format non supporté. Utilisez JSON/GeoJSON/Excel.');
    } catch (error) {
      console.error(error);
      setErrorMessage("Impossible de lire le fichier. Vérifiez le format et réessayez.");
    }
  };

  const handleValidate = () => {
    if (session && session.errorRows === 0) {
      setSession({ ...session, status: 'validé' });
    }
  };

  const handleReject = () => {
    if (session) {
      setSession({ ...session, status: 'rejeté' });
    }
  };

  const handleClear = () => {
    setSession(null);
    setGeojsonData(null);
    setMapMessage(null);
    setSentToMap(false);
  };

  const handleSendToMap = () => {
    if (!session || !geojsonData || sentToMap) return;
    const layer = createLayer(
      geojsonData,
      session.fileName.replace(/\.(geojson|json)$/i, ''),
      Date.now(),
    );
    addLayerToStore(layer);
    setMapMessage("Couche envoyée vers la carte. Ouvrez l'onglet Carte pour l'afficher.");
    setSentToMap(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background app-shell">
      <MainNav />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Import de données scientifiques</h1>
            <p className="text-muted-foreground mt-1">
              Importez vos fichiers Excel, CSV ou Shapefile pour validation
            </p>
          </div>

          {/* File Drop Zone */}
          {!session && (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-lg p-12 text-center transition-colors
                ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
              `}
            >
              <Upload size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Déposez vos fichiers ici
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Formats acceptés : JSON / GeoJSON / Excel (.xlsx/.xls) / CSV (.csv)
              </p>
              {errorMessage && (
                <p className="text-sm text-danger mb-4">{errorMessage}</p>
              )}
              <input
                id={inputId}
                type="file"
                accept=".xlsx,.xls,.csv,.geojson,.json"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button variant="outline" asChild>
                <label htmlFor={inputId} className="cursor-pointer">
                  <FileSpreadsheet size={16} className="mr-2" />
                  Sélectionner un fichier
                </label>
              </Button>
            </div>
          )}

          {/* Import Session */}
          {session && (
            <div className="space-y-6">
              {/* Session Header */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-muted rounded-md">
                      <FileSpreadsheet size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{session.fileName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Importé le {session.uploadedAt.toLocaleDateString('fr-FR')} à {session.uploadedAt.toLocaleTimeString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={session.status} />
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Total lignes</div>
                  <div className="text-2xl font-semibold text-foreground">{session.totalRows}</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 border-l-4 border-l-success">
                  <div className="text-sm text-muted-foreground">Lignes valides</div>
                  <div className="text-2xl font-semibold text-success">{session.validRows}</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 border-l-4 border-l-danger">
                  <div className="text-sm text-muted-foreground">Lignes en erreur</div>
                  <div className="text-2xl font-semibold text-danger">{session.errorRows}</div>
                </div>
              </div>

              {/* Validation Rules Info */}
              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={18} className="text-warning mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Règles de validation scientifique</h4>
                    <div className="text-sm text-muted-foreground mt-1 grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.entries(VALIDATION_RULES).slice(0, 4).map(([key, rule]) => (
                        <span key={key}>{rule.label}: {rule.min}-{rule.max}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Validation Table */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3">Tableau de validation</h3>
                <ValidationTable rows={session.rows} />
              </div>

              {/* Actions */}
              {session.status === 'brouillon' && (
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                  <Button variant="outline" onClick={handleClear}>
                    <Trash2 size={16} className="mr-2" />
                    Annuler
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleReject}
                  >
                    <XCircle size={16} className="mr-2" />
                    Rejeter
                  </Button>
                  {geojsonData && (
                    <Button variant="outline" onClick={handleSendToMap} disabled={sentToMap}>
                      <Upload size={16} className="mr-2" />
                      {sentToMap ? 'Envoyé vers la carte' : 'Envoyer vers la carte'}
                    </Button>
                  )}
                  <Button 
                    onClick={handleValidate}
                    disabled={session.errorRows > 0}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Valider l'import
                  </Button>
                </div>
              )}

              {mapMessage && (
                <div className="mt-4 text-sm text-success">
                  {mapMessage}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
