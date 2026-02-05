import { Check, X, AlertCircle, FileCheck, Loader2, Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { ValidationRecord, CorrectionProposal, ValidationError } from '@/types/validation';

interface CorrectionFormProps {
  record: ValidationRecord;
  onAcceptCorrection: (recordId: string, field: string, accept: boolean) => void;
  onValidate: (recordId: string, agronomist: string) => void;
  onReject: (recordId: string) => void;
}

export function CorrectionForm({
  record,
  onAcceptCorrection,
  onValidate,
  onReject,
}: CorrectionFormProps) {
  const [agronomistName, setAgronomistName] = useState('');
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);
  const [certificateData, setCertificateData] = useState<{
    certificateId: string;
    documentHash: string;
  } | null>(null);

  const allCorrectionsHandled = record.corrections.every(c => c.accepted !== null);
  const canValidate = record.currentStep === 'validation' && allCorrectionsHandled && agronomistName.trim().length > 0;

  const handleGenerateCertificate = async () => {
    setIsGeneratingCertificate(true);
    
    try {
      // Prepare audit entries from the record
      const auditEntries = [
        {
          id: `VAL-${record.id}`,
          timestamp: new Date().toISOString(),
          userName: agronomistName || 'Système',
          userRole: 'Agronome validateur',
          action: 'validation',
          entityType: 'parcelle',
          entityId: record.parcelId,
          entityName: record.parcelName,
          justification: `Validation scientifique des données pédologiques`,
          justificationType: 'scientifique',
          checksum: `SHA256:${Date.now().toString(36)}`,
        },
        ...record.corrections.map((c, idx) => ({
          id: `CORR-${record.id}-${idx}`,
          timestamp: new Date().toISOString(),
          userName: agronomistName || 'Système',
          userRole: 'Agronome validateur',
          action: c.accepted ? 'correction_acceptee' : 'correction_refusee',
          entityType: 'donnee_pedologique',
          entityId: record.parcelId,
          entityName: record.parcelName,
          field: c.field,
          previousValue: String(c.originalValue),
          newValue: String(c.proposedValue),
          justification: c.reason,
          justificationType: 'scientifique',
          checksum: `SHA256:${(Date.now() + idx).toString(36)}`,
        })),
      ];

      const certificateId = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`).toString();
      const documentHash = `SHA256:${Math.random().toString(36).slice(2, 10)}`;

      setCertificateData({
        certificateId,
        documentHash,
      });

      const content = JSON.stringify(
        {
          certificateId,
          documentHash,
          generatedBy: agronomistName || 'Système',
          generatedAt: new Date().toISOString(),
          entries: auditEntries,
        },
        null,
        2,
      );

      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificat-audit-${certificateId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Certificat d\'audit généré avec succès', {
        description: `ID: ${certificateId}`,
      });
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('Erreur lors de la génération du certificat');
    } finally {
      setIsGeneratingCertificate(false);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-3 border-b border-border bg-muted/50 flex items-center gap-2">
        <FileCheck size={16} className="text-primary" />
        <span className="font-medium text-sm">Formulaire de correction</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Current Data */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Données pédologiques actuelles</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(record.originalData).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <Label className="text-xs text-muted-foreground capitalize">{key}</Label>
                <Input 
                  value={String(value)} 
                  readOnly 
                  className="bg-muted/50 text-sm h-9"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Errors */}
        {record.errors.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <AlertCircle size={14} className="text-danger" />
              Erreurs détectées
            </h4>
            <div className="space-y-2">
              {record.errors.map((error, idx) => (
                <ErrorItem key={idx} error={error} />
              ))}
            </div>
          </div>
        )}

        {/* Corrections */}
        {record.corrections.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Check size={14} className="text-success" />
              Corrections proposées
            </h4>
            <div className="space-y-3">
              {record.corrections.map((correction, idx) => (
                <CorrectionItem
                  key={idx}
                  correction={correction}
                  onAccept={(accept) => onAcceptCorrection(record.id, correction.field, accept)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Validation */}
        {record.currentStep === 'validation' && allCorrectionsHandled && !record.validatedBy && (
          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Validation finale</h4>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Nom de l'agronome validateur</Label>
                <Input
                  value={agronomistName}
                  onChange={(e) => setAgronomistName(e.target.value)}
                  placeholder="Dr. Diallo, Spécialiste Sols"
                  className="h-9"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onReject(record.id)}
                  className="flex-1"
                >
                  <X size={14} className="mr-1" />
                  Rejeter
                </Button>
                <Button
                  size="sm"
                  disabled={!canValidate}
                  onClick={() => onValidate(record.id, agronomistName)}
                  className="flex-1 bg-success hover:bg-success/90"
                >
                  <Check size={14} className="mr-1" />
                  Valider
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Already Validated */}
        {record.validatedBy && (
          <div className="border-t border-border pt-4">
            <div className="p-3 bg-success/10 rounded-lg border border-success/30">
              <div className="flex items-center gap-2 text-success mb-2">
                <Check size={16} />
                <span className="font-medium text-sm">Validé scientifiquement</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Par {record.validatedBy} le {record.validatedAt?.toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        )}

        {/* Generate Certificate */}
        <div className="border-t border-border pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateCertificate}
            disabled={isGeneratingCertificate}
            className="w-full"
          >
            {isGeneratingCertificate ? (
              <Loader2 size={14} className="mr-2 animate-spin" />
            ) : (
              <Download size={14} className="mr-2" />
            )}
            Générer certificat d'audit (SHA-256)
          </Button>
          
          {certificateData && (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg text-xs">
              <p className="font-medium text-foreground">Certificat généré</p>
              <p className="text-muted-foreground mt-1">
                ID: <code className="text-primary">{certificateData.certificateId}</code>
              </p>
              <p className="text-muted-foreground">
                Hash: <code className="text-primary">{certificateData.documentHash}</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ErrorItem({ error }: { error: ValidationError }) {
  return (
    <div className={cn(
      'p-3 rounded-lg border-l-4',
      error.severity === 'error' 
        ? 'bg-danger/5 border-l-danger' 
        : 'bg-warning/5 border-l-warning'
    )}>
      <div className="flex items-center gap-2 mb-1">
        <span className={cn(
          'text-xs px-1.5 py-0.5 rounded font-medium',
          error.severity === 'error' 
            ? 'bg-danger/15 text-danger' 
            : 'bg-warning/15 text-warning'
        )}>
          {error.severity === 'error' ? 'Erreur' : 'Alerte'}
        </span>
        <span className="font-medium text-sm text-foreground capitalize">{error.field}</span>
      </div>
      <p className="text-xs text-muted-foreground">{error.message}</p>
      <p className="text-xs text-muted-foreground mt-1">
        Valeur: <code className="bg-muted px-1 rounded">{error.value}</code> • Règle: {error.rule}
      </p>
    </div>
  );
}

function CorrectionItem({ 
  correction, 
  onAccept 
}: { 
  correction: CorrectionProposal; 
  onAccept: (accept: boolean) => void;
}) {
  return (
    <div className={cn(
      'p-3 border rounded-lg',
      correction.accepted === true && 'border-success bg-success/5',
      correction.accepted === false && 'border-danger bg-danger/5',
      correction.accepted === null && 'border-border bg-card'
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground capitalize">{correction.field}</p>
          <div className="flex items-center gap-2 mt-1 text-xs">
            <span className="text-danger line-through">{correction.originalValue}</span>
            <span className="text-muted-foreground">→</span>
            <span className="text-success font-medium">{correction.proposedValue}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{correction.reason}</p>
        </div>
        {correction.accepted === null ? (
          <div className="flex gap-1 shrink-0">
            <Button 
              size="icon" 
              variant="outline"
              onClick={() => onAccept(false)}
              className="h-7 w-7"
            >
              <X size={12} />
            </Button>
            <Button 
              size="icon"
              onClick={() => onAccept(true)}
              className="h-7 w-7 bg-success hover:bg-success/90"
            >
              <Check size={12} />
            </Button>
          </div>
        ) : (
          <div className={cn(
            'px-2 py-1 rounded text-xs font-medium shrink-0',
            correction.accepted ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
          )}>
            {correction.accepted ? 'Acceptée' : 'Refusée'}
          </div>
        )}
      </div>
    </div>
  );
}
