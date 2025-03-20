
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function useConnectionCheck() {
  const [connectionError, setConnectionError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Check Supabase connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsRetrying(true);
        
        // Simple query to test connection and fetch statuses
        console.log("Checking Supabase connection in BoardView");
        const { data, error } = await supabase.from('statuses').select('*');
        
        if (error) {
          console.error('Supabase connection error:', error);
          setConnectionError(true);
          toast({
            title: "Erro de conexão",
            description: "Não foi possível conectar ao banco de dados. Verifique sua conexão com a internet.",
            variant: "destructive",
          });
        } else {
          console.log('Supabase connection successful, found statuses:', data?.length || 0);
          setConnectionError(false);
          
          // If no statuses exist, let's try to check if startups exist directly
          if (!data || data.length === 0) {
            const { data: startups, error: startupError } = await supabase
              .from('startups')
              .select('count');
              
            if (startupError) {
              console.error('Error checking startups:', startupError);
            } else {
              console.log('Found startups in database:', startups);
            }
          }
        }
      } catch (error) {
        console.error('Unexpected error checking Supabase connection:', error);
        setConnectionError(true);
      } finally {
        setIsRetrying(false);
      }
    };
    
    checkConnection();
  }, []);

  const handleRetryConnection = () => {
    window.location.reload();
  };

  return {
    connectionError,
    isRetrying,
    handleRetryConnection
  };
}
