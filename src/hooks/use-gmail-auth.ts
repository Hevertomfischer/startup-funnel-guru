
import { useState, useEffect } from 'react';
import { getGmailAuthUrl } from '@/services/email-template-service';
import { useGmailToken } from './use-gmail-token';
import { 
  extractTokensFromUrl, 
  openAuthPopupWindow 
} from '@/utils/gmail-auth-utils';
import { toast } from 'sonner';

export const useGmailAuth = () => {
  const {
    accessToken,
    isLoading: isTokenLoading,
    error: tokenError,
    tokenStatus,
    setTokensFromExternalSource,
    clearAllTokens,
  } = useGmailToken();

  const [authStage, setAuthStage] = useState<string>("initial");

  // Verifica tokens na URL quando o componente é montado
  useEffect(() => {
    const checkUrlParams = () => {
      setAuthStage("checking_url_params");
      const { accessToken, refreshToken, expiresIn, error } = extractTokensFromUrl();

      if (error) {
        console.error('Gmail auth error from URL:', error);
        setAuthStage("auth_error");
        toast.error('Erro na autenticação do Gmail', {
          description: error
        });
        return false;
      }

      if (accessToken && refreshToken && expiresIn) {
        console.log('Tokens encontrados na URL, salvando...');
        setTokensFromExternalSource(accessToken, refreshToken, expiresIn);
        setAuthStage("tokens_from_url");
        toast.success('Gmail conectado com sucesso');
        return true;
      }

      setAuthStage("no_tokens_in_url");
      return false;
    };

    checkUrlParams();
  }, []);

  // Check URL params for tokens on demand
  const checkUrlForTokens = () => {
    setAuthStage("checking_url_params");
    const { accessToken, refreshToken, expiresIn, error } = extractTokensFromUrl();

    if (error) {
      console.error('Gmail auth error from URL:', error);
      setAuthStage("auth_error");
      return false;
    }

    if (accessToken && refreshToken && expiresIn) {
      console.log('Setting tokens from URL params');
      setTokensFromExternalSource(accessToken, refreshToken, expiresIn);
      setAuthStage("tokens_from_url");
      return true;
    }

    return false;
  };

  // Start the Gmail auth process
  const startGmailAuth = async () => {
    try {
      setAuthStage("starting_auth");
      
      const response = await getGmailAuthUrl();
      if (!response || !response.authUrl) {
        throw new Error('Não foi possível obter a URL de autenticação do Gmail');
      }
      
      const authUrl = response.authUrl;
      console.log('Starting Gmail auth, received auth URL:', authUrl);
      
      setAuthStage("opening_popup");
      openAuthPopupWindow(authUrl);
      
    } catch (error: any) {
      console.error('Failed to start Gmail authentication:', error);
      setAuthStage("auth_start_error");
      toast.error('Erro ao iniciar autenticação do Gmail', {
        description: error.message || 'Tente novamente mais tarde'
      });
    }
  };

  // Disconnect from Gmail
  const disconnect = () => {
    clearAllTokens();
    setAuthStage("disconnected");
    toast.info('Desconectado do Gmail');
  };

  return {
    accessToken,
    isAuthenticated: !!accessToken,
    isLoading: isTokenLoading,
    error: tokenError,
    authStage: `${authStage}_${tokenStatus}`,
    startGmailAuth,
    disconnect,
    checkUrlForTokens
  };
};
