
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
      throw new Error(`Falha ao verificar status: ${statusCheck.error.message}`);
    } else if (!statusCheck.data) {
      console.warn(`Status com ID ${statusId} não encontrado no banco de dados`);
      throw new Error(`Status com ID ${statusId} não existe no banco de dados`);
    } else {
      console.log(`Status confirmado: ${statusCheck.data.name} (${statusId})`);
    }
    
    // Usar a técnica de exponential backoff para retry
    let attempts = 0;
    let lastError;
    
    while (attempts < 3) {
      try {
        console.log(`Tentativa ${attempts + 1} de buscar startups para status ${statusId}`);
        
        const result = await supabase
          .from('startups')
          .select('*')
          .eq('status_id', statusId);
          
        if (result.error) {
          console.error(`Erro na tentativa ${attempts + 1}:`, result.error);
          lastError = result.error;
          attempts++;
          await new Promise(r => setTimeout(r, 500 * Math.pow(2, attempts)));
          continue;
        }
        
        // Sucesso - registrar detalhes e retornar
        console.log(`Encontradas ${result.data?.length || 0} startups para status ${statusId}`);
        if (result.data && result.data.length > 0) {
          console.log(`Primeira startup: ${result.data[0].name} (${result.data[0].id})`);
        }
        
        return result.data || [];
      } catch (e) {
        console.error(`Erro na tentativa ${attempts + 1}:`, e);
        lastError = e;
        attempts++;
        await new Promise(r => setTimeout(r, 500 * Math.pow(2, attempts)));
      }
    }
    
    // Se chegamos aqui, todas as tentativas falharam
    throw lastError || new Error(`Falha ao buscar startups após ${attempts} tentativas`);
  } catch (e) {
    console.error(`Erro crítico em directFetchStartupsByStatus para status ${statusId}:`, e);
    throw e;
  }
};

// Busca todos os status para verificar se existem
const checkAllStatuses = async () => {
  try {
    console.log('Buscando todos os statuses para verificar a conexão com o banco');
    
    // Usar a técnica de exponential backoff para retry
    let attempts = 0;
    let lastError;
    
    while (attempts < 3) {
      try {
        const result = await supabase
          .from('statuses')
          .select('*')
          .order('position', { ascending: true });
          
        if (result.error) {
          console.error(`Erro na tentativa ${attempts + 1}:`, result.error);
          lastError = result.error;
          attempts++;
          await new Promise(r => setTimeout(r, 500 * Math.pow(2, attempts)));
          continue;
        }
        
        // Sucesso
        console.log(`Encontrados ${result.data?.length || 0} statuses no banco de dados`);
        if (result.data && result.data.length > 0) {
          console.log('Status disponíveis:', result.data.map(s => ({ 
            id: s.id, 
            name: s.name, 
            position: s.position 
          })));
        } else {
          console.warn('Nenhum status encontrado no banco de dados');
        }
        
        return result.data || [];
      } catch (e) {
        console.error(`Erro na tentativa ${attempts + 1}:`, e);
        lastError = e;
        attempts++;
        await new Promise(r => setTimeout(r, 500 * Math.pow(2, attempts)));
      }
    }
    
    // Se chegamos aqui, todas as tentativas falharam
    throw lastError || new Error(`Falha ao buscar statuses após ${attempts} tentativas`);
  } catch (e) {
    console.error('Erro crítico ao buscar statuses:', e);
    throw e;
  }
};

// Função para verificar a existência de tabelas no banco
export const checkDatabaseTables = async () => {
  try {
    console.log('Verificando a existência de tabelas no banco de dados');
    
    // Lista de tabelas essenciais para verificar
    const essentialTables = ['statuses', 'startups', 'team_members', 'attachments'] as const;
    const results: Record<string, boolean> = {};
    
    for (const table of essentialTables) {
      try {
        console.log(`Verificando tabela ${table}...`);
        const { error } = await supabase.from(table).select('count');
        
        if (error) {
          console.error(`Erro ao verificar tabela ${table}:`, error);
          results[table] = false;
        } else {
          console.log(`Tabela ${table} existe e está acessível`);
          results[table] = true;
        }
      } catch (e) {
        console.error(`Erro ao verificar tabela ${table}:`, e);
        results[table] = false;
      }
    }
    
    return {
      allTablesExist: Object.values(results).every(exists => exists),
      tables: results
    };
  } catch (e) {
    console.error('Erro ao verificar tabelas do banco:', e);
    return {
      allTablesExist: false,
      tables: {},
      error: e instanceof Error ? e.message : String(e)
    };
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
