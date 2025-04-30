
import { useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { toast } from 'sonner';

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
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
        await createProfileIfNotExists(userId);
      }
    } catch (err) {
      console.error("Error in fetchProfile:", err);
    }
  }, []);

  const createProfileIfNotExists = async (userId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user) {
        console.error("No user data available");
        return;
      }
      
      const userMeta = userData.user.user_metadata || {};
      const email = userData.user.email || '';
      
      console.log("User metadata for profile creation:", userMeta);
      
      const firstName = userMeta.first_name || 
                       userMeta.given_name || 
                       userMeta.name?.split(' ')?.[0] || 
                       '';
                       
      const lastName = userMeta.last_name || 
                      userMeta.family_name || 
                      (userMeta.name?.split(' ')?.length > 1 
                       ? userMeta.name.split(' ').slice(1).join(' ') 
                       : '');
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          first_name: firstName,
          last_name: lastName,
          email: email,
        })
        .select();

      if (error) {
        console.error('Error creating profile:', error);
        toast.error(`Failed to create profile: ${error.message}`);
        return;
      }

      if (data?.[0]) {
        console.log("Profile created successfully:", data[0]);
        setProfile(data[0]);
      }
    } catch (err) {
      console.error("Error in createProfileIfNotExists:", err);
      toast.error(`Unexpected error creating profile: ${(err as Error).message}`);
    }
  };

  return { profile, fetchProfile };
}

