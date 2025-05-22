import { useStore as useZustandStore } from '@/state/store';
import { useEffect } from 'react';
import { initializeAuthState } from '@/state/store';

/**
 * Hook to access the global Zustand store
 * Initializes auth state on first use
 */
export const useStore = () => {
  const store = useZustandStore();
  
  useEffect(() => {
    // Initialize auth state from session on first mount
    if (store.auth.isLoading) {
      initializeAuthState();
    }
  }, []);
  
  return store;
};

/**
 * Hook to access only auth-related state and actions
 */
export const useAuthStore = () => {
  const { auth, login, logout, resetPassword, updateProfile, refreshProfile } = useStore();
  
  return {
    ...auth,
    login,
    logout,
    resetPassword,
    updateProfile,
    refreshProfile,
  };
};

/**
 * Hook to access only notification-related state and actions
 */
export const useNotificationStore = () => {
  const { 
    notifications, 
    addNotification, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    clearNotifications 
  } = useStore();
  
  return {
    ...notifications,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
  };
};
