
import { supabase } from '@/integrations/supabase/client';

/**
 * Direct function to fetch startups by status for debugging purposes
 */
export const directFetchStartupsByStatus = async (statusId: string) => {
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
