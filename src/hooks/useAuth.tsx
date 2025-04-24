
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle different auth events
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            // Defer profile fetch to avoid auth deadlock
            setTimeout(() => {
              fetchProfile(session.user.id);
            }, 0);
          }
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
        console.log("Profile fetched:", data);
      } else {
        console.log("No profile found for user:", userId);
        // If no profile exists yet (possible for new social logins), create one
        await createProfileIfNotExists(userId);
      }
    } catch (err) {
      console.error("Error in fetchProfile:", err);
    }
  };

  const createProfileIfNotExists = async (userId: string) => {
    try {
      // Get user metadata to use for profile
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user) return;
      
      const userMeta = userData.user.user_metadata;
      const email = userData.user.email || '';
      
      // Extract name information from user metadata (structure varies by provider)
      let firstName = userMeta?.first_name || userMeta?.given_name || '';
      let lastName = userMeta?.last_name || userMeta?.family_name || '';
      
      // For some providers like Google, the name might be in a "name" field
      if ((!firstName || !lastName) && userMeta?.name) {
        const nameParts = userMeta.name.split(' ');
        if (nameParts.length > 0) {
          firstName = firstName || nameParts[0];
          if (nameParts.length > 1) {
            lastName = lastName || nameParts[nameParts.length - 1];
          }
        }
      }
      
      // For some providers, names might be in full_name
      if ((!firstName || !lastName) && userMeta?.full_name) {
        const nameParts = userMeta.full_name.split(' ');
        if (nameParts.length > 0) {
          firstName = firstName || nameParts[0];
          if (nameParts.length > 1) {
            lastName = lastName || nameParts[nameParts.length - 1];
          }
        }
      }
      
      console.log("Creating profile with data:", {
        userId,
        firstName,
        lastName,
        email
      });
      
      // Create the profile
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          first_name: firstName,
          last_name: lastName,
          email: email,
        });

      if (error) {
        console.error('Error creating profile:', error);
        return;
      }

      // Refetch the profile
      fetchProfile(userId);
    } catch (err) {
      console.error("Error in createProfileIfNotExists:", err);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const role = session?.user?.role;
      if (role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/agent/agreement');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const isAdmin = session?.user?.role === 'admin';

  return (
    <AuthContext.Provider 
      value={{ 
        session, 
        user, 
        profile, 
        isAdmin, 
        signIn, 
        signOut,
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
