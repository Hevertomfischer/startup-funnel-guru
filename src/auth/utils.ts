
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';

// Function to fetch user profile
export const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
  if (!userId) {
    console.error('fetchUserProfile called with no userId');
    return null;
  }
  
  try {
    console.log(`Fetching profile for user ID: ${userId}`);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    console.log('Profile data retrieved:', data ? 'yes' : 'no');
    return data as Profile;
  } catch (error) {
    console.error('Unexpected error fetching profile:', error);
    return null;
  }
};
