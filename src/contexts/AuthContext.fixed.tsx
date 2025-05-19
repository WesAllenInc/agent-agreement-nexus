import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { UserRole, isAdmin as checkIsAdmin, isAgent as checkIsAgent, isSeniorAgent as checkIsSeniorAgent } from '@/lib/roles';

interface AuthContextType {
  user: User | null;
  userRoles: UserRole[];
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isAgent: boolean;
  isSeniorAgent: boolean;
  isApproved: boolean;
  userStatus: 'pending' | 'approved' | 'rejected' | 'review' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAgent, setIsAgent] = useState(false);
  const [isSeniorAgent, setIsSeniorAgent] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [userStatus, setUserStatus] = useState<'pending' | 'approved' | 'rejected' | 'review' | null>(null);
  const navigate = useNavigate();

  // Use useCallback for functions to prevent unnecessary re-renders
  const fetchUserData = useCallback(async (userId: string) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Fetching data for user:', userId);
      }
      
      // Fetch user roles from user_roles table
      const { data: userRolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('roles')
        .eq('user_id', userId)
        .single();

      if (rolesError && rolesError.code !== 'PGRST116') {
        console.error('Error fetching user roles:', rolesError);
      }

      const roles = userRolesData?.roles || ['user'];
      setUserRoles(roles);
      
      // Set role states based on the roles array
      setIsAdmin(checkIsAdmin(roles));
      setIsAgent(checkIsAgent(roles));
      setIsSeniorAgent(checkIsSeniorAgent(roles));
      
      // Fetch user status from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching user profile:', profileError);
      }

      // Set approval status
      const status = profile?.status || null;
      setUserStatus(status);
      setIsApproved(status === 'approved' || checkIsAdmin(roles));
      
      // Redirect unapproved users to a pending approval page if they're not admins
      if (status !== 'approved' && !checkIsAdmin(roles) && window.location.pathname !== '/pending-approval') {
        navigate('/pending-approval');
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error);
      setUserRoles(['user']); // Default to user role
    } finally {
      setLoading(false);
    }
  }, [navigate]);

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
    navigate('/auth');
  }, [navigate]);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for changes on auth state (signed in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserData(session.user.id);
      } else {
        // Reset states when user is logged out
        setUserRoles([]);
        setIsAdmin(false);
        setIsAgent(false);
        setIsSeniorAgent(false);
        setIsApproved(false);
        setUserStatus(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserData]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    userRoles,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isAgent,
    isSeniorAgent,
    isApproved,
    userStatus,
  }), [user, userRoles, loading, signIn, signUp, signOut, isAdmin, isAgent, isSeniorAgent, isApproved, userStatus]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
