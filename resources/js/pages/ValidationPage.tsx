import { useState, useCallback, useEffect } from 'react';
import { FileCheck, AlertTriangle, List, LayoutPanelLeft } from 'lucide-react';
import { MainNav } from '@/components/layout/MainNav';
import { ValidationMapView } from '@/components/validation/ValidationMapView';
import { CorrectionForm } from '@/components/validation/CorrectionForm';
import { Button } from '@/components/ui/button';
import { ValidationRecord } from '@/types/validation';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

type RecordStatusTone = 'success' | 'warning' | 'danger';

const STATUS_TONE_CLASSES: Record<RecordStatusTone, string> = {
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/15 text-danger',
};

function getRecordStatus(record: ValidationRecord): { label: string; tone: RecordStatusTone } {
  if (record.validatedBy) {
    return { label: 'Validé', tone: 'success' };
  }

  if (record.stepStatus.validation === 'error') {
    return { label: 'Rejeté', tone: 'danger' };
  }

  return { label: 'À vérifier', tone: 'warning' };
}

export default function ValidationPage() {
  const [records, setRecords] = useState<ValidationRecord[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'split'>('split');
  const [mobilePane, setMobilePane] = useState<'map' | 'form'>('map');
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) {
      setMobilePane('map');
    }
  }, [isMobile]);

  const selectedRecord = records.find(r => r.id === selectedRecordId);

  const handleAcceptCorrection = useCallback((recordId: string, field: string, accept: boolean) => {
    setRecords(prev => prev.map(r => {
      if (r.id !== recordId) return r;
      
      const updatedCorrections = r.corrections.map(c => 
        c.field === field ? { ...c, accepted: accept } : c
      );
      
      const allHandled = updatedCorrections.every(c => c.accepted !== null);
      
      return {
        ...r,
        corrections: updatedCorrections,
        currentStep: allHandled ? 'validation' : r.currentStep,
        stepStatus: allHandled 
          ? { ...r.stepStatus, correction: 'completed', validation: 'active' }
          : r.stepStatus,
      };
    }));
  }, []);

  const handleValidate = useCallback((recordId: string, agronomist: string) => {
    setRecords(prev => prev.map(r => {
      if (r.id !== recordId) return r;
      return {
        ...r,
        currentStep: 'validation',
        stepStatus: { ...r.stepStatus, validation: 'completed' },
        validatedBy: agronomist,
        validatedAt: new Date(),
      };
    }));
  }, []);

  const handleReject = useCallback((recordId: string) => {
    setRecords(prev => prev.map(r => {
      if (r.id !== recordId) return r;
      return {
        ...r,
        currentStep: 'validation',
        stepStatus: { ...r.stepStatus, validation: 'error' },
      };
    }));
  }, []);

  // Filter records to show "À vérifier" (not validated)
  const pendingRecords = records.filter(r => !r.validatedBy && r.stepStatus.validation !== 'error');
  const allRecordsCount = records.length;
  const pendingCount = pendingRecords.length;
  const errorCount = records.filter(r => r.errors.length > 0 && !r.validatedBy).length;

  const selectedRecordStatus = selectedRecord ? getRecordStatus(selectedRecord) : null;

  const mapPanel = selectedRecord ? (
    <div className="h-full rounded-2xl border border-border bg-card shadow-sm overflow-hidden min-h-[320px]">
      <ValidationMapView record={selectedRecord} />
    </div>
  ) : null;

  const formPanel = selectedRecord ? (
    <div className="h-full rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <CorrectionForm
        record={selectedRecord}
        onAcceptCorrection={handleAcceptCorrection}
        onValidate={handleValidate}
        onReject={handleReject}
      />
    </div>
  ) : null;

  useEffect(() => {
    if (isMobile && viewMode === 'split') {
      setViewMode('list');
    }
  }, [isMobile, viewMode]);

  return (
    <div className="min-h-screen flex flex-col bg-background app-shell">
      <MainNav />
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <FileCheck size={24} className="text-primary" />
                Validation scientifique des données
              </h1>
              <p className="text-muted-foreground mt-1">
                Workflow de validation des données agricoles avec détection d'erreurs
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List size={16} className="mr-1" />
                Liste
              </Button>
              <Button
                variant={viewMode === 'split' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('split')}
              >
                <LayoutPanelLeft size={16} className="mr-1" />
                Split
              </Button>
            </div>
          </div>

          {isMobile && selectedRecord && (
            <div className="px-6 pb-4 border-b border-border bg-muted/30 flex gap-2">
              <Button
                variant={mobilePane === 'map' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setMobilePane('map')}
              >
                Carte
              </Button>
              <Button
                variant={mobilePane === 'form' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setMobilePane('form')}
              >
                Formulaire
              </Button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div className="bg-card border border-border rounded-lg p-3">
              <div className="text-xs text-muted-foreground">Sessions totales</div>
              <div className="text-xl font-semibold text-foreground">{allRecordsCount}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-3 border-l-4 border-l-warning">
              <div className="text-xs text-muted-foreground">À vérifier</div>
              <div className="text-xl font-semibold text-warning">{pendingCount}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-3 border-l-4 border-l-danger">
              <div className="text-xs text-muted-foreground">Avec erreurs</div>
              <div className="text-xl font-semibold text-danger">{errorCount}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Record List Sidebar */}
          <aside className="w-full md:w-72 flex flex-col border-b md:border-b-0 md:border-r border-border bg-card">
            <div className="p-3 border-b border-border bg-muted/50">
              <h3 className="font-medium text-sm text-foreground">Imports récents</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {pendingCount} session(s) à vérifier
              </p>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-border">
              {records.map(record => {
                const status = getRecordStatus(record);
                return (
                  <button
                    key={record.id}
                    onClick={() => setSelectedRecordId(record.id)}
                    className={cn(
                      'w-full p-3 text-left transition-colors',
                      selectedRecordId === record.id 
                        ? 'bg-primary/10' 
                        : 'hover:bg-muted/50'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm text-foreground truncate">
                          {record.parcelName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          ID: {record.parcelId}
                        </p>
                      </div>
                      {record.errors.length > 0 && !record.validatedBy && (
                        <AlertTriangle size={14} className="text-warning mt-0.5 shrink-0 ml-2" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded font-semibold capitalize',
                        STATUS_TONE_CLASSES[status.tone]
                      )}>
                        {status.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="flex-1 overflow-hidden">
            {selectedRecord ? (
              isMobile ? (
                <div className="h-full flex flex-col">
                  <div className="px-6 pt-4">
                    <p className="text-sm font-semibold text-foreground">{selectedRecord.parcelName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground mr-2">ID {selectedRecord.parcelId}</p>
                      {selectedRecordStatus && (
                        <span className={cn(
                          'text-[11px] px-2 py-0.5 rounded-full font-semibold',
                          STATUS_TONE_CLASSES[selectedRecordStatus.tone]
                        )}>
                          {selectedRecordStatus.label}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
                    {mobilePane === 'map' ? mapPanel : formPanel}
                  </div>
                </div>
              ) : viewMode === 'split' ? (
                <ResizablePanelGroup direction="horizontal" className="h-full">
                  <ResizablePanel defaultSize={50} minSize={30}>
                    {mapPanel}
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={50} minSize={30}>
                    {formPanel}
                  </ResizablePanel>
                </ResizablePanelGroup>
              ) : (
                <div className="h-full overflow-y-auto p-6">
                  {formPanel}
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Sélectionnez une session pour voir les détails
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
