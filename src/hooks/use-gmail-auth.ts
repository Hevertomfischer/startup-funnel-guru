
import { useState } from 'react';
import { getGmailAuthUrl } from '@/services/email-template-service';
import { useGmailToken } from './use-gmail-token';
import { 
  extractTokensFromUrl, 
  openAuthPopupWindow 
} from '@/utils/gmail-auth-utils';

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

  // Check URL params for tokens on mount
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
      
      const authUrl = await getGmailAuthUrl();
      console.log('Starting Gmail auth, received auth URL:', authUrl);
      
      setAuthStage("opening_popup");
      openAuthPopupWindow(authUrl);
      
    } catch (error: any) {
      console.error('Failed to start Gmail authentication:', error);
      setAuthStage("auth_start_error");
    }
  };

  // Disconnect from Gmail
  const disconnect = () => {
    clearAllTokens();
    setAuthStage("disconnected");
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
