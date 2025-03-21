
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function useConnectionCheck() {
  const { toast } = useToast();
  const [connectionError, setConnectionError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [statusesCount, setStatusesCount] = useState(0);
  const [connectionDetails, setConnectionDetails] = useState<{
    lastAttempt: string;
    attemptCount: number;
    errorMessage?: string;
    hasStatusTable: boolean;
    hasStartupsTable: boolean;
  }>({
    lastAttempt: new Date().toISOString(),
    attemptCount: 0,
    hasStatusTable: false,
    hasStartupsTable: false
  });

  // Check Supabase connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsRetrying(true);
        const now = new Date().toISOString();
        setConnectionDetails(prev => ({
          ...prev,
          lastAttempt: now,
          attemptCount: prev.attemptCount + 1
        }));
        
        // Verificação detalhada do estado da conexão
        console.log("Verificando detalhes da conexão com Supabase...");
        
        // Primeiro, verificação básica de conectividade
        const healthCheck = await supabase.from('statuses').select('count');
        
        if (healthCheck.error) {
          console.error('Erro na verificação de saúde do Supabase:', healthCheck.error);
          setConnectionError(true);
          setConnectionDetails(prev => ({
            ...prev,
            errorMessage: healthCheck.error.message,
            hasStatusTable: false
          }));
          
          toast({
            title: "Erro de conexão",
            description: `Não foi possível conectar ao banco de dados: ${healthCheck.error.message}`,
            variant: "destructive",
          });
          return;
        }
        
        // Se chegamos aqui, a conexão básica está funcionando
        setConnectionDetails(prev => ({
          ...prev,
          hasStatusTable: true
        }));
        
        // Agora, verificar a tabela startups
        const startupsCheck = await supabase.from('startups').select('count');
        
        if (startupsCheck.error) {
          console.error('Erro ao verificar tabela startups:', startupsCheck.error);
          setConnectionDetails(prev => ({
            ...prev,
            hasStartupsTable: false
          }));
        } else {
          setConnectionDetails(prev => ({
            ...prev,
            hasStartupsTable: true
          }));
        }
        
        // Agora vamos buscar todos os status para verificar se existem dados
        const { data, error } = await supabase.from('statuses').select('*');
        
        if (error) {
          console.error('Erro ao buscar statuses do Supabase:', error);
          setConnectionError(true);
          setConnectionDetails(prev => ({
            ...prev,
            errorMessage: error.message
          }));
          
          toast({
            title: "Erro de conexão",
            description: "Não foi possível buscar dados do banco. Verifique suas permissões.",
            variant: "destructive",
          });
        } else {
          console.log('Conexão Supabase bem-sucedida, encontrados statuses:', data?.length || 0);
          setStatusesCount(data?.length || 0);
          setConnectionError(false);
          
          // Registrar todos os status encontrados
          if (data && data.length > 0) {
            console.log('Status disponíveis:', data.map(s => ({ id: s.id, name: s.name, position: s.position })));
            
            // Para cada status, verificar se há startups
            for (const status of data) {
              const { data: startups } = await supabase
                .from('startups')
                .select('count')
                .eq('status_id', status.id);
              
              const count = startups?.[0]?.count || 0;
              console.log(`Status "${status.name}" (${status.id}): ${count} startups`);
            }
          } else {
            console.warn('Nenhum status encontrado no banco de dados. O quadro não poderá ser exibido.');
            toast({
              title: "Banco sem dados",
              description: "Nenhum status encontrado no banco. Adicione uma coluna para começar.",
              duration: 5000,
            });
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Erro inesperado ao verificar conexão com Supabase:', error);
        setConnectionError(true);
        setConnectionDetails(prev => ({
          ...prev,
          errorMessage
        }));
        
        toast({
          title: "Erro de conexão",
          description: `Erro inesperado: ${errorMessage}`,
          variant: "destructive",
        });
      } finally {
        setIsRetrying(false);
      }
    };
    
    checkConnection();
  }, [toast]);

  const handleRetryConnection = () => {
    window.location.href = '/diagnostico';
  };

  return {
    connectionError,
    isRetrying,
    statusesCount,
    connectionDetails,
    handleRetryConnection
  };
}
