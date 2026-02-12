import { AlertTriangle } from 'lucide-react';
import { useState, useCallback } from 'react';
import { PredictiveAlerts } from '@/components/alerts/PredictiveAlerts';
import { MainNav } from '@/components/layout/MainNav';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import type { PredictiveAlert } from '@/types/alerts';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<PredictiveAlert[]>([]);

  const handleAcknowledge = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, acknowledged: true } : a
    ));
  }, []);

  const handleNavigateToParcel = useCallback((parcelId: string) => {
    // In a real app, this would navigate to the map and select the parcel
    console.log('Navigate to parcel:', parcelId);
    window.location.href = `/?parcel=${parcelId}`;
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background app-shell">
      <MainNav />
      <main className="flex-1 bg-[linear-gradient(180deg,#f8f9fa_0%,#ffffff_45%,#f8f9fa_100%)] p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 rounded-xl border border-[#2ECC71]/20 bg-white p-4 shadow-[0_10px_30px_rgba(33,33,33,0.06)]">
            <h1 className="flex items-center gap-2 text-2xl font-semibold text-[#212121]">
              <AlertTriangle size={24} className="text-[#D68910]" />
              Centre d'alertes et notifications
            </h1>
            <p className="mt-1 text-[#616161]">
              Surveillance prédictive des risques agricoles et notifications système
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Predictive Alerts */}
            <PredictiveAlerts
              alerts={alerts}
              onAcknowledge={handleAcknowledge}
              onNavigateToParcel={handleNavigateToParcel}
            />

            {/* Notification Center */}
            <NotificationCenter
              onNavigateToParcel={handleNavigateToParcel}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
