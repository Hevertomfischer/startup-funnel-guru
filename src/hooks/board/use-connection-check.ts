
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function useConnectionCheck() {
  const [connectionError, setConnectionError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [statusesCount, setStatusesCount] = useState(0);

  // Check Supabase connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsRetrying(true);
        
        // Simple query to test connection and fetch statuses
        console.log("Verificando conexão com Supabase...");
        
        // Primeiro vamos verificar se conseguimos nos conectar ao banco
        const healthCheck = await supabase.from('statuses').select('count');
        
        if (healthCheck.error) {
          console.error('Erro na verificação de saúde do Supabase:', healthCheck.error);
          setConnectionError(true);
          toast({
            title: "Erro de conexão",
            description: "Não foi possível conectar ao banco de dados. Verifique sua conexão com a internet.",
            variant: "destructive",
          });
          return;
        }
        
        // Agora vamos buscar todos os status para verificar se existem dados
        const { data, error } = await supabase.from('statuses').select('*');
        
        if (error) {
          console.error('Erro ao buscar statuses do Supabase:', error);
          setConnectionError(true);
          toast({
            title: "Erro de conexão",
            description: "Não foi possível buscar dados do banco. Verifique suas permissões.",
            variant: "destructive",
          });
        } else {
          console.log('Conexão Supabase bem-sucedida, encontrados statuses:', data?.length || 0);
          setStatusesCount(data?.length || 0);
          setConnectionError(false);
          
          // Se não há status, vamos imprimir um aviso
          if (!data || data.length === 0) {
            console.warn('Nenhum status encontrado no banco de dados.');
            
            // Vamos verificar se há startups diretamente
            const { data: startups, error: startupError } = await supabase
              .from('startups')
              .select('count');
              
            if (startupError) {
              console.error('Erro ao verificar startups:', startupError);
            } else {
              console.log('Encontradas startups no banco:', startups);
            }
          } else {
            // Verificamos cada status para ter certeza que está correto
            data.forEach(status => {
              console.log(`Status encontrado: ${status.name} (${status.id})`);
            });
            
            // Agora vamos verificar se há startups para o primeiro status
            if (data.length > 0) {
              const firstStatusId = data[0].id;
              const { data: startups, error: startupError } = await supabase
                .from('startups')
                .select('*')
                .eq('status_id', firstStatusId);
              
              if (startupError) {
                console.error(`Erro ao verificar startups para o status ${firstStatusId}:`, startupError);
              } else {
                console.log(`Encontradas ${startups?.length || 0} startups para o status ${firstStatusId}`);
                if (startups && startups.length > 0) {
                  console.log('Exemplo de startup:', {
                    id: startups[0].id,
                    name: startups[0].name,
                    status_id: startups[0].status_id
                  });
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Erro inesperado ao verificar conexão com Supabase:', error);
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
    statusesCount,
    handleRetryConnection
  };
}
