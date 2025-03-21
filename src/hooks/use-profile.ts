
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/types/auth';
import { fetchProfile } from '@/services/auth-service';

/**
 * Hook to manage loading and fetching user profile
 */
export const useProfile = (user: User | null) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      
      if (!user) {
        setProfile(null);
        setIsLoading(false);
        return;
      }
      
      try {
        const profileData = await fetchProfile(user.id);
        setProfile(profileData);
      } catch (error) {
        console.error('Error loading profile:', error);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [user]);
  
  return { profile, isLoading, isAdmin: profile?.role === 'admin' };
};
