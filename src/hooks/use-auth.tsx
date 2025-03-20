
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log("Auth provider mounted");
    let mounted = true;
    
    // Check active session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) setUser(null);
        } else if (data?.session) {
          if (mounted) setUser(data.session.user);
          
          // Check if user has admin role
          const { data: userData } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.session.user.id)
            .single();
            
          if (mounted) setIsAdmin(userData?.role === 'admin');
        } else {
          // No active session
          if (mounted) setUser(null);
        }
      } catch (error) {
        console.error('Session check error:', error);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (session?.user) {
          if (mounted) setUser(session.user);
          
          // Check admin status
          const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
            
          if (mounted) setIsAdmin(data?.role === 'admin');
        } else {
          if (mounted) {
            setUser(null);
            setIsAdmin(false);
          }
        }
        
        if (mounted) setIsLoading(false);
      }
    );

    checkSession();

    // Cleanup
    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Memoize the auth value to prevent unnecessary re-renders
  const authValue = useMemo(() => {
    // Mock sign in for development (remove in production)
    const signIn = async (email: string, password: string) => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
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
