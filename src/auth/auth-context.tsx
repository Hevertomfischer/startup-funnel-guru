
import React, { createContext } from 'react';
import { Profile } from '@/types/auth';

// Create a strongly typed context
export type AuthContextType = {
  user: any | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  initializationComplete: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; data?: any }>;
  signOut: () => Promise<void>;
  devSignIn: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
