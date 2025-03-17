
import { toast } from 'sonner';

// Helper to extract and validate tokens from URL parameters
export const extractTokensFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  const expiresIn = params.get('expires_in');
  const error = params.get('error');

  // Log for debugging
  console.log('Gmail Auth - Extracted from URL:');
  console.log('URL has access_token:', !!accessToken);
  console.log('URL has refresh_token:', !!refreshToken);
  console.log('URL has expires_in:', !!expiresIn);
  console.log('URL has error:', !!error, error);

  // Clear URL params to avoid sharing tokens in browser history
  if (accessToken || refreshToken || expiresIn || error) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  return { accessToken, refreshToken, expiresIn, error };
};

// Helper to calculate expiration timestamp from seconds
export const calculateExpirationTimestamp = (expiresInSeconds: string | number): number => {
  const expiresInMs = typeof expiresInSeconds === 'string' 
    ? parseInt(expiresInSeconds) * 1000 
    : expiresInSeconds * 1000;
  
  return Date.now() + expiresInMs;
};

// Helper to save auth data to localStorage
export const saveAuthDataToStorage = (refreshToken: string, expiresAt: number) => {
  localStorage.setItem('gmail_refresh_token', refreshToken);
  localStorage.setItem('gmail_expires_at', expiresAt.toString());
};

// Helper to clear auth data from localStorage
export const clearAuthDataFromStorage = () => {
  localStorage.removeItem('gmail_refresh_token');
  localStorage.removeItem('gmail_expires_at');
};

// Helper to check if token is expired or about to expire (5 min buffer)
export const isTokenExpiredOrExpiring = (expiresAt: number | null): boolean => {
  if (!expiresAt) return true;
  
  // Consider token as expired if it's within 5 minutes of expiration
  const fiveMinutesInMs = 5 * 60 * 1000;
  return Date.now() > expiresAt - fiveMinutesInMs;
};

// Helper to open auth popup window
export const openAuthPopupWindow = (authUrl: string): Window | null => {
  // Open in a popup window for better user experience
  const width = 600;
  const height = 700;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  console.log('Opening auth popup window for URL:', authUrl);
  
  const popup = window.open(
    authUrl,
    'gmailAuthPopup',
    `width=${width},height=${height},left=${left},top=${top}`
  );
  
  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    // Popup was blocked, try direct navigation
    console.log('Popup blocked, redirecting directly');
    toast.info('Abrindo janela de autenticação do Gmail', {
      description: 'Se não aparecer, verifique se os pop-ups estão permitidos neste site.'
    });
    
    // Wait a moment then navigate to the auth URL
    setTimeout(() => {
      window.location.href = authUrl;
    }, 1000);
    
    return null;
  }
  
  console.log('Auth popup opened successfully');
  return popup;
};
