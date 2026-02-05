import { useState, useMemo } from 'react';
import { Check, AlertCircle, ChevronRight, User, FileCheck, Loader2, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ValidationRecord, 
  ValidationStep, 
  CorrectionProposal,
  STEP_CONFIG 
} from '@/types/validation';
import { cn } from '@/lib/utils';

interface ValidationWorkflowProps {
  record: ValidationRecord;
  onAcceptCorrection: (recordId: string, field: string, accept: boolean) => void;
  onValidate: (recordId: string, agronomist: string) => void;
  onReject: (recordId: string) => void;
}

const steps: ValidationStep[] = ['import', 'detection', 'correction', 'validation'];

function StepIndicator({ 
  step, 
  status, 
  isLast 
}: { 
  step: ValidationStep; 
  status: 'pending' | 'active' | 'completed' | 'error';
  isLast: boolean;
}) {
  const config = STEP_CONFIG[step];
  
  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors',
            status === 'completed' && 'bg-success border-success text-success-foreground',
            status === 'active' && 'bg-primary border-primary text-primary-foreground',
            status === 'pending' && 'bg-muted border-border text-muted-foreground',
            status === 'error' && 'bg-danger border-danger text-danger-foreground'
          )}
        >
          {status === 'completed' && <Check size={18} />}
          {status === 'active' && <Loader2 size={18} className="animate-spin" />}
          {status === 'pending' && <span className="text-sm font-medium">{steps.indexOf(step) + 1}</span>}
          {status === 'error' && <AlertCircle size={18} />}
        </div>
        <div className="mt-2 text-center">
          <p className={cn(
            'text-sm font-medium',
            status === 'active' ? 'text-primary' : 'text-foreground'
          )}>
            {config.label}
          </p>
          <p className="text-xs text-muted-foreground max-w-[120px]">
            {config.description}
          </p>
        </div>
      </div>
      {!isLast && (
        <ChevronRight 
          size={20} 
          className={cn(
            'mx-4 mt-[-24px]',
            status === 'completed' ? 'text-success' : 'text-border'
          )} 
        />
      )}
    </div>
  );
}

function CorrectionCard({ 
  correction, 
  onAccept 
}: { 
  correction: CorrectionProposal; 
  onAccept: (accept: boolean) => void;
}) {
  return (
    <div className={cn(
      'p-4 border rounded-lg',
      correction.accepted === true && 'border-success bg-success/5',
      correction.accepted === false && 'border-danger bg-danger/5',
      correction.accepted === null && 'border-border bg-card'
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="font-medium text-foreground capitalize">{correction.field}</p>
          <div className="flex items-center gap-2 mt-1 text-sm">
            <span className="text-danger line-through">{correction.originalValue}</span>
            <ChevronRight size={14} className="text-muted-foreground" />
            <span className="text-success font-medium">{correction.proposedValue}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">{correction.reason}</p>
        </div>
        {correction.accepted === null && (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onAccept(false)}
              className="h-8 w-8 p-0"
            >
              <X size={14} />
            </Button>
            <Button 
              size="sm"
              onClick={() => onAccept(true)}
              className="h-8 w-8 p-0 bg-success hover:bg-success/90"
            >
              <Check size={14} />
            </Button>
          </div>
        )}
        {correction.accepted !== null && (
          <div className={cn(
            'px-2 py-1 rounded text-xs font-medium',
            correction.accepted ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
          )}>
            {correction.accepted ? 'Acceptée' : 'Refusée'}
          </div>
        )}
      </div>
    </div>
  );
}

export function ValidationWorkflow({
  record,
  onAcceptCorrection,
  onValidate,
  onReject,
}: ValidationWorkflowProps) {
  const [agronomistName, setAgronomistName] = useState('');

  const allCorrectionsHandled = useMemo(() => {
    return record.corrections.every(c => c.accepted !== null);
  }, [record.corrections]);

  const canValidate = useMemo(() => {
    return (
      record.currentStep === 'validation' &&
      allCorrectionsHandled &&
      agronomistName.trim().length > 0
    );
  }, [record.currentStep, allCorrectionsHandled, agronomistName]);

  return (
    <Card className="border-border">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileCheck size={20} className="text-primary" />
          Validation: {record.parcelName}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Step Progress */}
        <div className="flex justify-center mb-8 overflow-x-auto pb-4">
          {steps.map((step, idx) => (
            <StepIndicator
              key={step}
              step={step}
              status={record.stepStatus[step]}
              isLast={idx === steps.length - 1}
            />
          ))}
        </div>

        {/* Original Data */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3">Données importées</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(record.originalData).map(([key, value]) => (
              <div key={key} className="p-3 bg-muted/50 rounded-md">
                <p className="text-xs text-muted-foreground capitalize">{key}</p>
                <p className="font-medium text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Errors Detected */}
        {record.errors.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <AlertCircle size={16} className="text-danger" />
              Erreurs détectées ({record.errors.length})
            </h4>
            <div className="space-y-2">
              {record.errors.map((error, idx) => (
                <div 
                  key={idx}
                  className={cn(
                    'p-3 rounded-md border-l-4',
                    error.severity === 'error' 
                      ? 'bg-danger/5 border-l-danger' 
                      : 'bg-warning/5 border-l-warning'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded font-medium',
                      error.severity === 'error' 
                        ? 'bg-danger/15 text-danger' 
                        : 'bg-warning/15 text-warning'
                    )}>
                      {error.severity === 'error' ? 'Erreur' : 'Alerte'}
                    </span>
                    <span className="font-medium text-foreground capitalize">{error.field}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Valeur: <span className="font-mono">{error.value}</span> • Règle: {error.rule}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Corrections Proposed */}
        {record.corrections.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <CheckCircle size={16} className="text-success" />
              Corrections proposées ({record.corrections.length})
            </h4>
            <div className="space-y-3">
              {record.corrections.map((correction, idx) => (
                <CorrectionCard
                  key={idx}
                  correction={correction}
                  onAccept={(accept) => onAcceptCorrection(record.id, correction.field, accept)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Final Validation */}
        {record.currentStep === 'validation' && allCorrectionsHandled && (
          <div className="border-t border-border pt-6">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <User size={16} className="text-primary" />
              Validation par l'agronome
            </h4>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground block mb-1">
                  Nom de l'agronome validateur
                </label>
                <input
                  type="text"
                  value={agronomistName}
                  onChange={(e) => setAgronomistName(e.target.value)}
                  placeholder="Dr. Diallo, Spécialiste Sols"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <Button
                variant="destructive"
                onClick={() => onReject(record.id)}
              >
                <X size={16} className="mr-2" />
                Rejeter
              </Button>
              <Button
                disabled={!canValidate}
                onClick={() => onValidate(record.id, agronomistName)}
                className="bg-success hover:bg-success/90"
              >
                <Check size={16} className="mr-2" />
                Valider scientifiquement
              </Button>
            </div>
          </div>
        )}

        {/* Already Validated */}
        {record.validatedBy && record.validatedAt && (
          <div className="border-t border-border pt-6">
            <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg border border-success/30">
              <CheckCircle size={24} className="text-success" />
              <div>
                <p className="font-medium text-foreground">Données validées scientifiquement</p>
                <p className="text-sm text-muted-foreground">
                  Par {record.validatedBy} le {record.validatedAt.toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
