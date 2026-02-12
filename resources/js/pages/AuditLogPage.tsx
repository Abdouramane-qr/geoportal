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
import { useEffect, useState } from 'react';
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
    create: 'border-[#2ECC71]/30 bg-[#2ECC71]/15 text-[#27AE60]',
    update: 'border-[#27AE60]/30 bg-[#27AE60]/10 text-[#27AE60]',
    delete: 'border-[#D68910]/30 bg-[#D68910]/10 text-[#D68910]',
    validate: 'border-[#2ECC71]/30 bg-[#2ECC71]/15 text-[#27AE60]',
    reject: 'border-[#D68910]/30 bg-[#D68910]/10 text-[#D68910]',
    transfer: 'border-[#616161]/25 bg-[#616161]/10 text-[#616161]',
    attach_document: 'border-[#2ECC71]/30 bg-[#2ECC71]/10 text-[#27AE60]',
  };

  return (
    <Badge variant="outline" className={variants[action]}>
      {ACTION_LABELS[action]}
    </Badge>
  );
}

function JustificationBadge({ type }: { type: 'scientific' | 'legal' | 'administrative' }) {
  const variants = {
    scientific: 'bg-[#2ECC71]/10 text-[#27AE60]',
    legal: 'bg-[#D68910]/10 text-[#D68910]',
    administrative: 'bg-[#616161]/10 text-[#616161]',
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
        className="cursor-pointer hover:bg-[#2ECC71]/5"
        onClick={() => setExpanded(!expanded)}
      >
        <TableCell className="font-mono text-xs text-[#616161]">
          {entry.id}
        </TableCell>
        <TableCell>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">
              {format(entry.timestamp, 'dd MMM yyyy', { locale: fr })}
            </span>
            <span className="text-xs text-[#616161]">
              {format(entry.timestamp, 'HH:mm:ss')}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{entry.userName}</span>
            <span className="text-xs text-[#616161]">{entry.userRole}</span>
          </div>
        </TableCell>
        <TableCell>
          <ActionBadge action={entry.action} />
        </TableCell>
        <TableCell>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{entry.entityName}</span>
            <span className="text-xs text-[#616161]">
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
        <TableRow className="bg-[linear-gradient(135deg,#f8f9fa_0%,#ffffff_100%)]">
          <TableCell colSpan={7} className="p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-3 rounded-md border border-[#2ECC71]/20 bg-white p-3">
                <div>
                  <span className="text-xs uppercase tracking-wide text-[#616161]">
                    Justification
                  </span>
                  <p className="mt-1 text-sm leading-relaxed text-[#212121]">
                    {entry.justification}
                  </p>
                </div>
                {entry.field && (
                  <div>
                    <span className="text-xs uppercase tracking-wide text-[#616161]">
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
              <div className="space-y-3 rounded-md border border-[#2ECC71]/20 bg-white p-3">
                <div>
                  <span className="text-xs uppercase tracking-wide text-[#616161]">
                    Métadonnées techniques
                  </span>
                  <div className="mt-1 space-y-1 font-mono text-sm text-[#616161]">
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
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    async function fetchLogs() {
      try {
        setLoading(true);
        const response = await fetch('/api/audit-logs?per_page=100', {
          headers: { Accept: 'application/json' },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch audit logs: ${response.status}`);
        }

        const payload = (await response.json()) as {
          data: Array<{
            id: number;
            created_at: string;
            action: string;
            entity_type: string;
            entity_id: string;
            metadata?: Record<string, unknown> | null;
            actor?: {
              id: number;
              name: string;
              profile?: { role?: string | null } | null;
            } | null;
          }>;
        };

        const actionMap: Record<string, AuditAction> = {
          'user.created': 'create',
          'user.updated': 'update',
          'user.deleted': 'delete',
        };

        const mapped: AuditEntry[] = payload.data.map((row) => {
          const metadata = row.metadata ?? {};
          const entityType = row.entity_type as AuditEntry['entityType'];

          return {
            id: String(row.id),
            timestamp: new Date(row.created_at),
            userId: String(row.actor?.id ?? '0'),
            userName: row.actor?.name ?? 'Système',
            userRole: row.actor?.profile?.role ?? 'inconnu',
            action: actionMap[row.action] ?? 'update',
            entityType: entityType in ENTITY_LABELS ? entityType : 'user',
            entityId: row.entity_id ?? 'n/a',
            entityName: String((metadata.entity_name as string | undefined) ?? row.entity_type),
            field: Array.isArray(metadata.fields) ? String(metadata.fields[0] ?? '') : undefined,
            previousValue: undefined,
            newValue: undefined,
            justification: String((metadata.email as string | undefined) ?? 'Action utilisateur'),
            justificationType: 'administrative',
            ipAddress: 'n/a',
            checksum: 'n/a',
          };
        });

        setLogs(mapped);
      } catch (error) {
        console.error(error);
        toast.error("Impossible de charger le journal d'audit.");
      } finally {
        setLoading(false);
      }
    }

    void fetchLogs();
  }, []);

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
      <main className="space-y-6 bg-[linear-gradient(180deg,#f8f9fa_0%,#ffffff_45%,#f8f9fa_100%)] p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 rounded-xl border border-[#2ECC71]/20 bg-white p-4 shadow-[0_10px_30px_rgba(33,33,33,0.06)] md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-[#2ECC71]/15 p-2">
              <Shield className="h-6 w-6 text-[#27AE60]" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#27AE60]">Traçabilité</p>
              <h1 className="text-2xl font-semibold text-[#212121]">
                Journal d'audit
              </h1>
              <p className="text-sm text-[#616161]">
                Traçabilité complète des modifications • Infalsifiable
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="gap-2 border-[#27AE60]/40 text-[#27AE60] hover:bg-[#27AE60]/10"
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
          <Card className="border-[#2ECC71]/20 bg-[linear-gradient(135deg,#f8f9fa_0%,#ffffff_100%)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-[#616161]" />
                <div>
                  <p className="text-2xl font-semibold text-[#212121]">{logs.length}</p>
                  <p className="text-xs text-[#616161]">Entrées totales</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#2ECC71]/20 bg-[linear-gradient(135deg,#f8f9fa_0%,#ffffff_100%)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-[#D68910]" />
                <div>
                  <p className="text-2xl font-semibold text-[#212121]">
                    {logs.filter(
                      (l) =>
                        l.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
                    ).length}
                  </p>
                  <p className="text-xs text-[#616161]">Dernières 24h</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#2ECC71]/20 bg-[linear-gradient(135deg,#f8f9fa_0%,#ffffff_100%)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-[#27AE60]" />
                <div>
                  <p className="text-2xl font-semibold text-[#212121]">
                    {new Set(logs.map((l) => l.userId)).size}
                  </p>
                  <p className="text-xs text-[#616161]">Utilisateurs actifs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#2ECC71]/20 bg-[linear-gradient(135deg,#f8f9fa_0%,#ffffff_100%)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-[#27AE60]" />
                <div>
                  <p className="text-2xl font-semibold text-[#212121]">
                    {
                      logs.filter((l) => l.entityType === 'parcel')
                        .length
                    }
                  </p>
                  <p className="text-xs text-[#616161]">
                    Modifications parcelles
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-[#2ECC71]/20 bg-white">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#616161]" />
                <Input
                  placeholder="Rechercher par nom, ID, utilisateur ou justification..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 border-[#2ECC71]/30 bg-white text-[#212121] placeholder:text-[#616161]"
                />
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:flex">
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-full border-[#2ECC71]/30 bg-white text-[#212121] md:w-[190px]">
                    <Filter size={14} className="mr-2" />
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent className="border-[#2ECC71]/30 bg-white text-[#212121]">
                    <SelectItem value="all">Toutes actions</SelectItem>
                    {Object.entries(ACTION_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={entityFilter} onValueChange={setEntityFilter}>
                  <SelectTrigger className="w-full border-[#2ECC71]/30 bg-white text-[#212121] md:w-[190px]">
                    <Filter size={14} className="mr-2" />
                    <SelectValue placeholder="Entité" />
                  </SelectTrigger>
                  <SelectContent className="border-[#2ECC71]/30 bg-white text-[#212121]">
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
        <Card className="overflow-hidden border-[#2ECC71]/20 bg-white shadow-[0_12px_30px_rgba(33,33,33,0.06)]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-[#212121]">
              <Shield size={16} className="text-[#27AE60]" />
              Historique des modifications
              <Badge variant="secondary" className="ml-2 bg-[#2ECC71]/15 text-[#27AE60]">
                {filteredLogs.length} entrées
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[linear-gradient(135deg,#f8f9fa_0%,#ffffff_100%)]">
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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-[#616161]">
                        <div className="inline-flex items-center gap-2">
                          <Loader2 size={16} className="animate-spin" />
                          Chargement...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-[#616161]">
                        Aucune entrée trouvée.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((entry) => (
                      <AuditRow key={entry.id} entry={entry} />
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Integrity Notice */}
        <Card className="border-[#2ECC71]/30 bg-[#2ECC71]/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 text-[#27AE60]" />
              <div>
                <h3 className="font-medium text-[#212121]">
                  Garantie d'intégrité
                </h3>
                <p className="mt-1 text-sm text-[#616161]">
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
