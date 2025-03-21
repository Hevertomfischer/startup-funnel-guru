
import { supabase, handleError } from '../../base-service';
import type { Startup } from '@/integrations/supabase/client';
import { applyExponentialBackoff } from './utils';

/**
 * Busca uma única startup por ID
 * @param id O ID da startup a buscar
 * @returns Uma promise que resolve para uma startup ou null se não encontrada
 */
export const getStartup = async (id: string): Promise<Startup | null> => {
  try {
    if (!id) {
      console.error(`ID de startup inválido: ${id}`);
      return null;
    }
    
    console.log(`Buscando startup com ID: ${id}`);
    
    // Usar a técnica de exponential backoff para retry
    let attempts = 0;
    let data;
    let error;
    
    while (attempts < 3) {
      console.log(`Tentativa ${attempts + 1} de buscar startup ${id}`);
      
      const result = await supabase
        .from('startups')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
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
      console.error(`Erro ao buscar startup ${id} após múltiplas tentativas:`, error);
      throw error;
    }
    
    if (data) {
      console.log(`Recuperada startup: ${data.name} (${id})`);
    } else {
      console.log(`Nenhuma startup encontrada com ID: ${id}`);
    }
    
    return data;
  } catch (error: any) {
    console.error(`Erro crítico em getStartup para ${id}:`, error);
    handleError(error, 'Falha ao buscar startup');
    return null;
  }
};
