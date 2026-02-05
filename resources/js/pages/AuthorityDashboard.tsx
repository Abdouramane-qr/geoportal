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
      <div className="px-6 py-4 border-b border-border bg-primary/5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Tableau de bord - Autorité locale
              </h1>
              <p className="text-sm text-muted-foreground">
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
      <main className="flex-1 p-6">
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
          <div className="bg-muted/30 border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Information</h3>
            <p className="text-sm text-muted-foreground">
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
