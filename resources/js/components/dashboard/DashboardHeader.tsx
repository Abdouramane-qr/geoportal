import { Map, Building2 } from 'lucide-react';

export function DashboardHeader() {
  return (
    <header className="bg-sidebar text-sidebar-foreground border-b border-sidebar-border">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sidebar-accent rounded-md">
            <Map size={20} className="text-sidebar-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">SIG Agricole</h1>
            <p className="text-xs text-sidebar-foreground/70">
              Système d'Information Géographique - Évaluation des Terres
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-sidebar-foreground/70">
            <Building2 size={16} />
            <span>Ministère de l'Agriculture</span>
          </div>
        </div>
      </div>
    </header>
  );
}
