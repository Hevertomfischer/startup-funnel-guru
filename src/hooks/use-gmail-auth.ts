
import { useEffect, useState } from 'react';
import { getGmailAuthUrl, refreshGmailToken } from '@/services/email-template-service';
import { toast } from 'sonner';

export const useGmailAuth = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem('gmail_refresh_token')
  );
  const [expiresAt, setExpiresAt] = useState<number | null>(
    Number(localStorage.getItem('gmail_expires_at')) || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authStage, setAuthStage] = useState<string>("initial");

  // Initialize from URL params (OAuth callback)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessTokenParam = params.get('access_token');
    const refreshTokenParam = params.get('refresh_token');
    const expiresInParam = params.get('expires_in');
    const errorParam = params.get('error');

    // Log initial state for debugging
    console.log('Gmail Auth Hook - Initial State:');
    console.log('URL has access_token:', !!accessTokenParam);
    console.log('URL has refresh_token:', !!refreshTokenParam);
    console.log('URL has expires_in:', !!expiresInParam);
    console.log('URL has error:', !!errorParam, errorParam);
    console.log('Local storage refresh token exists:', !!refreshToken);
    console.log('Local storage expires_at exists:', !!expiresAt);

    setAuthStage("checking_url_params");
    
    // Clear URL params to avoid sharing tokens in browser history
    if (accessTokenParam || refreshTokenParam || expiresInParam || errorParam) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (errorParam) {
      console.error('Gmail auth error from URL:', errorParam);
      setError(errorParam);
      setAuthStage("auth_error");
      toast.error('Gmail authentication failed', {
        description: errorParam,
        action: {
          label: 'Retry',
          onClick: () => startGmailAuth()
        }
      });
      return;
    }

    if (accessTokenParam && refreshTokenParam && expiresInParam) {
      console.log('Setting tokens from URL params');
      setAccessToken(accessTokenParam);
      setRefreshToken(refreshTokenParam);
      setAuthStage("tokens_from_url");
      
      // Calculate expiration timestamp
      const expiresAt = Date.now() + (parseInt(expiresInParam) * 1000);
      setExpiresAt(expiresAt);
      
      // Store in localStorage for persistence
      localStorage.setItem('gmail_refresh_token', refreshTokenParam);
      localStorage.setItem('gmail_expires_at', expiresAt.toString());
      
      toast.success('Gmail account connected successfully');
      setError(null);
    }
  }, []);

  // Check token expiration and refresh if needed
  useEffect(() => {
    const checkTokenExpiration = async () => {
      if (!refreshToken) return;
      
      console.log('Gmail Auth - Checking token expiration:');
      console.log('Current time:', new Date(Date.now()).toISOString());
      console.log('Expires at time:', expiresAt ? new Date(expiresAt).toISOString() : 'not set');
      console.log('Is expired:', expiresAt ? Date.now() > expiresAt : 'unknown');
      console.log('Access token exists:', !!accessToken);
      
      if (!expiresAt || Date.now() > expiresAt - 5 * 60 * 1000) {
        try {
          console.log('Refreshing token...');
          setAuthStage("refreshing_token");
          setIsLoading(true);
          const { access_token, expires_in } = await refreshGmailToken(refreshToken);
          
          console.log('Token refreshed, new access token length:', access_token.length);
          setAccessToken(access_token);
          
          // Calculate new expiration timestamp
          const newExpiresAt = Date.now() + (expires_in * 1000);
          setExpiresAt(newExpiresAt);
          localStorage.setItem('gmail_expires_at', newExpiresAt.toString());
          
          console.log('Gmail token refreshed successfully');
          setAuthStage("token_refreshed");
          setError(null);
        } catch (error: any) {
          console.error('Failed to refresh token:', error);
          setError(error.message);
          setAuthStage("refresh_error");
          
          // Clear tokens if refresh fails
          setAccessToken(null);
          setRefreshToken(null);
          setExpiresAt(null);
          localStorage.removeItem('gmail_refresh_token');
          localStorage.removeItem('gmail_expires_at');
          
          toast.error('Failed to refresh Gmail authentication', {
            description: 'Please reconnect your Gmail account'
          });
        } finally {
          setIsLoading(false);
        }
      } else if (!accessToken) {
        // If we have a valid refresh token but no access token
        try {
          console.log('Getting new access token from refresh token');
          setIsLoading(true);
          setAuthStage("getting_access_token");
          const { access_token, expires_in } = await refreshGmailToken(refreshToken);
          
          console.log('Got new access token, length:', access_token.length);
          setAccessToken(access_token);
          
          // Calculate new expiration timestamp
          const newExpiresAt = Date.now() + (expires_in * 1000);
          setExpiresAt(newExpiresAt);
          localStorage.setItem('gmail_expires_at', newExpiresAt.toString());
          
          console.log('Gmail token loaded successfully');
          setAuthStage("token_loaded");
          setError(null);
        } catch (error: any) {
          console.error('Failed to load token:', error);
          setError(error.message);
          setAuthStage("load_token_error");
          
          // Clear tokens if refresh fails
          setAccessToken(null);
          setRefreshToken(null);
          setExpiresAt(null);
          localStorage.removeItem('gmail_refresh_token');
          localStorage.removeItem('gmail_expires_at');
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkTokenExpiration();
    
    // Also set up a periodic check
    const interval = setInterval(checkTokenExpiration, 60 * 1000); // Check every minute
    
    return () => clearInterval(interval);
  }, [refreshToken, expiresAt, accessToken]);

  const startGmailAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setAuthStage("starting_auth");
      
      const authUrl = await getGmailAuthUrl();
      console.log('Starting Gmail auth, received auth URL:', authUrl);
      
      // Open in a popup window for better user experience
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      console.log('Opening auth popup window');
      setAuthStage("opening_popup");
      
      const popup = window.open(
        authUrl,
        'gmailAuthPopup',
        `width=${width},height=${height},left=${left},top=${top}`
      );
      
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        // Popup was blocked, try direct navigation
        console.log('Popup blocked, redirecting directly');
        setAuthStage("direct_navigation");
        window.location.href = authUrl;
        toast.info('Abrindo janela de autenticação do Gmail', {
          description: 'Se não aparecer, verifique se os pop-ups estão permitidos neste site.'
        });
      } else {
        console.log('Auth popup opened successfully');
      }
    } catch (error: any) {
      console.error('Failed to start Gmail authentication:', error);
      setError(error.message);
      setAuthStage("auth_start_error");
      toast.error('Failed to start Gmail authentication', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    console.log('Disconnecting Gmail account');
    setAccessToken(null);
    setRefreshToken(null);
    setExpiresAt(null);
    localStorage.removeItem('gmail_refresh_token');
    localStorage.removeItem('gmail_expires_at');
    setError(null);
    setAuthStage("disconnected");
    
    toast.success('Gmail account disconnected');
  };

  return {
    accessToken,
    isAuthenticated: !!accessToken,
    isLoading,
    error,
    authStage,
    startGmailAuth,
    disconnect
  };
};
