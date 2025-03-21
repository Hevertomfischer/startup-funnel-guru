
import { supabase } from '@/integrations/supabase/client';
import { fetchUserProfile } from '../utils/profile-utils';
import { toast } from 'sonner';

/**
 * Initializes and manages the authentication session
 */
export const initializeSession = async (setUser: Function, setProfile: Function, setIsAdmin: Function, setIsLoading: Function, setInitializationComplete: Function, mounted: { current: boolean }) => {
  try {
    console.log("Verificando sessão existente...");
    
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Erro ao obter sessão:', sessionError);
      if (mounted.current) {
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
      if (mounted.current) {
        setUser(null);
        setProfile(null);
        setIsLoading(false);
        setInitializationComplete(true);
      }
      return;
    }
    
    console.log("Sessão encontrada com usuário:", session.user.email);
    if (mounted.current) setUser(session.user);
    
    try {
      const profileData = await fetchUserProfile(session.user.id, session.user.email);
      
      if (mounted.current) {
        setProfile(profileData);
        setIsAdmin(profileData?.role === 'admin');
        setIsLoading(false);
        setInitializationComplete(true);
      }
    } catch (profileError) {
      console.error('Erro ao buscar perfil:', profileError);
      if (mounted.current) {
        // Mesmo com erro, finaliza carregamento e inicialização
        setIsLoading(false);
        setInitializationComplete(true);
      }
    }
  } catch (error) {
    console.error('Erro de inicialização de autenticação:', error);
    if (mounted.current) {
      setIsLoading(false);
      setInitializationComplete(true);
    }
  }
};

/**
 * Sets up the auth state change listener
 */
export const setupAuthChangeListener = (
  setUser: Function, 
  setProfile: Function, 
  setIsAdmin: Function, 
  setIsLoading: Function,
  setInitializationComplete: Function,
  mounted: { current: boolean }
) => {
  console.log("Configurando listener de autenticação");
  
  const { data } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      console.log('Estado da autenticação alterado:', event);
      
      if (!session) {
        if (mounted.current) {
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
      if (mounted.current) setUser(session.user);
      
      try {
        const profileData = await fetchUserProfile(session.user.id, session.user.email);
        
        if (mounted.current) {
          setProfile(profileData);
          setIsAdmin(profileData?.role === 'admin');
          setIsLoading(false);
          setInitializationComplete(true);
        }
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        if (mounted.current) {
          // Mesmo com erro, finaliza carregamento
          setIsLoading(false);
          setInitializationComplete(true);
        }
      }
    }
  );
  
  return data;
};
