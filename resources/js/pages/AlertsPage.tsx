import { useState, useCallback } from 'react';
import { AlertTriangle } from 'lucide-react';
import { MainNav } from '@/components/layout/MainNav';
import { PredictiveAlerts } from '@/components/alerts/PredictiveAlerts';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { PredictiveAlert } from '@/types/alerts';

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
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle size={24} className="text-warning" />
              Centre d'alertes et notifications
            </h1>
            <p className="text-muted-foreground mt-1">
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
