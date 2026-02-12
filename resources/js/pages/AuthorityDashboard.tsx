import { Building2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { AuthorityKPIs } from '@/components/authority/AuthorityKPIs';
import { ConflictList } from '@/components/authority/ConflictList';
import { DecisionsPanel } from '@/components/authority/DecisionsPanel';
import { SensitiveZones } from '@/components/authority/SensitiveZones';
import { GeographicContextSelector } from '@/components/dashboard/GeographicContextSelector';
import { MainNav } from '@/components/layout/MainNav';
import type { LandConflict, SensitiveZone, DecisionSummary } from '@/types/authority';
import type { GeographicContext} from '@/types/geographic';
import { getContextFromLocation } from '@/types/geographic';

export default function AuthorityDashboard() {
  const [geoContext, setGeoContext] = useState<GeographicContext>(
    getContextFromLocation('Thiès') || {
      level: 'region',
      name: 'Thiès',
      bounds: [[14.2, -17.2], [15.1, -16.5]],
      center: [14.79, -16.92],
      zoom: 8,
    }
  );

  const [conflicts] = useState<LandConflict[]>([]);
  const [zones] = useState<SensitiveZone[]>([]);
  const [decisions] = useState<DecisionSummary[]>([]);

  // Filter data by commune (simplified view)
  const filteredConflicts = useMemo(() => {
    if (geoContext.level === 'region') return conflicts;
    return conflicts.filter(c => c.commune === geoContext.name);
  }, [geoContext, conflicts]);

  const filteredZones = useMemo(() => {
    if (geoContext.level === 'region') return zones;
    return zones.filter(z => z.commune === geoContext.name);
  }, [geoContext, zones]);

  const filteredDecisions = useMemo(() => {
    if (geoContext.level === 'region') return decisions;
    return decisions.filter(d => d.commune === geoContext.name);
  }, [geoContext, decisions]);

  // KPI calculations
  const kpiData = useMemo(() => ({
    totalConflicts: filteredConflicts.length,
    activeConflicts: filteredConflicts.filter(c => c.status === 'actif').length,
    sensitiveZones: filteredZones.filter(z => z.sensitivity === 'critique' || z.sensitivity === 'élevée').length,
    pendingDecisions: filteredDecisions.filter(d => d.status === 'en_attente').length,
    resolvedThisMonth: filteredConflicts.filter(c => c.status === 'résolu').length,
  }), [filteredConflicts, filteredZones, filteredDecisions]);

  return (
    <div className="min-h-screen flex flex-col bg-background app-shell">
      <MainNav />
      {/* Simplified Header for Authority */}
      <div className="border-b border-[#2ECC71]/20 bg-[linear-gradient(135deg,#f8f9fa_0%,#ffffff_100%)] px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#2ECC71]/15 p-2">
              <Building2 size={24} className="text-[#27AE60]" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#27AE60]">Autorité locale</p>
              <h1 className="text-xl font-semibold text-[#212121]">
                Tableau de bord - Autorité locale
              </h1>
              <p className="text-sm text-[#616161]">
                Vue simplifiée des décisions et conflits fonciers
              </p>
            </div>
          </div>
          <GeographicContextSelector
            currentContext={geoContext}
            onContextChange={setGeoContext}
            allowedLevel="commune"
            canChangeContext={true}
          />
        </div>
      </div>
      <main className="flex-1 bg-[linear-gradient(180deg,#f8f9fa_0%,#ffffff_45%,#f8f9fa_100%)] p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* KPIs - Simplified metrics */}
          <AuthorityKPIs {...kpiData} />

          {/* Main Content - Two columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conflicts - Primary focus */}
            <ConflictList 
              conflicts={filteredConflicts}
              onSelectConflict={(conflict) => {
                console.log('Selected conflict:', conflict.id);
              }}
            />

            {/* Sensitive Zones */}
            <SensitiveZones 
              zones={filteredZones}
              onSelectZone={(zone) => {
                console.log('Selected zone:', zone.id);
              }}
            />
          </div>

          {/* Decisions - Bottom full width */}
          <DecisionsPanel 
            decisions={filteredDecisions}
            onSelectDecision={(decision) => {
              console.log('Selected decision:', decision.id);
            }}
          />

          {/* Help/Context */}
          <div className="rounded-xl border border-[#2ECC71]/25 bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-medium text-[#212121]">Information</h3>
            <p className="text-sm text-[#616161]">
              Cette interface présente une vue simplifiée des données foncières de votre juridiction. 
              Les détails techniques (analyses pédologiques, hydrologiques) sont masqués pour faciliter 
              la prise de décision. Pour accéder aux données scientifiques complètes, utilisez l'interface expert.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
