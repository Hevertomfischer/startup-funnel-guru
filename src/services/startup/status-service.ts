
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
    
    // CRITICAL: Early defensive validation (1st Layer)
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('ID da startup inválido ou vazio');
    }
    
    if (!newStatusId || typeof newStatusId !== 'string' || newStatusId.trim() === '') {
      throw new Error('ID do status inválido ou vazio');
    }
    
    // Log initial values before any modifications
    console.log('INITIAL VALUES BEFORE MODIFICATION:');
    console.log('- id:', id, typeof id);
    console.log('- newStatusId:', newStatusId, typeof newStatusId);
    console.log('- oldStatusId:', oldStatusId, typeof oldStatusId);
    
    // Trim and sanitize all inputs (2nd Layer of validation)
    id = id.trim();
    newStatusId = newStatusId.trim();
    if (oldStatusId) oldStatusId = oldStatusId.trim();
    
    // Validação do formato UUID (3rd Layer of validation)
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
    
    console.log(`VALIDATED VALUES: Atualizando startup ${id} de ${oldStatusId || 'desconhecido'} para ${newStatusId}`);
    
    // CRITICAL: Double-check that statuses table contains this ID before proceeding (4th Layer)
    const { data: statusCheck, error: statusError } = await supabase
      .from('statuses')
      .select('id, name')
      .eq('id', newStatusId)
      .single();
      
    if (statusError || !statusCheck) {
      console.error('ID do status inválido, não existe no banco de dados:', newStatusId);
      const errorMsg = `Status não encontrado: ${newStatusId}`;
      toast.error(`Falha ao atualizar status: ${errorMsg}`);
      throw new Error(errorMsg);
    }
    
    console.log(`Status verificado e existe: ${statusCheck.name} (${statusCheck.id})`);
    
    // Verificar se a startup existe e obter seu status atual (5th Layer)
    const { data: startupCheck, error: startupError } = await supabase
      .from('startups')
      .select('id, status_id, name')
      .eq('id', id)
      .single();
      
    if (startupError || !startupCheck) {
      console.error('Startup não existe:', id);
      const errorMsg = `Startup não encontrada: ${id}`;
      toast.error(`Falha ao atualizar status: ${errorMsg}`);
      throw new Error(errorMsg);
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
    
    // Double-check newStatusId is never null at this point (6th Layer)
    if (!newStatusId) {
      const criticalError = 'ERRO CRÍTICO: newStatusId é null após validação';
      console.error(criticalError);
      throw new Error(criticalError);
    }
    
    // CRITICAL UPDATE: Use only the status_id field for status update
    // Create a clean, safe update payload
    const safeStatusUpdatePayload = {
      status_id: newStatusId,
      isStatusUpdate: true
    };
    
    console.log('FINAL SAFE UPDATE PAYLOAD:', safeStatusUpdatePayload);
    
    // APPROACH 1: Try RPC function first
    try {
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
        throw updateError;
      }
      
      console.log('Status da startup atualizado com sucesso via RPC:', updateResult);
    }
    catch (rpcError) {
      console.error('Falha ao atualizar status via função RPC:', rpcError);
      
      // APPROACH 2: Try direct status_id update - Status update with ONLY the status_id field
      console.log('Tentando método alternativo de atualização direta com dados:', { status_id: newStatusId });
      
      const { data: directUpdateData, error: directUpdateError } = await supabase
        .from('startups')
        .update({ status_id: newStatusId })
        .eq('id', id)
        .select('*')
        .single();
      
      if (directUpdateError) {
        console.error('Falha ao atualizar status diretamente:', directUpdateError);
        
        // APPROACH 3: Final fallback - use prepareStartupData
        console.log('Tentando método final com prepareStartupData...');
        
        // This will trigger special handling in prepareStartupData for status update
        const updateData = prepareStartupData(safeStatusUpdatePayload);
        
        console.log('PROCESSED UPDATE DATA:', updateData);
        
        // FINAL VERIFICATION: Ensure status_id is set after processing
        if (!updateData || !updateData.status_id) {
          console.error('FATAL ERROR: updateData is missing status_id', updateData);
          throw new Error('Dados de atualização inválidos após processamento');
        }
        
        // Final attempt with minimal update
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
    
    // Fetch the updated startup after RPC success
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
