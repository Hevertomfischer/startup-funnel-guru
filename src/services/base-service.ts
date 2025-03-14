
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Export supabase client for other services
export { supabase };

// Helper function to handle errors consistently
export const handleError = (error: any, message: string): void => {
  toast.error(message, {
    description: error.message
  });
  console.error(`${message}:`, error);
};
