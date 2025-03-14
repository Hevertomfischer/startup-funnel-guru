
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

  // Initialize from URL params (OAuth callback)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessTokenParam = params.get('access_token');
    const refreshTokenParam = params.get('refresh_token');
    const expiresInParam = params.get('expires_in');
    const errorParam = params.get('error');

    // Clear URL params to avoid sharing tokens in browser history
    if (accessTokenParam || refreshTokenParam || expiresInParam || errorParam) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (errorParam) {
      setError(errorParam);
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
      
      if (!expiresAt || Date.now() > expiresAt - 5 * 60 * 1000) {
        try {
          console.log('Refreshing token...');
          setIsLoading(true);
          const { access_token, expires_in } = await refreshGmailToken(refreshToken);
          
          console.log('Token refreshed, new access token length:', access_token.length);
          setAccessToken(access_token);
          
          // Calculate new expiration timestamp
          const newExpiresAt = Date.now() + (expires_in * 1000);
          setExpiresAt(newExpiresAt);
          localStorage.setItem('gmail_expires_at', newExpiresAt.toString());
          
          console.log('Gmail token refreshed successfully');
          setError(null);
        } catch (error: any) {
          console.error('Failed to refresh token:', error);
          setError(error.message);
          
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
          const { access_token, expires_in } = await refreshGmailToken(refreshToken);
          
          console.log('Got new access token, length:', access_token.length);
          setAccessToken(access_token);
          
          // Calculate new expiration timestamp
          const newExpiresAt = Date.now() + (expires_in * 1000);
          setExpiresAt(newExpiresAt);
          localStorage.setItem('gmail_expires_at', newExpiresAt.toString());
          
          console.log('Gmail token loaded successfully');
          setError(null);
        } catch (error: any) {
          console.error('Failed to load token:', error);
          setError(error.message);
          
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
      
      const authUrl = await getGmailAuthUrl();
      console.log('Redirecting to auth URL:', authUrl);
      
      // Open in a popup window for better user experience
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        authUrl,
        'gmailAuthPopup',
        `width=${width},height=${height},left=${left},top=${top}`
      );
      
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        // Popup was blocked, try direct navigation
        window.location.href = authUrl;
        toast.info('Abrindo janela de autenticação do Gmail', {
          description: 'Se não aparecer, verifique se os pop-ups estão permitidos neste site.'
        });
      }
    } catch (error: any) {
      console.error('Failed to start Gmail authentication:', error);
      setError(error.message);
      toast.error('Failed to start Gmail authentication', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setExpiresAt(null);
    localStorage.removeItem('gmail_refresh_token');
    localStorage.removeItem('gmail_expires_at');
    setError(null);
    
    toast.success('Gmail account disconnected');
  };

  return {
    accessToken,
    isAuthenticated: !!accessToken,
    isLoading,
    error,
    startGmailAuth,
    disconnect
  };
};
