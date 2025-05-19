import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Agreement } from '../types/agreement';
import { useAuth } from './useAuth';

export type NotificationType = 'agreement_status_change';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: any;
}

export function useNotifications() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;

    // Subscribe to agreement changes where the user is the owner
    const subscription = supabase
      .channel('agreement-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for inserts and updates
          schema: 'public',
          table: 'agreements',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // Handle the payload based on the event type
          if (payload.eventType === 'INSERT') {
            const newAgreement = payload.new as Agreement;
            const notification: Notification = {
              id: `agreement-${newAgreement.id}-${Date.now()}`,
              type: 'agreement_status_change',
              title: 'New Agreement',
              message: `Your agreement "${newAgreement.file_name}" has been created with status "${newAgreement.status}".`,
              read: false,
              createdAt: new Date(),
              data: newAgreement,
            };
            
            setNotifications(prev => [notification, ...prev]);
            
            toast({
              title: notification.title,
              description: notification.message,
            });
          } else if (payload.eventType === 'UPDATE') {
            const oldAgreement = payload.old as Agreement;
            const updatedAgreement = payload.new as Agreement;
            
            // Only show notification if the status has changed
            if (oldAgreement.status !== updatedAgreement.status) {
              const notification: Notification = {
                id: `agreement-${updatedAgreement.id}-${Date.now()}`,
                type: 'agreement_status_change',
                title: 'Agreement Status Changed',
                message: `Your agreement "${updatedAgreement.file_name}" is now "${updatedAgreement.status}".`,
                read: false,
                createdAt: new Date(),
                data: updatedAgreement,
              };
              
              setNotifications(prev => [notification, ...prev]);
              
              toast({
                title: notification.title,
                description: notification.message,
              });
            }
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user, toast]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    markAsRead,
    clearNotifications,
    unreadCount: notifications.filter(n => !n.read).length,
  };
}
