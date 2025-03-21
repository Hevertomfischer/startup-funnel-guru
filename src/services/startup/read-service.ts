
import { supabase, handleError } from '../base-service';
import type { Startup } from '@/integrations/supabase/client';

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
        await new Promise(r => setTimeout(r, 500 * Math.pow(2, attempts)));
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
    let statusCheckAttempts = 0;
    let statusFound = false;
    let statusName = '';
    
    while (statusCheckAttempts < 3 && !statusFound) {
      console.log(`Verificando existência do status ${statusId} (tentativa ${statusCheckAttempts + 1})`);
      
      const { data: statusCheck, error: statusError } = await supabase
        .from('statuses')
        .select('id, name')
        .eq('id', statusId)
        .maybeSingle();
      
      if (statusError) {
        console.warn(`Erro ao verificar status ${statusId} (tentativa ${statusCheckAttempts + 1}):`, statusError);
        statusCheckAttempts++;
        await new Promise(r => setTimeout(r, 200 * Math.pow(2, statusCheckAttempts)));
      } else if (statusCheck) {
        console.log(`Status encontrado: ${statusCheck.name} (${statusId})`);
        statusFound = true;
        statusName = statusCheck.name;
      } else {
        console.warn(`Status com ID ${statusId} não encontrado (tentativa ${statusCheckAttempts + 1})`);
        statusCheckAttempts++;
        await new Promise(r => setTimeout(r, 200 * Math.pow(2, statusCheckAttempts)));
      }
    }
    
    if (!statusFound) {
      console.error(`Status com ID ${statusId} não encontrado após ${statusCheckAttempts} tentativas`);
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
        await new Promise(r => setTimeout(r, 500 * Math.pow(2, attempts)));
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
        await new Promise(r => setTimeout(r, 500 * Math.pow(2, attempts)));
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
