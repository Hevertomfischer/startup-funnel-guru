
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks the connection to Supabase
 */
export const useConnectionCheck = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log("Checking Supabase connection in useStatusQueries");
        const { data, error } = await supabase.from('statuses').select('count');
        
        if (error) {
          console.error("Failed to connect to Supabase:", error);
          toast({
            title: "Erro de conexão",
            description: "Não foi possível conectar ao banco de dados. Tente novamente mais tarde.",
            variant: "destructive",
          });
        } else {
          console.log("Supabase connection verified successfully");
        }
      } catch (e) {
        console.error("Unexpected error checking Supabase connection:", e);
      }
    };
    
    checkConnection();
  }, [toast]);
};
