
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { toast } from 'sonner';

/**
 * Fetch user profile from profiles table
 */
export const fetchProfile = async (userId: string): Promise<Profile | null> => {
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

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string): Promise<{ 
  data: { user: User | null; session: Session | null } | null;
  error: Error | null;
}> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        toast.error("Email não confirmado", {
          description: "Por favor, verifique seu email e confirme sua conta antes de fazer login"
        });
      } else {
        toast.error("Erro de login", {
          description: error.message || "Falha na autenticação"
        });
      }
      return { data: null, error };
    }
    
    if (data.user) {
      toast.success("Login bem-sucedido", {
        description: "Você foi autenticado com sucesso"
      });
    }

    return { data, error: null };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return { data: null, error };
  }
};

/**
 * Sign up with email and password
 */
export const signUp = async (email: string, password: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error("Erro no registro", {
        description: error.message || "Falha no registro"
      });
      return { error };
    }
    
    toast.success("Registro bem-sucedido", {
      description: "Verifique seu email para confirmar o cadastro"
    });
    
    return { error: null };
  } catch (error: any) {
    toast.error("Erro no registro", {
      description: error.message || "Falha no registro"
    });
    return { error };
  }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error("Erro ao sair", {
        description: error.message || "Falha ao desconectar"
      });
      return { error };
    }
    
    toast.success("Logout realizado", {
      description: "Você saiu da sua conta"
    });
    
    return { error: null };
  } catch (error: any) {
    toast.error("Erro ao sair", {
      description: error.message || "Falha ao desconectar"
    });
    return { error };
  }
};

/**
 * Get the current session
 */
export const getSession = async (): Promise<Session | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};
