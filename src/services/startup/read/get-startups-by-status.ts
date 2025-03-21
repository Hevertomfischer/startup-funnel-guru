
import { supabase, handleError } from '../../base-service';
import type { Startup } from '@/integrations/supabase/client';
import { applyExponentialBackoff } from './utils';
import { verifyStatusExists } from './status-helpers';

/**
 * Busca startups filtradas por status
 * @param statusId O ID do status para filtrar
 * @returns Uma promise que resolve para um array de startups filtradas
 */
export const getStartupsByStatus = async (statusId: string): Promise<Startup[]> => {
  try {
    if (!statusId || statusId.startsWith('placeholder-')) {
      console.log(`Ignorando busca para status inválido: ${statusId}`);
      return [];
    }
    
    console.log(`Buscando startups para status: ${statusId}`);
    
    // Primeiro verificar se o status existe
    const { statusFound, statusName } = await verifyStatusExists(statusId);
    
    if (!statusFound) {
      console.error(`Status com ID ${statusId} não encontrado após múltiplas tentativas`);
      // Continuar mesmo assim, pois o erro pode ser por outro motivo
    }
    
    // Agora buscar as startups com retry
    let attempts = 0;
    let data;
    let error;
    
    while (attempts < 3) {
      console.log(`Buscando startups para status ${statusId} (${statusName || 'desconhecido'}) - Tentativa ${attempts + 1}`);
      
      const result = await supabase
        .from('startups')
        .select('*')
        .eq('status_id', statusId)
        .order('created_at', { ascending: false });
      
      if (result.error) {
        error = result.error;
        console.error(`Tentativa ${attempts + 1} falhou para status ${statusId}:`, error);
        attempts++;
        await applyExponentialBackoff(attempts);
      } else {
        data = result.data;
        error = null;
        break;
      }
    }
    
    if (error) {
      console.error(`Erro ao buscar startups para status ${statusId} após múltiplas tentativas:`, error);
      throw error;
    }
    
    console.log(`Recuperadas ${data?.length || 0} startups para status ${statusId}`);
    if (data && data.length > 0) {
      console.log(`Primeira startup para status ${statusId}:`, {
        id: data[0].id,
        name: data[0].name,
        created_at: data[0].created_at
      });
      
      // Listar IDs das startups para facilitar debugging
      console.log(`IDs das startups para status ${statusId}:`, data.map(s => s.id));
    } else {
      console.log(`Nenhuma startup encontrada para status ${statusId}`);
    }
    
    return data || [];
  } catch (error: any) {
    console.error(`Erro crítico em getStartupsByStatus para ${statusId}:`, error);
    handleError(error, 'Falha ao buscar startups por status');
    return [];
  }
};
