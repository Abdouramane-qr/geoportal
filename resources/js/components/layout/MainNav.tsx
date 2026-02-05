import { Link, usePage } from '@inertiajs/react';
import { Map, Upload, Scale, Users, Menu, X, Shield, FileCheck, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { NotificationBell } from '@/components/notifications/NotificationBell';

const navItems = [
  { path: '/carte', label: 'Carte SIG', icon: Map },
  { path: '/import', label: 'Import', icon: Upload },
  { path: '/validation', label: 'Validation', icon: FileCheck },
  { path: '/alertes', label: 'Alertes', icon: AlertTriangle },
  { path: '/autorites', label: 'Autorités', icon: Scale },
  { path: '/utilisateurs', label: 'Utilisateurs', icon: Users },
  { path: '/journal-audit', label: 'Audit', icon: Shield },
];

export function MainNav() {
  const { url } = usePage();
  const currentPath = url.split('?')[0];
  const isActive = (path: string) =>
    currentPath === path || (path !== '/' && currentPath.startsWith(`${path}/`));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-sidebar text-sidebar-foreground border-b border-sidebar-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 lg:px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sidebar-accent rounded-md">
            <Map size={20} className="text-sidebar-primary" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold">SIG Agricole</h1>
            <p className="text-xs text-sidebar-foreground/70">
              Système d'Information Géographique
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              href={path}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive(path)
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              )}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Notification Bell */}
        <div className="hidden md:flex items-center">
          <NotificationBell />
        </div>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center gap-2">
          <NotificationBell />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-sidebar-accent rounded-md"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-sidebar-border px-4 py-3">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              href={path}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive(path)
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground'
              )}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
