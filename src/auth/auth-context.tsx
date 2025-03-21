
import React, { createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/types/auth';

// Create a strongly typed context interface
export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  initializationComplete: boolean;
  signIn: (email: string, password: string) => Promise<{ 
    success: boolean; 
    error?: string; 
    data?: { user: User | null } 
  }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  devSignIn: () => { mockUser: User; mockProfile: Profile };
}

// Create the context with a default value of null
export const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to use the auth context with type checking
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
};
