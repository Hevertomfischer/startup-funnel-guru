
import { useQuery } from '@tanstack/react-query';
import { getBackoffDelay, checkDatabaseTables, checkAllStatuses } from '../query-helpers';
import { directFetchStartupsByStatus } from './direct-fetch';

/**
 * Hook for fetching startups by their status
 */
export const useStartupsByStatusQuery = (statusId: string) => {
  // Verificar se é um ID de placeholder (para renderização condicional)
  const isPlaceholder = statusId.startsWith('placeholder-');
  
  return useQuery({
    queryKey: ['startups', 'status', statusId],
    queryFn: async () => {
      console.log(`Executando função de query para status ${statusId}`);
      
      // Primeiro verificar tabelas do banco (teste de estrutura)
      if (!isPlaceholder) {
        try {
          const dbCheck = await checkDatabaseTables();
          if (!dbCheck.allTablesExist) {
            console.error('Estrutura do banco incompleta:', dbCheck);
            throw new Error('Algumas tabelas essenciais não foram encontradas no banco');
          }
        } catch (error) {
          console.error('Falha ao verificar estrutura do banco:', error);
          // Continuar mesmo assim para dar uma chance à query principal
        }
      
        // Verificar status disponíveis (teste de dados)
        try {
          await checkAllStatuses();
        } catch (error) {
          console.error('Falha ao verificar status disponíveis:', error);
          // Continuar mesmo assim para dar uma chance à query principal
        }
      }
      
      // Usar a função de debugging para acesso direto ao Supabase
      return isPlaceholder ? [] : directFetchStartupsByStatus(statusId);
    },
    enabled: !!statusId && !isPlaceholder, // Não executar query para IDs de placeholder
    staleTime: isPlaceholder ? Infinity : 5000, // 5 segundos para queries reais
    gcTime: isPlaceholder ? 0 : 60000, // 1 minuto para queries reais
    refetchInterval: isPlaceholder ? false : 15000, // Refresh a cada 15 segundos
    retry: 3, // Aumentar retries para dar mais chances de conectar
    retryDelay: getBackoffDelay,
  });
};
