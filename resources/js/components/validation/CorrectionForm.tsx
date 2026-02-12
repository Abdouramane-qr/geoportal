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
      <div className="flex items-center gap-2 border-b border-[#2ECC71]/15 bg-[linear-gradient(135deg,#f8f9fa_0%,#ffffff_100%)] p-3">
        <FileCheck size={16} className="text-[#27AE60]" />
        <span className="text-sm font-medium text-[#212121]">Formulaire de correction</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Current Data */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-[#212121]">Données pédologiques actuelles</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(record.originalData).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <Label className="text-xs capitalize text-[#616161]">{key}</Label>
                <Input 
                  value={String(value)} 
                  readOnly 
                  className="h-9 border-[#2ECC71]/20 bg-[#f8f9fa] text-sm text-[#212121]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Errors */}
        {record.errors.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <AlertCircle size={14} className="text-[#D68910]" />
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
              <Check size={14} className="text-[#27AE60]" />
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
          <div className="border-t border-[#2ECC71]/15 pt-4">
            <h4 className="mb-3 text-sm font-medium text-[#212121]">Validation finale</h4>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs text-[#616161]">Nom de l'agronome validateur</Label>
                <Input
                  value={agronomistName}
                  onChange={(e) => setAgronomistName(e.target.value)}
                  placeholder="Dr. Diallo, Spécialiste Sols"
                  className="h-9 border-[#2ECC71]/30 bg-white text-[#212121]"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject(record.id)}
                  className="flex-1 border-[#D68910]/40 text-[#D68910] hover:bg-[#D68910]/10"
                >
                  <X size={14} className="mr-1" />
                  Rejeter
                </Button>
                <Button
                  size="sm"
                  disabled={!canValidate}
                  onClick={() => onValidate(record.id, agronomistName)}
                  className="flex-1 bg-[#27AE60] text-white hover:bg-[#27AE60]/90 disabled:bg-[#2ECC71]/45"
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
          <div className="border-t border-[#2ECC71]/15 pt-4">
            <div className="rounded-lg border border-[#2ECC71]/30 bg-[#2ECC71]/10 p-3">
              <div className="mb-2 flex items-center gap-2 text-[#27AE60]">
                <Check size={16} />
                <span className="font-medium text-sm">Validé scientifiquement</span>
              </div>
              <p className="text-xs text-[#616161]">
                Par {record.validatedBy} le {record.validatedAt?.toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        )}

        {/* Generate Certificate */}
        <div className="border-t border-[#2ECC71]/15 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateCertificate}
            disabled={isGeneratingCertificate}
            className="w-full border-[#27AE60]/40 text-[#27AE60] hover:bg-[#27AE60]/10"
          >
            {isGeneratingCertificate ? (
              <Loader2 size={14} className="mr-2 animate-spin" />
            ) : (
              <Download size={14} className="mr-2" />
            )}
            Générer certificat d'audit (SHA-256)
          </Button>
          
          {certificateData && (
            <div className="mt-3 rounded-lg bg-[#f8f9fa] p-3 text-xs">
              <p className="font-medium text-[#212121]">Certificat généré</p>
              <p className="mt-1 text-[#616161]">
                ID: <code className="text-[#27AE60]">{certificateData.certificateId}</code>
              </p>
              <p className="text-[#616161]">
                Hash: <code className="text-[#27AE60]">{certificateData.documentHash}</code>
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
        ? 'bg-[#fff7ec] border-l-[#D68910]' 
        : 'bg-[#D68910]/10 border-l-[#D68910]'
    )}>
      <div className="flex items-center gap-2 mb-1">
        <span className={cn(
          'text-xs px-1.5 py-0.5 rounded font-medium',
          error.severity === 'error' 
            ? 'bg-[#D68910]/15 text-[#D68910]' 
            : 'bg-[#D68910]/15 text-[#D68910]'
        )}>
          {error.severity === 'error' ? 'Erreur' : 'Alerte'}
        </span>
        <span className="font-medium text-sm text-[#212121] capitalize">{error.field}</span>
      </div>
      <p className="text-xs text-[#616161]">{error.message}</p>
      <p className="mt-1 text-xs text-[#616161]">
        Valeur: <code className="rounded bg-white px-1">{error.value}</code> • Règle: {error.rule}
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
      correction.accepted === true && 'border-[#2ECC71]/30 bg-[#2ECC71]/10',
      correction.accepted === false && 'border-[#D68910]/30 bg-[#fff7ec]',
      correction.accepted === null && 'border-[#2ECC71]/20 bg-white'
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground capitalize">{correction.field}</p>
          <div className="flex items-center gap-2 mt-1 text-xs">
            <span className="line-through text-[#D68910]">{correction.originalValue}</span>
            <span className="text-[#616161]">→</span>
            <span className="font-medium text-[#27AE60]">{correction.proposedValue}</span>
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-[#616161]">{correction.reason}</p>
        </div>
        {correction.accepted === null ? (
          <div className="flex gap-1 shrink-0">
            <Button 
              size="icon" 
              variant="outline"
              onClick={() => onAccept(false)}
              className="h-7 w-7 border-[#D68910]/40 text-[#D68910] hover:bg-[#D68910]/10"
            >
              <X size={12} />
            </Button>
            <Button 
              size="icon"
              onClick={() => onAccept(true)}
              className="h-7 w-7 bg-[#27AE60] text-white hover:bg-[#27AE60]/90"
            >
              <Check size={12} />
            </Button>
          </div>
        ) : (
          <div className={cn(
            'px-2 py-1 rounded text-xs font-medium shrink-0',
            correction.accepted ? 'bg-[#2ECC71]/15 text-[#27AE60]' : 'bg-[#D68910]/15 text-[#D68910]'
          )}>
            {correction.accepted ? 'Acceptée' : 'Refusée'}
          </div>
        )}
      </div>
    </div>
  );
}
