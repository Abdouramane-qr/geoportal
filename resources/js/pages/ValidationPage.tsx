import { FileCheck, AlertTriangle, List, LayoutPanelLeft } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { MainNav } from '@/components/layout/MainNav';
import { Button } from '@/components/ui/button';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { CorrectionForm } from '@/components/validation/CorrectionForm';
import { ValidationMapView } from '@/components/validation/ValidationMapView';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import type { ValidationRecord } from '@/types/validation';

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
      if (mobilePane !== 'map') { // Only update if it's different
        setTimeout(() => {
          setMobilePane('map');
        }, 0);
      }
    }
  }, [isMobile, mobilePane]); // Added mobilePane to dependencies

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
      setTimeout(() => {
        setViewMode('list');
      }, 0);
    }
  }, [isMobile, viewMode]);

  return (
    <div className="min-h-screen flex flex-col bg-background app-shell">
      <MainNav />
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-[#2ECC71]/15 bg-[linear-gradient(135deg,#f8f9fa_0%,#ffffff_100%)] px-6 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-semibold text-[#212121]">
                <FileCheck size={24} className="text-[#27AE60]" />
                Validation scientifique des données
              </h1>
              <p className="mt-1 text-[#616161]">
                Workflow de validation des données agricoles avec détection d'erreurs
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                className={viewMode === 'list' ? 'bg-[#27AE60] text-white hover:bg-[#27AE60]/90' : 'border-[#27AE60]/40 text-[#27AE60] hover:bg-[#27AE60]/10'}
                onClick={() => setViewMode('list')}
              >
                <List size={16} className="mr-1" />
                Liste
              </Button>
              <Button
                variant={viewMode === 'split' ? 'default' : 'outline'}
                size="sm"
                className={viewMode === 'split' ? 'bg-[#27AE60] text-white hover:bg-[#27AE60]/90' : 'border-[#27AE60]/40 text-[#27AE60] hover:bg-[#27AE60]/10'}
                onClick={() => setViewMode('split')}
              >
                <LayoutPanelLeft size={16} className="mr-1" />
                Split
              </Button>
            </div>
          </div>

          {isMobile && selectedRecord && (
            <div className="flex gap-2 border-b border-[#2ECC71]/15 bg-white px-6 pb-4">
              <Button
                variant={mobilePane === 'map' ? 'default' : 'outline'}
                size="sm"
                className={`flex-1 ${mobilePane === 'map' ? 'bg-[#27AE60] text-white hover:bg-[#27AE60]/90' : 'border-[#27AE60]/40 text-[#27AE60] hover:bg-[#27AE60]/10'}`}
                onClick={() => setMobilePane('map')}
              >
                Carte
              </Button>
              <Button
                variant={mobilePane === 'form' ? 'default' : 'outline'}
                size="sm"
                className={`flex-1 ${mobilePane === 'form' ? 'bg-[#27AE60] text-white hover:bg-[#27AE60]/90' : 'border-[#27AE60]/40 text-[#27AE60] hover:bg-[#27AE60]/10'}`}
                onClick={() => setMobilePane('form')}
              >
                Formulaire
              </Button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div className="rounded-lg border border-[#2ECC71]/20 bg-white p-3 shadow-sm">
              <div className="text-xs text-[#616161]">Sessions totales</div>
              <div className="text-xl font-semibold text-[#212121]">{allRecordsCount}</div>
            </div>
            <div className="rounded-lg border border-[#D68910]/25 bg-[#D68910]/10 p-3">
              <div className="text-xs text-[#616161]">À vérifier</div>
              <div className="text-xl font-semibold text-[#D68910]">{pendingCount}</div>
            </div>
            <div className="rounded-lg border border-[#D68910]/30 bg-[#fff7ec] p-3">
              <div className="text-xs text-[#616161]">Avec erreurs</div>
              <div className="text-xl font-semibold text-[#D68910]">{errorCount}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Record List Sidebar */}
          <aside className="flex w-full flex-col border-b border-[#2ECC71]/15 bg-white md:w-72 md:border-b-0 md:border-r">
            <div className="border-b border-[#2ECC71]/15 bg-[linear-gradient(135deg,#f8f9fa_0%,#ffffff_100%)] p-3">
              <h3 className="text-sm font-medium text-[#212121]">Imports récents</h3>
              <p className="mt-0.5 text-xs text-[#616161]">
                {pendingCount} session(s) à vérifier
              </p>
            </div>
            <div className="flex-1 divide-y divide-[#2ECC71]/10 overflow-y-auto">
              {records.map(record => {
                const status = getRecordStatus(record);
                return (
                  <button
                    key={record.id}
                    onClick={() => setSelectedRecordId(record.id)}
                    className={cn(
                      'w-full p-3 text-left transition-colors',
                      selectedRecordId === record.id 
                        ? 'bg-[#2ECC71]/10' 
                        : 'hover:bg-[#2ECC71]/5'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[#212121]">
                          {record.parcelName}
                        </p>
                        <p className="mt-0.5 text-xs text-[#616161]">
                          ID: {record.parcelId}
                        </p>
                      </div>
                      {record.errors.length > 0 && !record.validatedBy && (
                        <AlertTriangle size={14} className="ml-2 mt-0.5 shrink-0 text-[#D68910]" />
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
                      <p className="mr-2 text-xs text-[#616161]">ID {selectedRecord.parcelId}</p>
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
