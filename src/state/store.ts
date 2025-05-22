import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Types
interface UserProfile {
  id: string;
  role: string;
  full_name?: string;
  email?: string;
  status?: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

interface AppState {
  auth: AuthState;
  notifications: NotificationState;
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
}

// Create store
export const useStore = create<AppState>((set, get) => ({
  // Initial state
  auth: {
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  },
  notifications: {
    notifications: [],
    unreadCount: 0,
  },

  // Auth actions
  login: async (email, password) => {
    set(state => ({
      auth: {
        ...state.auth,
        isLoading: true,
        error: null
      }
    }));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Get user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      set(state => ({
        auth: {
          ...state.auth,
          user: data.user,
          profile: profileData,
          isAuthenticated: true,
          isLoading: false,
        }
      }));

      toast.success('Logged in successfully');
    } catch (error) {
      set(state => ({
        auth: {
          ...state.auth,
          error: error.message,
          isLoading: false,
        }
      }));
      toast.error(`Login failed: ${error.message}`);
    }
  },

  logout: async () => {
    set(state => ({
      auth: {
        ...state.auth,
        isLoading: true
      }
    }));

    try {
      await supabase.auth.signOut();
      
      set(state => ({
        auth: {
          ...state.auth,
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
        }
      }));

      toast.success('Logged out successfully');
    } catch (error) {
      set(state => ({
        auth: {
          ...state.auth,
          error: error.message,
          isLoading: false,
        }
      }));
      toast.error(`Logout failed: ${error.message}`);
    }
  },

  resetPassword: async (email) => {
    set(state => ({
      auth: {
        ...state.auth,
        isLoading: true,
        error: null
      }
    }));

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password-confirm`,
      });

      if (error) throw error;

      set(state => ({
        auth: {
          ...state.auth,
          isLoading: false,
        }
      }));

      toast.success('Password reset email sent');
    } catch (error) {
      set(state => ({
        auth: {
          ...state.auth,
          error: error.message,
          isLoading: false,
        }
      }));
      toast.error(`Password reset failed: ${error.message}`);
    }
  },

  updateProfile: async (profile) => {
    const { auth } = get();
    
    if (!auth.user) {
      toast.error('You must be logged in to update your profile');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', auth.user.id);

      if (error) throw error;

      // Refresh profile
      await get().refreshProfile();
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(`Profile update failed: ${error.message}`);
    }
  },

  refreshProfile: async () => {
    const { auth } = get();
    
    if (!auth.user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', auth.user.id)
        .single();

      if (error) throw error;

      set(state => ({
        auth: {
          ...state.auth,
          profile: data,
        }
      }));
    } catch (error) {
      toast.error(`Failed to refresh profile: ${error.message}`);
    }
  },

  // Notification actions
  addNotification: (notification) => {
    const newNotification = {
      ...notification,
      id: crypto.randomUUID(),
      read: false,
      createdAt: new Date(),
    };

    set(state => {
      const updatedNotifications = [
        newNotification,
        ...state.notifications.notifications,
      ].slice(0, 100); // Limit to 100 notifications

      return {
        notifications: {
          notifications: updatedNotifications,
          unreadCount: state.notifications.unreadCount + 1,
        }
      };
    });

    // Show toast for new notification
    toast[notification.type || 'info'](notification.message);
  },

  markNotificationAsRead: (id) => {
    set(state => {
      const updatedNotifications = state.notifications.notifications.map(
        notification => notification.id === id
          ? { ...notification, read: true }
          : notification
      );

      const unreadCount = updatedNotifications.filter(n => !n.read).length;

      return {
        notifications: {
          notifications: updatedNotifications,
          unreadCount,
        }
      };
    });
  },

  markAllNotificationsAsRead: () => {
    set(state => ({
      notifications: {
        notifications: state.notifications.notifications.map(
          notification => ({ ...notification, read: true })
        ),
        unreadCount: 0,
      }
    }));
  },

  clearNotifications: () => {
    set({
      notifications: {
        notifications: [],
        unreadCount: 0,
      }
    });
  },
}));

// Initialize auth state from session
export const initializeAuthState = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.user) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    useStore.setState({
      auth: {
        user: session.user,
        profile: profileData || null,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    });
  } else {
    useStore.setState({
      auth: {
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    });
  }
};
