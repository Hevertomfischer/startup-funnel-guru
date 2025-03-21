
import { useQuery } from '@tanstack/react-query';
import { 
  getStartups, 
  getStartupsByStatus,
  getStartup,
} from '@/services';
import { supabase } from '@/integrations/supabase/client';

// Função direta para buscar startups por status (para debugging)
const directFetchStartupsByStatus = async (statusId: string) => {
  console.log(`Buscando diretamente startups para status ID: ${statusId}`);
  
  try {
    // Verificar se o statusId é válido primeiro
    if (!statusId || statusId.startsWith('placeholder-')) {
      console.log(`ID de status inválido ou placeholder: ${statusId}`);
      return [];
    }
    
    // Log mais detalhado sobre o que estamos tentando buscar
    console.log(`Tentando consulta Supabase: FROM 'startups' WHERE status_id = '${statusId}'`);
    
    // Verificar se o status existe antes de buscar
    const statusCheck = await supabase
      .from('statuses')
      .select('name')
      .eq('id', statusId)
      .maybeSingle();
      
    if (statusCheck.error) {
      console.error(`Erro ao verificar se status ${statusId} existe:`, statusCheck.error);
    } else if (!statusCheck.data) {
      console.warn(`Status com ID ${statusId} não encontrado no banco de dados`);
    } else {
      console.log(`Status confirmado: ${statusCheck.data.name} (${statusId})`);
    }
    
    // Buscar as startups com retry
    let attempts = 0;
    let data;
    let error;
    
    while (attempts < 3) {
      const result = await supabase
        .from('startups')
        .select('*')
        .eq('status_id', statusId);
        
      if (result.error) {
        error = result.error;
        console.error(`Tentativa ${attempts + 1}: Erro ao buscar startups para status ${statusId}:`, error);
        attempts++;
        // Esperar um pouco antes de tentar novamente (backoff exponencial)
        await new Promise(r => setTimeout(r, 500 * Math.pow(2, attempts)));
      } else {
        data = result.data;
        error = null;
        break;
      }
    }
    
    if (error) {
      console.error(`Falha em todas as tentativas para status ${statusId}:`, error);
      throw error;
    }
    
    // Log mais detalhado com detalhes sobre a resposta
    console.log(`Resultado da consulta direta para status ${statusId}:`, {
      count: data?.length || 0,
      firstItem: data && data.length > 0 ? {
        id: data[0].id,
        name: data[0].name,
        status_id: data[0].status_id
      } : null,
      allIds: data ? data.map(s => s.id) : []
    });
    
    return data || [];
  } catch (e) {
    console.error(`Erro crítico em directFetchStartupsByStatus para status ${statusId}:`, e);
    throw e;
  }
};

// Busca todos os status para verificar se existem
const checkAllStatuses = async () => {
  try {
    console.log('Buscando todos os statuses para verificar a conexão com o banco');
    const { data, error } = await supabase
      .from('statuses')
      .select('*')
      .order('position', { ascending: true });
      
    if (error) {
      console.error('Erro ao buscar statuses:', error);
      throw error;
    }
    
    console.log(`Encontrados ${data?.length || 0} statuses no banco de dados`);
    if (data && data.length > 0) {
      console.log('Status disponíveis:', data.map(s => ({ id: s.id, name: s.name, position: s.position })));
    }
    return data || [];
  } catch (e) {
    console.error('Erro crítico ao buscar statuses:', e);
    throw e;
  }
};

// Queries básicas para startups
export const useStartupsQuery = () => {
  return useQuery({
    queryKey: ['startups'],
    queryFn: getStartups,
    retry: 3,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000) // backoff exponencial
  });
};

export const useStartupsByStatusQuery = (statusId: string) => {
  // Verificar se é um ID de placeholder (para renderização condicional)
  const isPlaceholder = statusId.startsWith('placeholder-');
  
  return useQuery({
    queryKey: ['startups', 'status', statusId],
    queryFn: async () => {
      console.log(`Executando função de query para status ${statusId}`);
      
      // Primeiro verificar se podemos buscar status (teste de conexão)
      if (!isPlaceholder) {
        try {
          await checkAllStatuses();
        } catch (error) {
          console.error('Falha ao verificar conexão com o banco:', error);
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
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000), // Backoff exponencial
  });
};

export const useStartupQuery = (id?: string) => {
  return useQuery({
    queryKey: ['startup', id],
    queryFn: () => getStartup(id!),
    enabled: !!id,
    retry: 3,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000) // backoff exponencial
  });
};
