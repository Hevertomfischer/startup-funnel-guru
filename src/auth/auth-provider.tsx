
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { AuthContext } from './auth-context';
import { toast } from 'sonner';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log("Auth provider mounted");
    let mounted = true;
    
    // Function to fetch profile for a user
    const fetchUserProfile = async (userId: string) => {
      try {
        console.log(`Fetching profile for user ID: ${userId}`);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          return null;
        }
        
        console.log('Profile data retrieved:', data);
        return data as Profile;
      } catch (error) {
        console.error('Unexpected error fetching profile:', error);
        return null;
      }
    };
    
    // Function to handle session state changes
    const handleSessionChange = async (session: any) => {
      try {
        if (session?.user) {
          console.log("Session found with user:", session.user.email);
          if (mounted) setUser(session.user);
          
          // Fetch the complete profile data
          try {
            const profileData = await fetchUserProfile(session.user.id);
            
            if (mounted) {
              setProfile(profileData);
              setIsAdmin(profileData?.role === 'admin');
            }
          } catch (error) {
            console.error('Error fetching profile:', error);
          }
        } else {
          console.log("No session found");
          if (mounted) {
            setUser(null);
            setProfile(null);
            setIsAdmin(false);
          }
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener for future auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        await handleSessionChange(session);
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        console.log("Checking for existing session...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) setIsLoading(false);
          return;
        }
        
        await handleSessionChange(data.session);
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) setIsLoading(false);
      }
    };

    initializeAuth();

    // Cleanup
    return () => {
      mounted = false;
      if (authListener && authListener.subscription) {
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
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            if (!profileError && profileData) {
              setProfile(profileData as Profile);
              setIsAdmin(profileData?.role === 'admin');
            }
          } catch (profileError) {
            console.error('Error fetching profile after login:', profileError);
          }
        }
        
        console.log('Sign in successful:', data);
        toast.success('Login bem-sucedido');
        return { success: true, data };
      } catch (error: any) {
        console.error('Sign in error:', error.message);
        toast.error(`Erro de login: ${error.message}`);
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
        setUser(null);
        console.log('Sign out successful');
        toast.success('Logout realizado com sucesso');
      } catch (error: any) {
        console.error('Sign out error:', error.message);
        toast.error(`Erro ao fazer logout: ${error.message}`);
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
      toast.success('Dev login realizado');
    };

    return {
      user,
      profile,
      isLoading,
      isAdmin,
      signIn,
      signOut,
      devSignIn,
    };
  }, [user, profile, isLoading, isAdmin]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};
