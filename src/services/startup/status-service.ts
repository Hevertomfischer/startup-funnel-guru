
import { supabase, handleError } from '../base-service';
import type { Startup } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { prepareStartupData } from './utils/prepare-data';

/**
 * Updates just the status of a startup - this is a specialized function for drag & drop
 * operations which need to only update the status field 
 */
export const updateStartupStatus = async (
  id: string, 
  newStatusId: string, 
  oldStatusId?: string
): Promise<Startup | null> => {
  try {
    console.log(`updateStartupStatus called with id: ${id}, newStatusId: ${newStatusId}, oldStatusId: ${oldStatusId || 'unknown'}`);
    
    // CRITICAL: Early defensive validation
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('ID da startup inválido ou vazio');
    }
    
    if (!newStatusId || typeof newStatusId !== 'string' || newStatusId.trim() === '') {
      throw new Error('ID do status inválido ou vazio');
    }
    
    // Trim and sanitize all inputs
    id = id.trim();
    newStatusId = newStatusId.trim();
    if (oldStatusId) oldStatusId = oldStatusId.trim();
    
    // Validação do formato UUID
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(id)) {
      throw new Error(`Formato UUID inválido para ID da startup: ${id}`);
    }
    
    if (!uuidPattern.test(newStatusId)) {
      throw new Error(`Formato UUID inválido para ID do status: ${newStatusId}`);
    }
    
    if (oldStatusId && !uuidPattern.test(oldStatusId)) {
      console.warn(`Formato UUID inválido para ID do status anterior: ${oldStatusId}. Prosseguindo sem rastrear o status anterior.`);
      oldStatusId = undefined;
    }
    
    console.log(`Atualizando startup ${id} de ${oldStatusId || 'desconhecido'} para ${newStatusId}`);
    
    // CRITICAL: Double-check that statuses table contains this ID before proceeding
    const { data: statusCheck, error: statusError } = await supabase
      .from('statuses')
      .select('id, name')
      .eq('id', newStatusId)
      .single();
      
    if (statusError || !statusCheck) {
      console.error('ID do status inválido, não existe no banco de dados:', newStatusId);
      toast.error(`Falha ao atualizar status: Status não existe`);
      return null;
    }
    
    console.log(`Status verificado e existe: ${statusCheck.name} (${statusCheck.id})`);
    
    // Verificar se a startup existe e obter seu status atual
    const { data: startupCheck, error: startupError } = await supabase
      .from('startups')
      .select('id, status_id, name')
      .eq('id', id)
      .single();
      
    if (startupError || !startupCheck) {
      console.error('Startup não existe:', id);
      toast.error(`Falha ao atualizar status: Startup não existe`);
      return null;
    }
    
    console.log(`Startup verificada: ${startupCheck.name} (${startupCheck.id}), status atual: ${startupCheck.status_id || 'nenhum'}`);
    
    // Se oldStatusId não foi fornecido, obter da startup
    if (!oldStatusId && startupCheck.status_id) {
      oldStatusId = startupCheck.status_id;
      console.log(`Obtido oldStatusId do banco de dados: ${oldStatusId}`);
    }
    
    // Se o status não mudou, não fazer atualização
    if (startupCheck.status_id === newStatusId) {
      console.log('Status já está definido para este valor, pulando atualização');
      return startupCheck as Startup;
    }
    
    // APPROACH 1: Try direct update first via RPC (safest approach)
    console.log('Tentando update via RPC function com parâmetros:', {
      p_startup_id: id,
      p_new_status_id: newStatusId,
      p_old_status_id: oldStatusId || null
    });
    
    const { data: updateResult, error: updateError } = await supabase
      .rpc('update_startup_status_safely', { 
        p_startup_id: id,
        p_new_status_id: newStatusId,
        p_old_status_id: oldStatusId || null
      });
    
    if (updateError) {
      console.error('Falha ao atualizar status via função RPC:', updateError);
      
      // APPROACH 2: Try direct update to status_id field only as fallback
      console.log('Tentando método alternativo de atualização direta...');
      
      // IMPORTANT: Handle status_id update directly to avoid any potential issues with prepareStartupData
      const { data: directUpdateData, error: directUpdateError } = await supabase
        .from('startups')
        .update({ status_id: newStatusId })
        .eq('id', id)
        .select('*')
        .single();
      
      if (directUpdateError) {
        console.error('Falha ao atualizar status diretamente:', directUpdateError);
        
        // APPROACH 3: Try using prepareStartupData as last resort
        console.log('Tentando método final com prepareStartupData...');
        
        const rawUpdateData = { 
          status_id: newStatusId,
          isStatusUpdate: true  
        };
        
        // Preparar dados para garantir que enviamos apenas campos válidos
        const updateData = prepareStartupData(rawUpdateData);
        
        console.log('UPDATE DATA ANTES DO UPDATE:', updateData);
        
        // Verificar explicitamente o valor de status_id
        if (!updateData.status_id || updateData.status_id !== newStatusId) {
          console.error('Erro: UpdateData.status_id não corresponde ao newStatusId');
          throw new Error('Falha na preparação dos dados para atualização');
        }
        
        // Atualizar apenas o campo status_id
        const { data, error } = await supabase
          .from('startups')
          .update(updateData)
          .eq('id', id)
          .select('*')
          .single();
        
        if (error) {
          console.error('Todas as abordagens falharam. Falha ao atualizar status da startup:', error);
          throw error;
        }
        
        console.log('Status da startup atualizado com sucesso (método fallback):', data);
        return data as Startup;
      }
      
      console.log('Status da startup atualizado com sucesso (método direto):', directUpdateData);
      return directUpdateData as Startup;
    }
    
    console.log('Status da startup atualizado com sucesso via RPC:', updateResult);
    
    // Recuperar a startup atualizada
    const { data: updatedStartup, error: fetchError } = await supabase
      .from('startups')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError) {
      console.error('Falha ao recuperar startup após atualização:', fetchError);
      throw fetchError;
    }
    
    return updatedStartup as Startup;
  } catch (error: any) {
    console.error('Erro na função updateStartupStatus:', error);
    handleError(error, 'Falha ao atualizar status da startup');
    throw error;
  }
};
