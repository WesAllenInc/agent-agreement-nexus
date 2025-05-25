import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';

export const NotificationCenter: React.FC = () => {
  const { notifications, markAllAsRead } = useNotifications();
  return (
    <div className="w-80 max-w-full bg-popover border rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-lg">Notifications</span>
        <button
          className="text-xs text-primary underline"
          onClick={markAllAsRead}
        >
          Mark all as read
        </button>
      </div>
      <ul className="space-y-2 max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <li className="text-muted-foreground text-center py-8">No notifications</li>
        ) : (
          notifications.map((n) => (
            <li
              key={n.id}
              className={`rounded px-2 py-1 ${n.read ? 'bg-muted' : 'bg-primary/10'}`}
            >
              <div className="text-sm">{n.message}</div>
              <div className="text-xs text-muted-foreground">{n.timestamp}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default NotificationCenter;
