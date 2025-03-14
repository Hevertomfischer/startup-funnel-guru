
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
        description: errorParam
      });
    }

    if (accessTokenParam && refreshTokenParam && expiresInParam) {
      setAccessToken(accessTokenParam);
      setRefreshToken(refreshTokenParam);
      
      // Calculate expiration timestamp
      const expiresAt = Date.now() + (parseInt(expiresInParam) * 1000);
      setExpiresAt(expiresAt);
      
      // Store in localStorage for persistence
      localStorage.setItem('gmail_refresh_token', refreshTokenParam);
      localStorage.setItem('gmail_expires_at', expiresAt.toString());
      
      toast.success('Gmail account connected successfully');
    }
  }, []);

  // Check token expiration and refresh if needed
  useEffect(() => {
    const checkTokenExpiration = async () => {
      if (!refreshToken || !expiresAt) return;
      
      // If token is expired or will expire in the next 5 minutes
      if (Date.now() > expiresAt - 5 * 60 * 1000) {
        try {
          setIsLoading(true);
          const { access_token, expires_in } = await refreshGmailToken(refreshToken);
          
          setAccessToken(access_token);
          
          // Calculate new expiration timestamp
          const newExpiresAt = Date.now() + (expires_in * 1000);
          setExpiresAt(newExpiresAt);
          localStorage.setItem('gmail_expires_at', newExpiresAt.toString());
          
          console.log('Gmail token refreshed successfully');
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
          setIsLoading(true);
          const { access_token, expires_in } = await refreshGmailToken(refreshToken);
          
          setAccessToken(access_token);
          
          // Calculate new expiration timestamp
          const newExpiresAt = Date.now() + (expires_in * 1000);
          setExpiresAt(newExpiresAt);
          localStorage.setItem('gmail_expires_at', newExpiresAt.toString());
          
          console.log('Gmail token loaded successfully');
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
      window.location.href = authUrl;
    } catch (error: any) {
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
