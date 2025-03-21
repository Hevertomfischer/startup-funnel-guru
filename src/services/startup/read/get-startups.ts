
import { supabase, handleError } from '../../base-service';
import type { Startup } from '@/integrations/supabase/client';
import { applyExponentialBackoff } from './utils';

/**
 * Busca todas as startups do banco de dados
 * @returns Uma promise que resolve para um array de startups
 */
export const getStartups = async (): Promise<Startup[]> => {
  try {
    console.log('Buscando todas as startups');
    
    // Usar a técnica de exponential backoff para retry
    let attempts = 0;
    let data;
    let error;
    
    while (attempts < 3) {
      console.log(`Tentativa ${attempts + 1} de buscar todas as startups`);
      
      const result = await supabase
        .from('startups')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (result.error) {
        error = result.error;
        console.error(`Erro na tentativa ${attempts + 1}:`, error);
        attempts++;
        await applyExponentialBackoff(attempts);
      } else {
        data = result.data;
        error = null;
        break;
      }
    }
    
    if (error) {
      console.error('Erro ao buscar todas as startups após múltiplas tentativas:', error);
      throw error;
    }
    
    console.log(`Recuperadas ${data?.length || 0} startups`);
    return data || [];
  } catch (error: any) {
    console.error('Erro crítico em getStartups:', error);
    handleError(error, 'Falha ao buscar startups');
    return [];
  }
};
