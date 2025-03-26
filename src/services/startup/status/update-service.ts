
import { handleError } from '@/services/base-service';
import { toast } from 'sonner';
import type { Startup } from '@/integrations/supabase/client';
import { 
  isValidUUID, 
  sanitizeId, 
  verifyStatusExists, 
  verifyStartupExists,
  mapStatusSlugToUUID
} from './validators';
import { logStatusUpdateStart } from './logs';
import { 
  updateViaRpcFunction, 
  updateViaDirectUpdate, 
  updateViaPreparedData 
} from './update-methods';

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
    logStatusUpdateStart(id, newStatusId, oldStatusId);
    
    // CRITICAL: Early defensive validation (1st Layer)
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('ID da startup inválido ou vazio');
    }
    
    if (!newStatusId || typeof newStatusId !== 'string' || newStatusId.trim() === '') {
      throw new Error('ID do status inválido ou vazio');
    }
    
    // Trim and sanitize all inputs (2nd Layer of validation)
    id = sanitizeId(id) || '';
    newStatusId = sanitizeId(newStatusId) || '';
    if (oldStatusId) oldStatusId = sanitizeId(oldStatusId);
    
    // *** CRITICAL FIX: Absolute guard against null status_id ***
    if (!newStatusId) {
      console.error('CRITICAL SAFETY CHECK TRIGGERED: Attempt to set null status_id prevented');
      throw new Error('Não é possível definir um status nulo. Esta operação foi bloqueada por razões de segurança.');
    }
    
    // Check if newStatusId might be a slug and try to convert it (3rd layer)
    if (!isValidUUID(newStatusId)) {
      console.log(`Status ID "${newStatusId}" appears to be a slug, attempting to map to UUID`);
      const mappedStatusId = await mapStatusSlugToUUID(newStatusId);
      if (mappedStatusId) {
        console.log(`Successfully mapped "${newStatusId}" to UUID: ${mappedStatusId}`);
        newStatusId = mappedStatusId;
      } else {
        throw new Error(`Formato de status inválido e não pôde ser convertido: ${newStatusId}`);
      }
    }
    
    // UUID validation (4th Layer of validation)
    if (!isValidUUID(id)) {
      throw new Error(`Formato UUID inválido para ID da startup: ${id}`);
    }
    
    if (!isValidUUID(newStatusId)) {
      throw new Error(`Formato UUID inválido para ID do status: ${newStatusId}`);
    }
    
    if (oldStatusId && !isValidUUID(oldStatusId)) {
      console.warn(`Formato UUID inválido para ID do status anterior: ${oldStatusId}. Prosseguindo sem rastrear o status anterior.`);
      oldStatusId = undefined;
    }
    
    console.log(`VALIDATED VALUES: Atualizando startup ${id} de ${oldStatusId || 'desconhecido'} para ${newStatusId}`);
    
    // CRITICAL: Double-check that statuses table contains this ID before proceeding (5th Layer)
    const statusExists = await verifyStatusExists(newStatusId);
    if (!statusExists) {
      const errorMsg = `Status não encontrado: ${newStatusId}`;
      toast.error(`Falha ao atualizar status: ${errorMsg}`);
      throw new Error(errorMsg);
    }
    
    // Verify startup exists and get current status (6th Layer)
    const { exists, currentStatusId } = await verifyStartupExists(id);
    if (!exists) {
      const errorMsg = `Startup não encontrada: ${id}`;
      toast.error(`Falha ao atualizar status: ${errorMsg}`);
      throw new Error(errorMsg);
    }
    
    // If oldStatusId wasn't provided, get it from the startup
    if (!oldStatusId && currentStatusId) {
      oldStatusId = currentStatusId;
      console.log(`Obtido oldStatusId do banco de dados: ${oldStatusId}`);
    }
    
    // If the status hasn't changed, no update needed
    if (currentStatusId === newStatusId) {
      console.log('Status já está definido para este valor, pulando atualização');
      return { id, status_id: newStatusId } as Startup;
    }
    
    // Double-check newStatusId is never null at this point (7th Layer)
    if (!newStatusId) {
      const criticalError = 'ERRO CRÍTICO: newStatusId é null após validação';
      console.error(criticalError);
      throw new Error(criticalError);
    }
    
    // APPROACH 1: Try RPC function first (most reliable)
    try {
      return await updateViaRpcFunction(id, newStatusId, oldStatusId);
    }
    catch (rpcError) {
      console.error('Falha ao atualizar status via função RPC, tentando método alternativo', rpcError);
      
      // APPROACH 2: Try direct status_id update
      try {
        return await updateViaDirectUpdate(id, newStatusId);
      }
      catch (directUpdateError) {
        console.error('Falha ao atualizar status diretamente, tentando método final', directUpdateError);
        
        // APPROACH 3: Final fallback using prepareStartupData
        return await updateViaPreparedData(id, newStatusId);
      }
    }
  } catch (error: any) {
    console.error('Erro na função updateStartupStatus:', error);
    handleError(error, 'Falha ao atualizar status da startup');
    throw error;
  }
};
