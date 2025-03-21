
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks all statuses in the database for debugging purposes
 */
export const checkAllStatuses = async () => {
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
