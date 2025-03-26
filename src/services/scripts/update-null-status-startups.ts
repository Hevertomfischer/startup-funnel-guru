
import { supabase } from '@/services/base-service';

// Function to find a "declined" or similar status to use as fallback
const getFallbackStatusId = async (): Promise<string | null> => {
  try {
    // Try to find a status with "recusado", "declined" or similar in the name
    const { data, error } = await supabase
      .from('statuses')
      .select('id, name')
      .or('name.ilike.%recusado%,name.ilike.%declined%,name.ilike.%rejected%')
      .limit(1);
    
    if (error) {
      console.error('Erro ao buscar status de fallback:', error);
      return null;
    }
    
    if (data && data.length > 0) {
      console.log('Status de fallback encontrado:', data[0]);
      return data[0].id;
    }
    
    // If no specific decline status is found, get the first available status
    const { data: allStatuses, error: allStatusesError } = await supabase
      .from('statuses')
      .select('id')
      .limit(1);
    
    if (allStatusesError) {
      console.error('Erro ao buscar qualquer status:', allStatusesError);
      return null;
    }
    
    if (allStatuses && allStatuses.length > 0) {
      console.log('Usando primeiro status disponível como fallback:', allStatuses[0]);
      return allStatuses[0].id;
    }
    
    return null;
  } catch (error) {
    console.error('Erro inesperado ao buscar status de fallback:', error);
    return null;
  }
};

// Main function to update startups with null status
export const updateAllNullStatusToDeclined = async (): Promise<{updated: number}> => {
  try {
    console.log('Iniciando correção de startups com status null...');
    
    // First, check if there are startups with null status_id
    const { data: startupsWithNullStatus, error: checkError } = await supabase
      .from('startups')
      .select('id, name')
      .is('status_id', null);
    
    if (checkError) {
      console.error('Erro ao verificar startups com status nulo:', checkError);
      throw checkError;
    }
    
    // If no startups with null status, return
    if (!startupsWithNullStatus || startupsWithNullStatus.length === 0) {
      console.log('Nenhuma startup com status nulo encontrada.');
      return { updated: 0 };
    }
    
    console.log(`Encontradas ${startupsWithNullStatus.length} startups com status nulo:`, startupsWithNullStatus);
    
    // Get a status to use as fallback
    const fallbackStatusId = await getFallbackStatusId();
    
    if (!fallbackStatusId) {
      console.error('Não foi possível encontrar um status válido para atualização.');
      throw new Error('Nenhum status válido disponível para corrigir startups.');
    }
    
    // IMPORTANT: Using the RPC function to ensure history is updated correctly
    // This triggers database triggers to maintain history records
    for (const startup of startupsWithNullStatus) {
      console.log(`Atualizando startup ${startup.id} (${startup.name}) para status ${fallbackStatusId}`);
      
      const { data, error } = await supabase
        .rpc('update_startup_status_safely', {
          p_startup_id: startup.id,
          p_new_status_id: fallbackStatusId,
          p_old_status_id: null
        });
      
      if (error) {
        console.error(`Erro ao atualizar startup ${startup.id}:`, error);
        // Continue with other startups in case of error
      } else {
        console.log(`Startup ${startup.id} atualizada com sucesso:`, data);
      }
    }
    
    // Return the number of startups updated
    return { updated: startupsWithNullStatus.length };
  } catch (error) {
    console.error('Erro ao atualizar startups com status nulo:', error);
    throw error;
  }
};
