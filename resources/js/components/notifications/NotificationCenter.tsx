import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bell, Info, AlertTriangle, AlertCircle, MapPin, Check, CheckCheck, X } from 'lucide-react';
import { useState, useEffect } from 'react';
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
    className: 'text-info',
    bgClass: 'bg-info/10 border-info/30',
    label: 'Information',
  },
  warning: { 
    icon: AlertTriangle, 
    className: 'text-warning',
    bgClass: 'bg-warning/10 border-warning/30',
    label: 'Avertissement',
  },
  critical: { 
    icon: AlertCircle, 
    className: 'text-danger',
    bgClass: 'bg-danger/10 border-danger/30',
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
          ? 'bg-muted/30 border-border opacity-70' 
          : config.bgClass
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-full', notification.is_read ? 'bg-muted' : config.bgClass)}>
          <Icon size={18} className={notification.is_read ? 'text-muted-foreground' : config.className} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className={cn(
                'font-medium text-sm',
                notification.is_read ? 'text-muted-foreground' : 'text-foreground'
              )}>
                {notification.title}
              </p>
              <span className={cn(
                'text-xs px-2 py-0.5 rounded mt-1 inline-block',
                notification.is_read ? 'bg-muted text-muted-foreground' : `${config.bgClass} ${config.className}`
              )}>
                {config.label}
              </span>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDistanceToNow(new Date(notification.created_at), { 
                addSuffix: true, 
                locale: fr 
              })}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {notification.message}
          </p>
          {notification.entity_name && (
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const filteredNotifications = notifications.filter(n => 
    filter === 'all' || n.type === filter
  );

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const criticalCount = notifications.filter(n => n.type === 'critical' && !n.is_read).length;

  return (
    <Card className="w-full max-w-lg border-border shadow-lg">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell size={20} className="text-primary" />
            Centre de notifications
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
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
          <div className="mt-3 p-2 bg-danger/10 border border-danger/30 rounded-md flex items-center gap-2">
            <AlertCircle size={16} className="text-danger" />
            <span className="text-sm text-danger font-medium">
              {criticalCount} alerte{criticalCount > 1 ? 's' : ''} critique{criticalCount > 1 ? 's' : ''} non lue{criticalCount > 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mt-4">
          {(['all', 'critical', 'warning', 'info'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                filter === type 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {type === 'all' ? 'Toutes' : typeConfig[type].label}
            </button>
          ))}
          {unreadCount > 0 && (
            <Button 
              size="sm" 
              variant="ghost"
              onClick={markAllAsRead}
              className="ml-auto h-7 text-xs"
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
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Aucune notification</p>
              </div>
            ) : (
              filteredNotifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => markAsRead(notification.id)}
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
