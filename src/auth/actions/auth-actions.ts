
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { fetchUserProfile } from '../utils/profile-utils';
import { Profile } from '@/types/auth';

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string) => {
  try {
    console.log(`Tentando login com: ${email}`);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Erro de login:', error.message);
      toast.error(`Erro de login: ${error.message}`);
      return { success: false, error: error.message };
    }
    
    console.log('Login bem-sucedido:', data.user?.email);
    toast.success('Login bem-sucedido');
    return { success: true, data };
  } catch (error: any) {
    console.error('Erro de login:', error.message);
    toast.error(`Erro de login: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  try {
    console.log('Tentando fazer logout');
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Erro de logout:', error.message);
      toast.error(`Erro ao fazer logout: ${error.message}`);
      return { success: false, error: error.message };
    }
    
    console.log('Logout bem-sucedido');
    toast.success('Logout realizado com sucesso');
    return { success: true };
  } catch (error: any) {
    console.error('Erro de logout:', error.message);
    toast.error(`Erro ao fazer logout: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Development-only mock sign in function
 */
export const devSignIn = (): { mockUser: any; mockProfile: Profile } => {
  const mockProfile: Profile = {
    id: 'dev-user',
    email: 'dev@example.com',
    full_name: 'Dev User',
    avatar_url: null,
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  toast.success('Dev login realizado');
  
  return {
    mockUser: { id: 'dev-user', email: 'dev@example.com' },
    mockProfile
  };
};
