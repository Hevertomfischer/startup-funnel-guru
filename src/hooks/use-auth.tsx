
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';

// Create a strongly typed context
type AuthContextType = {
  user: any | null;
  profile: Profile | null; // Add the profile property to the context type
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; data?: any }>;
  signOut: () => Promise<void>;
  devSignIn: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null); // Add state for profile
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Function to fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data as Profile;
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log("Auth provider mounted");
    let mounted = true;
    
    // Set up auth state listener FIRST to catch all auth events
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (session?.user) {
          if (mounted) setUser(session.user);
          
          try {
            // Fetch the complete profile data
            const profileData = await fetchUserProfile(session.user.id);
            if (mounted) {
              setProfile(profileData);
              setIsAdmin(profileData?.role === 'admin');
            }
          } catch (error) {
            console.error('Error checking admin status:', error);
          } finally {
            if (mounted) setIsLoading(false);
          }
        } else {
          if (mounted) {
            setUser(null);
            setProfile(null);
            setIsAdmin(false);
            setIsLoading(false);
          }
        }
      }
    );

    // THEN check for existing session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setUser(null);
            setProfile(null);
            setIsLoading(false);
          }
        } else if (data?.session) {
          if (mounted) setUser(data.session.user);
          
          // Fetch complete profile data
          try {
            const profileData = await fetchUserProfile(data.session.user.id);
            
            if (mounted) {
              setProfile(profileData);
              setIsAdmin(profileData?.role === 'admin');
            }
          } catch (error) {
            console.error('Error checking admin status:', error);
          } finally {
            if (mounted) setIsLoading(false);
          }
        } else {
          // No active session
          if (mounted) {
            setUser(null);
            setProfile(null);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        if (mounted) {
          setUser(null);
          setProfile(null);
          setIsLoading(false);
        }
      }
    };

    checkSession();

    // Cleanup
    return () => {
      mounted = false;
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Memoize the auth value to prevent unnecessary re-renders
  const authValue = useMemo(() => {
    const signIn = async (email: string, password: string) => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        // Fetch profile after successful login
        if (data.user) {
          const profileData = await fetchUserProfile(data.user.id);
          setProfile(profileData);
          setIsAdmin(profileData?.role === 'admin');
        }
        
        console.log('Sign in successful:', data);
        return { success: true, data };
      } catch (error: any) {
        console.error('Sign in error:', error.message);
        return { success: false, error: error.message };
      } finally {
        setIsLoading(false);
      }
    };

    const signOut = async () => {
      try {
        setIsLoading(true);
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setProfile(null);
        console.log('Sign out successful');
      } catch (error: any) {
        console.error('Sign out error:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    // For development only - signs in as admin without checking credentials
    const devSignIn = () => {
      const mockProfile: Profile = {
        id: 'dev-user',
        email: 'dev@example.com',
        full_name: 'Dev User',
        avatar_url: null,
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setUser({ id: 'dev-user', email: 'dev@example.com' });
      setProfile(mockProfile);
      setIsAdmin(true);
      setIsLoading(false);
    };

    return {
      user,
      profile, // Include profile in the context value
      isLoading,
      isAdmin,
      signIn,
      signOut,
      devSignIn,
    };
  }, [user, profile, isLoading, isAdmin]); // Add profile to the dependency array

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
