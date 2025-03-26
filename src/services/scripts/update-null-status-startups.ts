
import { supabase } from '@/services/base-service';

// Função para buscar um status de "recusado" ou similar para usar como fallback
const getFallbackStatusId = async (): Promise<string | null> => {
  try {
    // Tenta encontrar um status com "recusado", "declined" ou similar no nome
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
    
    // Se não encontrar um status específico de recusa, pega o primeiro status disponível
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

// Função principal para atualizar startups com status nulo
export const updateAllNullStatusToDeclined = async (): Promise<{updated: number}> => {
  try {
    console.log('Iniciando correção de startups com status null...');
    
    // Primeiro, verifica se existem startups com status_id nulo
    const { data: startupsWithNullStatus, error: checkError } = await supabase
      .from('startups')
      .select('id, name')
      .is('status_id', null);
    
    if (checkError) {
      console.error('Erro ao verificar startups com status nulo:', checkError);
      throw checkError;
    }
    
    // Se não houver startups com status nulo, retorna
    if (!startupsWithNullStatus || startupsWithNullStatus.length === 0) {
      console.log('Nenhuma startup com status nulo encontrada.');
      return { updated: 0 };
    }
    
    console.log(`Encontradas ${startupsWithNullStatus.length} startups com status nulo:`, startupsWithNullStatus);
    
    // Busca um status para usar como fallback
    const fallbackStatusId = await getFallbackStatusId();
    
    if (!fallbackStatusId) {
      console.error('Não foi possível encontrar um status válido para atualização.');
      throw new Error('Nenhum status válido disponível para corrigir startups.');
    }
    
    // IMPORTANTE: Usando a função RPC para garantir que o histórico seja atualizado corretamente
    // Isso aciona os triggers do banco de dados para manter os registros de histórico
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
        // Continua com as outras startups em caso de erro
      } else {
        console.log(`Startup ${startup.id} atualizada com sucesso:`, data);
      }
    }
    
    // Retorna o número de startups atualizadas
    return { updated: startupsWithNullStatus.length };
  } catch (error) {
    console.error('Erro ao atualizar startups com status nulo:', error);
    throw error;
  }
};
