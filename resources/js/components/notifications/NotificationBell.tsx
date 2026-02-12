import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bell, AlertTriangle, Info, AlertCircle, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  entity_type: string;
  entity_id: string;
  entity_name: string | null;
  is_read: boolean;
  created_at: string;
}

const typeConfig: Record<string, {
  icon: typeof Info;
  className: string;
  label: string;
}> = {
  info: {
    icon: Info,
    className: 'text-[#27AE60] bg-[#2ECC71]/12 border-[#2ECC71]/30',
    label: 'Information',
  },
  warning: {
    icon: AlertTriangle,
    className: 'text-[#D68910] bg-[#D68910]/12 border-[#D68910]/30',
    label: 'Avertissement',
  },
  critical: {
    icon: AlertCircle,
    className: 'text-[#D68910] bg-[#D68910]/15 border-[#D68910]/35',
    label: 'Critique',
  },
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    let active = true;

    async function fetchNotifications() {
      try {
        const response = await fetch('/api/notifications', {
          headers: { Accept: 'application/json' },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch notifications: ${response.status}`);
        }

        const payload = (await response.json()) as { data: Notification[] };
        if (active) {
          setNotifications(Array.isArray(payload.data) ? payload.data : []);
        }
      } catch (error) {
        console.error(error);
      }
    }

    void fetchNotifications();

    return () => {
      active = false;
    };
  }, []);

  async function markAsRead(id: string) {
    const previous = notifications;
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );

    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`Failed to mark notification as read: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
      setNotifications(previous);
      toast.error('Impossible de marquer la notification comme lue.');
    }
  }

  async function markAllAsRead() {
    const previous = notifications;
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`Failed to mark all notifications as read: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
      setNotifications(previous);
      toast.error('Impossible de marquer toutes les notifications comme lues.');
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-sidebar-foreground hover:bg-sidebar-accent/60"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#D68910] text-xs font-medium text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(24rem,calc(100vw-1rem))] p-0" align="end">
        <div className="flex items-center justify-between border-b border-[#2ECC71]/15 bg-[linear-gradient(135deg,#f8f9fa_0%,#ffffff_100%)] p-4">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-[#27AE60]" />
            <h3 className="font-semibold text-[#212121]">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-[#2ECC71]/15 text-xs text-[#27AE60]">
                {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  void markAllAsRead();
                }}
                className="text-xs text-[#27AE60] hover:bg-[#2ECC71]/10"
              >
                <Check size={14} className="mr-1" />
                Tout lu
              </Button>
            )}
            <Button variant="ghost" size="sm" asChild className="text-xs text-[#616161] hover:bg-[#2ECC71]/10">
              <Link href="/alertes" onClick={() => setIsOpen(false)}>
                Voir tout
              </Link>
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[420px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-[#616161]">
              <Bell size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucune notification</p>
            </div>
          ) : (
            <div className="divide-y divide-[#2ECC71]/10">
              {notifications.map((notification) => {
                const config = typeConfig[notification.type];
                const Icon = config.icon;

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      'p-4 hover:bg-muted/50 cursor-pointer transition-colors',
                      !notification.is_read ? 'bg-[#2ECC71]/8 hover:bg-[#2ECC71]/12' : 'hover:bg-[#f8f9fa]'
                    )}
                    onClick={() => {
                      void markAsRead(notification.id);
                    }}
                  >
                    <div className="flex gap-3">
                      <div
                        className={cn(
                          'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border',
                          config.className
                        )}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={cn(
                              'text-sm font-medium',
                              !notification.is_read ? 'text-[#212121]' : 'text-[#616161]'
                            )}
                          >
                            {notification.title}
                          </p>
                          {!notification.is_read && (
                            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#27AE60]" />
                          )}
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-xs text-[#616161]">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="outline"
                            className={cn('text-xs border', config.className)}
                          >
                            {config.label}
                          </Badge>
                          {notification.entity_name && (
                            <span className="text-xs text-[#616161]">
                              {notification.entity_name}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-[#616161]">
                          {format(
                            new Date(notification.created_at),
                            "d MMM yyyy 'à' HH:mm",
                            { locale: fr }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
