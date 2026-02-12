import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bell, Info, AlertTriangle, AlertCircle, MapPin, Check, CheckCheck, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type NotificationType = 'info' | 'warning' | 'critical';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  entity_type: string;
  entity_id: string;
  entity_name: string | null;
  is_read: boolean;
  created_at: string;
}

interface NotificationCenterProps {
  onNavigateToParcel?: (parcelId: string) => void;
  onClose?: () => void;
}

const typeConfig: Record<NotificationType, { 
  icon: typeof Info; 
  className: string;
  bgClass: string;
  label: string;
}> = {
  info: { 
    icon: Info, 
    className: 'text-[#27AE60]',
    bgClass: 'bg-[#2ECC71]/10 border-[#2ECC71]/30',
    label: 'Information',
  },
  warning: { 
    icon: AlertTriangle, 
    className: 'text-[#D68910]',
    bgClass: 'bg-[#D68910]/10 border-[#D68910]/30',
    label: 'Avertissement',
  },
  critical: { 
    icon: AlertCircle, 
    className: 'text-[#D68910]',
    bgClass: 'bg-[#D68910]/12 border-[#D68910]/35',
    label: 'Critique',
  },
};

function NotificationItem({ 
  notification, 
  onMarkAsRead,
  onNavigate,
}: { 
  notification: Notification; 
  onMarkAsRead: () => void;
  onNavigate?: () => void;
}) {
  const config = typeConfig[notification.type as NotificationType] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div 
      className={cn(
        'p-4 border rounded-lg transition-all',
        notification.is_read 
          ? 'bg-[#f8f9fa] border-[#2ECC71]/20 opacity-70' 
          : config.bgClass
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-full', notification.is_read ? 'bg-[#616161]/15' : config.bgClass)}>
          <Icon size={18} className={notification.is_read ? 'text-[#616161]' : config.className} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className={cn(
                'font-medium text-sm',
                notification.is_read ? 'text-[#616161]' : 'text-[#212121]'
              )}>
                {notification.title}
              </p>
              <span className={cn(
                'text-xs px-2 py-0.5 rounded mt-1 inline-block',
                notification.is_read ? 'bg-[#616161]/10 text-[#616161]' : `${config.bgClass} ${config.className}`
              )}>
                {config.label}
              </span>
            </div>
            <span className="text-xs text-[#616161] whitespace-nowrap">
              {formatDistanceToNow(new Date(notification.created_at), { 
                addSuffix: true, 
                locale: fr 
              })}
            </span>
          </div>
          <p className="text-sm text-[#616161] mt-2 line-clamp-2">
            {notification.message}
          </p>
          {notification.entity_name && (
            <div className="flex items-center gap-1 mt-2 text-xs text-[#616161]">
              <MapPin size={12} />
              <span>{notification.entity_type}: {notification.entity_name}</span>
            </div>
          )}
          <div className="flex items-center gap-2 mt-3">
            {!notification.is_read && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={onMarkAsRead}
                className="h-7 text-xs"
              >
                <Check size={12} className="mr-1" />
                Marquer lu
              </Button>
            )}
            {notification.entity_id && onNavigate && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onNavigate}
                className="h-7 text-xs"
              >
                <MapPin size={12} className="mr-1" />
                Voir sur la carte
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function NotificationCenter({ onNavigateToParcel, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | NotificationType>('all');
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

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
        if (active) {
          toast.error('Impossible de charger les notifications.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void fetchNotifications();

    return () => {
      active = false;
    };
  }, []);

  const markAsRead = async (id: string) => {
    const previous = notifications;
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
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
  };

  const markAllAsRead = async () => {
    const previous = notifications;
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));

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
  };

  const filteredNotifications = notifications.filter(n => 
    filter === 'all' || n.type === filter
  );

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const criticalCount = notifications.filter(n => n.type === 'critical' && !n.is_read).length;

  return (
    <Card className="w-full max-w-lg border-border shadow-lg">
      <CardHeader className="border-b border-[#2ECC71]/15 bg-white pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell size={20} className="text-[#27AE60]" />
            Centre de notifications
            {unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-[#27AE60] px-2 py-0.5 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </CardTitle>
          {onClose && (
            <Button size="sm" variant="ghost" onClick={onClose} className="h-8 w-8 p-0">
              <X size={16} />
            </Button>
          )}
        </div>
        
        {/* Critical Alert Banner */}
        {criticalCount > 0 && (
          <div className="mt-3 flex items-center gap-2 rounded-md border border-[#D68910]/35 bg-[#D68910]/12 p-2">
            <AlertCircle size={16} className="text-[#D68910]" />
            <span className="text-sm font-medium text-[#D68910]">
              {criticalCount} alerte{criticalCount > 1 ? 's' : ''} critique{criticalCount > 1 ? 's' : ''} non lue{criticalCount > 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {(['all', 'critical', 'warning', 'info'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                filter === type 
                  ? 'bg-[#27AE60] text-white' 
                  : 'bg-[#f8f9fa] text-[#616161] hover:bg-[#2ECC71]/10'
              )}
            >
              {type === 'all' ? 'Toutes' : typeConfig[type].label}
            </button>
          ))}
          {unreadCount > 0 && (
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => {
                void markAllAsRead();
              }}
              className="h-7 text-xs text-[#27AE60] hover:bg-[#2ECC71]/10 sm:ml-auto"
            >
              <CheckCheck size={14} className="mr-1" />
              Tout marquer lu
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="p-4 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#27AE60] border-t-transparent" />
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="py-8 text-center text-[#616161]">
                <Bell size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Aucune notification</p>
              </div>
            ) : (
              filteredNotifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => {
                    void markAsRead(notification.id);
                  }}
                  onNavigate={
                    notification.entity_type === 'parcel' && onNavigateToParcel
                      ? () => onNavigateToParcel(notification.entity_id)
                      : undefined
                  }
                />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
