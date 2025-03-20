
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';

// Create a strongly typed context
type AuthContextType = {
  user: any | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; data?: any }>;
  signOut: () => Promise<void>;
  devSignIn: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

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
            // Check admin status
            const { data } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
              
            if (mounted) setIsAdmin(data?.role === 'admin');
          } catch (error) {
            console.error('Error checking admin status:', error);
          } finally {
            if (mounted) setIsLoading(false);
          }
        } else {
          if (mounted) {
            setUser(null);
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
            setIsLoading(false);
          }
        } else if (data?.session) {
          if (mounted) setUser(data.session.user);
          
          // Check if user has admin role
          try {
            const { data: userData, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', data.session.user.id)
              .single();
              
            if (profileError) {
              console.error('Error fetching profile:', profileError);
            }
            
            if (mounted) setIsAdmin(userData?.role === 'admin');
          } catch (error) {
            console.error('Error checking admin status:', error);
          } finally {
            if (mounted) setIsLoading(false);
          }
        } else {
          // No active session
          if (mounted) {
            setUser(null);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        if (mounted) {
          setUser(null);
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
        console.log('Sign out successful');
      } catch (error: any) {
        console.error('Sign out error:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    // For development only - signs in as admin without checking credentials
    const devSignIn = () => {
      setUser({ id: 'dev-user', email: 'dev@example.com' });
      setIsAdmin(true);
      setIsLoading(false);
    };

    return {
      user,
      isLoading,
      isAdmin,
      signIn,
      signOut,
      devSignIn,
    };
  }, [user, isLoading, isAdmin]);

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
