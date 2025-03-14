
import { useState, useEffect } from 'react';
import { refreshGmailToken } from '@/services/email-template-service';
import { 
  calculateExpirationTimestamp, 
  saveAuthDataToStorage, 
  clearAuthDataFromStorage,
  isTokenExpiredOrExpiring
} from '@/utils/gmail-auth-utils';
import { toast } from 'sonner';

// Hook to manage token state and refresh logic
export const useGmailToken = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem('gmail_refresh_token')
  );
  const [expiresAt, setExpiresAt] = useState<number | null>(
    Number(localStorage.getItem('gmail_expires_at')) || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null | Error>(null);
  const [tokenStatus, setTokenStatus] = useState<string>("initial");

  // Set tokens from external source (like URL params)
  const setTokensFromExternalSource = (
    newAccessToken: string, 
    newRefreshToken: string, 
    expiresInSeconds: string | number
  ) => {
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    
    // Calculate expiration timestamp
    const newExpiresAt = calculateExpirationTimestamp(expiresInSeconds);
    setExpiresAt(newExpiresAt);
    
    // Store in localStorage for persistence
    saveAuthDataToStorage(newRefreshToken, newExpiresAt);
    
    setError(null);
    setTokenStatus("tokens_set");
  };

  // Refresh the access token using the refresh token
  const refreshAccessToken = async () => {
    if (!refreshToken) return false;
    
    try {
      setIsLoading(true);
      setTokenStatus("refreshing_token");
      
      const { access_token, expires_in } = await refreshGmailToken(refreshToken);
      
      console.log('Token refreshed, new access token length:', access_token.length);
      setAccessToken(access_token);
      
      // Calculate new expiration timestamp
      const newExpiresAt = calculateExpirationTimestamp(expires_in);
      setExpiresAt(newExpiresAt);
      localStorage.setItem('gmail_expires_at', newExpiresAt.toString());
      
      console.log('Gmail token refreshed successfully');
      setTokenStatus("token_refreshed");
      setError(null);
      
      return true;
    } catch (error: any) {
      console.error('Failed to refresh token:', error);
      setError(error);
      setTokenStatus("refresh_error");
      
      // Clear tokens if refresh fails
      clearAllTokens();
      
      toast.error('Failed to refresh Gmail authentication', {
        description: 'Please reconnect your Gmail account'
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear all token data (for logout)
  const clearAllTokens = () => {
    console.log('Clearing all tokens');
    setAccessToken(null);
    setRefreshToken(null);
    setExpiresAt(null);
    clearAuthDataFromStorage();
    setError(null);
    setTokenStatus("tokens_cleared");
  };

  // Initially check token validation and refresh when needed
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      if (!refreshToken) return;
      
      console.log('Gmail Auth - Checking token expiration:');
      console.log('Current time:', new Date(Date.now()).toISOString());
      console.log('Expires at time:', expiresAt ? new Date(expiresAt).toISOString() : 'not set');
      console.log('Is expired:', isTokenExpiredOrExpiring(expiresAt));
      console.log('Access token exists:', !!accessToken);
      
      if (isTokenExpiredOrExpiring(expiresAt) || !accessToken) {
        await refreshAccessToken();
      }
    };

    checkAndRefreshToken();
    
    // Set up periodic token check
    const interval = setInterval(checkAndRefreshToken, 60 * 1000); // Check every minute
    
    return () => clearInterval(interval);
  }, [refreshToken, expiresAt, accessToken]);

  return {
    accessToken,
    refreshToken,
    isLoading,
    error,
    tokenStatus,
    setTokensFromExternalSource,
    clearAllTokens,
    refreshAccessToken
  };
};
