import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, memo, useMemo } from 'react';
import { supabase } from '../integrations/supabase/client';
import { UserRole } from '../lib/roles';
import { User } from '@supabase/supabase-js';

// Define the shape of our auth context
interface AuthContextType {
  user: User | null;
  userRoles: UserRole[];
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  userRoles: [],
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create a memoized version of the AuthProvider for better performance
export const AuthProvider = memo(function AuthProviderComponent({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  // Use useCallback for functions to prevent unnecessary re-renders
  const fetchUserRoles = useCallback(async (userId: string) => {
    try {
      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('Fetching roles for user:', userId);
      }
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('roles')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching user roles:', error);
        }
        throw error;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('User roles data:', data);
      }
      
      setUserRoles(data?.roles || ['user']);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error in fetchUserRoles:', error);
      }
      setUserRoles(['user']); // Default to user role
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRoles(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserRoles(session.user.id);
      } else {
        setUserRoles([]);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserRoles]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    userRoles,
    loading,
    signIn,
    signUp,
    signOut,
  }), [user, userRoles, loading, signIn, signUp, signOut]);

  return React.createElement(AuthContext.Provider, { value }, children);
});
