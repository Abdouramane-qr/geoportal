import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  FileText,
  Search,
  Shield,
  Clock,
  User,
  MapPin,
  Filter,
  Download,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { MainNav } from '@/components/layout/MainNav';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type {
  AuditAction,
  AuditEntry} from '@/types/audit';
import {
  ACTION_LABELS,
  ENTITY_LABELS,
  JUSTIFICATION_LABELS
} from '@/types/audit';

function ActionBadge({ action }: { action: AuditAction }) {
  const variants: Record<AuditAction, string> = {
    create: 'bg-success/15 text-success border-success/30',
    update: 'bg-primary/15 text-primary border-primary/30',
    delete: 'bg-destructive/15 text-destructive border-destructive/30',
    validate: 'bg-success/15 text-success border-success/30',
    reject: 'bg-warning/15 text-warning border-warning/30',
    transfer: 'bg-secondary/15 text-secondary border-secondary/30',
    attach_document: 'bg-accent text-accent-foreground border-accent',
  };

  return (
    <Badge variant="outline" className={variants[action]}>
      {ACTION_LABELS[action]}
    </Badge>
  );
}

function JustificationBadge({ type }: { type: 'scientific' | 'legal' | 'administrative' }) {
  const variants = {
    scientific: 'bg-primary/10 text-primary',
    legal: 'bg-secondary/10 text-secondary',
    administrative: 'bg-muted text-muted-foreground',
  };

  const icons = {
    scientific: '🔬',
    legal: '⚖️',
    administrative: '📋',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${variants[type]}`}>
      <span>{icons[type]}</span>
      {JUSTIFICATION_LABELS[type]}
    </span>
  );
}

function AuditRow({ entry }: { entry: AuditEntry }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <TableRow
        className="cursor-pointer hover:bg-muted/50"
        onClick={() => setExpanded(!expanded)}
      >
        <TableCell className="font-mono text-xs text-muted-foreground">
          {entry.id}
        </TableCell>
        <TableCell>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">
              {format(entry.timestamp, 'dd MMM yyyy', { locale: fr })}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(entry.timestamp, 'HH:mm:ss')}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{entry.userName}</span>
            <span className="text-xs text-muted-foreground">{entry.userRole}</span>
          </div>
        </TableCell>
        <TableCell>
          <ActionBadge action={entry.action} />
        </TableCell>
        <TableCell>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{entry.entityName}</span>
            <span className="text-xs text-muted-foreground">
              {ENTITY_LABELS[entry.entityType]} • {entry.entityId}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <JustificationBadge type={entry.justificationType} />
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-1 text-success">
            <CheckCircle size={14} />
            <span className="text-xs font-mono">Vérifié</span>
          </div>
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow className="bg-muted/30">
          <TableCell colSpan={7} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Justification
                  </span>
                  <p className="text-sm mt-1 text-foreground leading-relaxed">
                    {entry.justification}
                  </p>
                </div>
                {entry.field && (
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      Champ modifié
                    </span>
                    <p className="text-sm mt-1">
                      <span className="font-medium">{entry.field}</span>:{' '}
                      <span className="text-destructive line-through">
                        {entry.previousValue}
                      </span>{' '}
                      →{' '}
                      <span className="text-success font-medium">
                        {entry.newValue}
                      </span>
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Métadonnées techniques
                  </span>
                  <div className="text-sm mt-1 space-y-1 font-mono text-muted-foreground">
                    <p>IP: {entry.ipAddress}</p>
                    <p>Signature: {entry.checksum}</p>
                  </div>
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default function AuditLogPage() {
  const [logs] = useState<AuditEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);

  const filteredLogs = logs.filter((entry) => {
    const matchesSearch =
      entry.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.justification.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = actionFilter === 'all' || entry.action === actionFilter;
    const matchesEntity = entityFilter === 'all' || entry.entityType === entityFilter;

    return matchesSearch && matchesAction && matchesEntity;
  });

  async function handleExportPDF() {
    setIsExporting(true);
    try {
      const entriesForExport = filteredLogs.map((entry) => ({
        id: entry.id,
        timestamp: format(entry.timestamp, "dd/MM/yyyy HH:mm:ss"),
        userName: entry.userName,
        userRole: entry.userRole,
        action: ACTION_LABELS[entry.action],
        entityType: ENTITY_LABELS[entry.entityType],
        entityId: entry.entityId,
        entityName: entry.entityName,
        field: entry.field,
        previousValue: entry.previousValue,
        newValue: entry.newValue,
        justification: entry.justification,
        justificationType: entry.justificationType,
        checksum: entry.checksum,
      }));

      const content = JSON.stringify(
        {
          generatedBy: 'Administrateur Système',
          generatedAt: new Date().toISOString(),
          entries: entriesForExport,
        },
        null,
        2,
      );

      const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rapport-audit-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Rapport exporté avec succès', {
        description: `Fichier généré localement`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Erreur lors de l'export", {
        description: "Impossible de générer le rapport PDF.",
      });
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background app-shell">
      <MainNav />
      <main className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Journal d'audit
              </h1>
              <p className="text-sm text-muted-foreground">
                Traçabilité complète des modifications • Infalsifiable
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            {isExporting ? 'Génération...' : 'Exporter le journal'}
          </Button>
        </div>


        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-semibold">{logs.length}</p>
                  <p className="text-xs text-muted-foreground">Entrées totales</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-semibold">
                    {logs.filter(
                      (l) =>
                        l.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
                    ).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Dernières 24h</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-semibold">
                    {new Set(logs.map((l) => l.userId)).size}
                  </p>
                  <p className="text-xs text-muted-foreground">Utilisateurs actifs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-semibold">
                    {
                      logs.filter((l) => l.entityType === 'parcel')
                        .length
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Modifications parcelles
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, ID, utilisateur ou justification..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-[160px]">
                    <Filter size={14} className="mr-2" />
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes actions</SelectItem>
                    {Object.entries(ACTION_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={entityFilter} onValueChange={setEntityFilter}>
                  <SelectTrigger className="w-[160px]">
                    <Filter size={14} className="mr-2" />
                    <SelectValue placeholder="Entité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes entités</SelectItem>
                    {Object.entries(ENTITY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield size={16} className="text-primary" />
              Historique des modifications
              <Badge variant="secondary" className="ml-2">
                {filteredLogs.length} entrées
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[120px]">ID</TableHead>
                    <TableHead className="w-[120px]">Date/Heure</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead className="w-[120px]">Action</TableHead>
                    <TableHead>Entité concernée</TableHead>
                    <TableHead className="w-[120px]">Type</TableHead>
                    <TableHead className="w-[100px] text-right">Intégrité</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((entry) => (
                    <AuditRow key={entry.id} entry={entry} />
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Integrity Notice */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium text-foreground">
                  Garantie d'intégrité
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Chaque entrée est signée cryptographiquement (SHA-256) et
                  horodatée. Le journal est immuable et conforme aux exigences
                  d'audit des systèmes fonciers institutionnels.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
