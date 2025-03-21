
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Profile } from '@/types/auth';
import { AuthContext } from './auth-context';
import { signIn, signOut, devSignIn } from './actions/auth-actions';
import { initializeSession, setupAuthChangeListener } from './session/session-manager';
import { fetchUserProfile } from './utils/profile-utils';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [initializationComplete, setInitializationComplete] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    console.log("Auth provider montado");
    mounted.current = true;
    
    // Verificar sessão atual imediatamente ao montar o componente
    initializeSession(setUser, setProfile, setIsAdmin, setIsLoading, setInitializationComplete, mounted);
    
    // Configurar ouvinte de eventos de autenticação
    const { data: authListener } = setupAuthChangeListener(
      setUser, setProfile, setIsAdmin, setIsLoading, setInitializationComplete, mounted
    );
    
    // Limpeza
    return () => {
      mounted.current = false;
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Memorizar o valor de autenticação para evitar renderizações desnecessárias
  const authValue = useMemo(() => {
    const handleSignIn = async (email: string, password: string) => {
      try {
        setIsLoading(true);
        const result = await signIn(email, password);
        
        // Buscar perfil após login bem-sucedido
        if (result.success && result.data?.user) {
          try {
            const profileData = await fetchUserProfile(result.data.user.id, result.data.user.email);
            
            if (profileData) {
              setProfile(profileData);
              setIsAdmin(profileData.role === 'admin');
              console.log('Perfil carregado após login:', profileData.role);
            }
          } catch (profileError) {
            console.error('Erro ao buscar perfil após login:', profileError);
          }
        }
        
        return result;
      } finally {
        setIsLoading(false);
      }
    };

    const handleSignOut = async () => {
      try {
        setIsLoading(true);
        await signOut();
        setProfile(null);
        setUser(null);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    const handleDevSignIn = () => {
      const { mockUser, mockProfile } = devSignIn();
      setUser(mockUser);
      setProfile(mockProfile);
      setIsAdmin(true);
      setIsLoading(false);
    };

    return {
      user,
      profile,
      isLoading,
      isAdmin,
      signIn: handleSignIn,
      signOut: handleSignOut,
      devSignIn: handleDevSignIn,
      initializationComplete
    };
  }, [user, profile, isLoading, isAdmin, initializationComplete]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};
