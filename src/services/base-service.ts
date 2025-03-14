
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Export supabase client for other services
export { supabase };

// Helper function to handle errors consistently
export const handleError = (error: any, message: string): void => {
  const errorMessage = error.message || 'An unknown error occurred';
  
  // Log the full error for debugging
  console.error(`${message}:`, error);
  
  // Show toast with user-friendly message
  toast.error(message, {
    description: errorMessage
  });
};
