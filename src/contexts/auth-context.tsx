
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { Profile } from '@/types/auth';
import { signIn, signUp, signOut, fetchProfile } from '@/services/auth-service';
import { useProfile } from '@/hooks/use-profile';

// Define the auth context type
type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  // Use the profile hook
  const { profile, isLoading: profileLoading, isAdmin } = useProfile(user);
  
  const isLoading = authLoading || profileLoading;

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      setAuthLoading(true);
      try {
        console.log('Initializing auth...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Auth session:', session?.user?.email || 'No session');
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setAuthLoading(false);
        setInitialLoadComplete(true);
      }
    };

    initializeAuth();

    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setAuthLoading(false);
      }
    );

    // Cleanup on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Auth functions
  const handleSignIn = async (email: string, password: string) => {
    try {
      setAuthLoading(true);
      const { data, error } = await signIn(email, password);
      if (error) throw error;
      if (data?.user) {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      setAuthLoading(true);
      const { error } = await signUp(email, password);
      if (error) throw error;
    } catch (error: any) {
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setAuthLoading(true);
      const { error } = await signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error: any) {
      console.error('Sign out error:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        isAdmin,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
