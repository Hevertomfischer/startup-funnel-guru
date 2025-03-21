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
  const [initializationComplete, setInitializationComplete] = useState(false);

  // Função para buscar o perfil do usuário
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log(`Buscando perfil para o usuário ID: ${userId}`);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }
      
      console.log('Dados do perfil recuperados:', data);
      return data as Profile;
    } catch (error) {
      console.error('Erro inesperado ao buscar perfil:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log("Auth provider montado");
    let mounted = true;
    
    // Função para lidar com mudanças na sessão
    const handleSessionChange = async (currentSession: any) => {
      console.log('Processando mudança de sessão:', currentSession ? 'Sessão encontrada' : 'Sem sessão');
      
      if (!currentSession) {
        if (mounted) {
          setUser(null);
          setProfile(null);
          setIsAdmin(false);
          setIsLoading(false);
        }
        console.log('Nenhuma sessão encontrada, usuário definido como null');
        return;
      }
      
      if (mounted) setUser(currentSession.user);
      console.log("Sessão encontrada com usuário:", currentSession.user.email);
      
      try {
        const profileData = await fetchUserProfile(currentSession.user.id);
        
        if (mounted) {
          setProfile(profileData);
          setIsAdmin(profileData?.role === 'admin');
        }
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
          setInitializationComplete(true);
        }
      }
    };
    
    // Configurar ouvinte de eventos de autenticação primeiro
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Estado da autenticação alterado:', event);
        await handleSessionChange(session);
      }
    );
    
    // Depois verificar a sessão atual
    const checkCurrentSession = async () => {
      try {
        console.log("Verificando sessão existente...");
        setIsLoading(true);
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao obter sessão:', error);
          if (mounted) {
            setIsLoading(false);
            setInitializationComplete(true);
          }
          return;
        }
        
        await handleSessionChange(data.session);
      } catch (error) {
        console.error('Erro de inicialização de autenticação:', error);
        if (mounted) {
          setIsLoading(false);
          setInitializationComplete(true);
        }
      }
    };
    
    checkCurrentSession();
    
    // Limpeza
    return () => {
      mounted = false;
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Memorizar o valor de autenticação para evitar renderizações desnecessárias
  const authValue = useMemo(() => {
    const signIn = async (email: string, password: string) => {
      try {
        setIsLoading(true);
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
        
        // Buscar perfil após login bem-sucedido
        if (data.user) {
          try {
            const profileData = await fetchUserProfile(data.user.id);
            
            if (profileData) {
              setProfile(profileData);
              setIsAdmin(profileData.role === 'admin');
              console.log('Perfil carregado após login:', profileData.role);
            }
          } catch (profileError) {
            console.error('Erro ao buscar perfil após login:', profileError);
          }
        }
        
        toast.success('Login bem-sucedido');
        return { success: true, data };
      } catch (error: any) {
        console.error('Erro de login:', error.message);
        toast.error(`Erro de login: ${error.message}`);
        return { success: false, error: error.message };
      } finally {
        setIsLoading(false);
      }
    };

    const signOut = async () => {
      try {
        setIsLoading(true);
        console.log('Tentando fazer logout');
        
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          console.error('Erro de logout:', error.message);
          toast.error(`Erro ao fazer logout: ${error.message}`);
          return;
        }
        
        setProfile(null);
        setUser(null);
        setIsAdmin(false);
        
        console.log('Logout bem-sucedido');
        toast.success('Logout realizado com sucesso');
      } catch (error: any) {
        console.error('Erro de logout:', error.message);
        toast.error(`Erro ao fazer logout: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    // Para desenvolvimento apenas - faz login como administrador sem verificar credenciais
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
      initializationComplete
    };
  }, [user, profile, isLoading, isAdmin, initializationComplete]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};
