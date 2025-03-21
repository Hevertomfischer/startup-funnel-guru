
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

  // Função para buscar o perfil do usuário de forma confiável
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log(`Buscando perfil para o usuário ID: ${userId}`);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Usar maybeSingle em vez de single para evitar erros quando nenhum perfil é encontrado
        
      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }
      
      console.log('Dados do perfil recuperados:', data);
      
      // Se não encontrou perfil, retornar um perfil padrão
      if (!data) {
        console.warn(`Nenhum perfil encontrado para o usuário ${userId}. Usando perfil padrão.`);
        // Retorna um perfil padrão para evitar estado nulo
        return {
          id: userId,
          email: user?.email || '',
          full_name: null,
          avatar_url: null,
          role: 'investor',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as Profile;
      }
      
      return data as Profile;
    } catch (error) {
      console.error('Erro inesperado ao buscar perfil:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log("Auth provider montado");
    let mounted = true;
    
    // Verificar sessão atual imediatamente ao montar o componente
    const checkCurrentSession = async () => {
      try {
        console.log("Verificando sessão existente...");
        
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Erro ao obter sessão:', sessionError);
          if (mounted) {
            setUser(null);
            setProfile(null);
            setIsLoading(false);
            setInitializationComplete(true);
          }
          return;
        }
        
        const session = sessionData?.session;
        
        if (!session) {
          console.log('Nenhuma sessão encontrada, usuário definido como null');
          if (mounted) {
            setUser(null);
            setProfile(null);
            setIsLoading(false);
            setInitializationComplete(true);
          }
          return;
        }
        
        console.log("Sessão encontrada com usuário:", session.user.email);
        if (mounted) setUser(session.user);
        
        try {
          const profileData = await fetchUserProfile(session.user.id);
          
          if (mounted) {
            setProfile(profileData);
            setIsAdmin(profileData?.role === 'admin');
            setIsLoading(false);
            setInitializationComplete(true);
          }
        } catch (profileError) {
          console.error('Erro ao buscar perfil:', profileError);
          if (mounted) {
            // Mesmo com erro, finaliza carregamento e inicialização
            setIsLoading(false);
            setInitializationComplete(true);
          }
        }
      } catch (error) {
        console.error('Erro de inicialização de autenticação:', error);
        if (mounted) {
          setIsLoading(false);
          setInitializationComplete(true);
        }
      }
    };
    
    // Configurar ouvinte de eventos de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Estado da autenticação alterado:', event);
        
        if (!session) {
          if (mounted) {
            setUser(null);
            setProfile(null);
            setIsAdmin(false);
            setIsLoading(false);
            setInitializationComplete(true);
          }
          console.log('Nenhuma sessão encontrada, usuário definido como null');
          return;
        }
        
        console.log("Sessão encontrada com usuário:", session.user.email);
        if (mounted) setUser(session.user);
        
        try {
          const profileData = await fetchUserProfile(session.user.id);
          
          if (mounted) {
            setProfile(profileData);
            setIsAdmin(profileData?.role === 'admin');
            setIsLoading(false);
            setInitializationComplete(true);
          }
        } catch (error) {
          console.error('Erro ao buscar perfil:', error);
          if (mounted) {
            // Mesmo com erro, finaliza carregamento
            setIsLoading(false);
            setInitializationComplete(true);
          }
        }
      }
    );
    
    // Iniciar verificação de sessão
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
