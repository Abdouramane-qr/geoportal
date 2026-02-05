import { ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Bell, FileCheck, LayoutDashboard, Map, Settings, AlertTriangle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Carte', href: '/carte', icon: Map },
  { label: 'Validation', href: '/validation', icon: FileCheck },
  { label: 'Alertes', href: '/alertes', icon: AlertTriangle },
  { label: 'Paramètres', href: '/settings/profile', icon: Settings },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { url } = usePage();
  const currentPath = url.split('?')[0];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sidebar-accent text-sidebar-primary font-semibold">
              LS
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-sidebar-foreground">LandSense Hub</p>
              <p className="text-xs text-sidebar-foreground/70">SIG institutionnel</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = currentPath === item.href || currentPath.startsWith(`${item.href}/`);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild data-active={active}>
                        <Link href={item.href} className={cn(active && 'text-sidebar-accent-foreground')}>
                          <Icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 items-center gap-3 border-b border-border bg-card px-4">
          <SidebarTrigger />
          <div className="flex flex-1 items-center gap-3">
            <Input placeholder="Rechercher une commune..." className="max-w-md" />
          </div>
          <button
            type="button"
            className="relative rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-danger" />
          </button>
          <Avatar className="h-8 w-8">
            <AvatarFallback>LS</AvatarFallback>
          </Avatar>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
