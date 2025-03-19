
import { supabase } from '@/services/base-service';
import { prepareStartupData } from '../utils/prepare-data';
import type { Startup } from '@/integrations/supabase/client';
import { logUpdateAttempt, logUpdateSuccess, logUpdateFailure } from './logs';

/**
 * Updates status via RPC function - most reliable method
 */
export const updateViaRpcFunction = async (
  startupId: string,
  newStatusId: string,
  oldStatusId?: string
): Promise<Startup | null> => {
  try {
    logUpdateAttempt('RPC function', {
      p_startup_id: startupId,
      p_new_status_id: newStatusId,
      p_old_status_id: oldStatusId || null
    });
    
    const { data: updateResult, error: updateError } = await supabase
      .rpc('update_startup_status_safely', { 
        p_startup_id: startupId,
        p_new_status_id: newStatusId,
        p_old_status_id: oldStatusId || null
      });
    
    if (updateError) {
      throw updateError;
    }
    
    logUpdateSuccess('RPC', updateResult);
    
    // Fetch the updated startup after RPC success
    const { data: updatedStartup, error: fetchError } = await supabase
      .from('startups')
      .select('*')
      .eq('id', startupId)
      .single();
      
    if (fetchError) {
      console.error('Falha ao recuperar startup após atualização:', fetchError);
      throw fetchError;
    }
    
    return updatedStartup as Startup;
  } catch (error) {
    logUpdateFailure('RPC function', error);
    throw error;
  }
};

/**
 * Updates status via direct database update - fallback method 1
 */
export const updateViaDirectUpdate = async (
  startupId: string,
  newStatusId: string
): Promise<Startup | null> => {
  try {
    logUpdateAttempt('método direto', { status_id: newStatusId });
    
    const { data, error } = await supabase
      .from('startups')
      .update({ status_id: newStatusId })
      .eq('id', startupId)
      .select('*')
      .single();
    
    if (error) {
      throw error;
    }
    
    logUpdateSuccess('método direto', data);
    return data as Startup;
  } catch (error) {
    logUpdateFailure('método direto', error);
    throw error;
  }
};

/**
 * Updates status via prepared data - final fallback method 
 */
export const updateViaPreparedData = async (
  startupId: string,
  newStatusId: string
): Promise<Startup | null> => {
  try {
    // Special payload for status update only
    const safeStatusUpdatePayload = {
      status_id: newStatusId,
      isStatusUpdate: true
    };
    
    logUpdateAttempt('método fallback', safeStatusUpdatePayload);
    
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
      .eq('id', startupId)
      .select('*')
      .single();
    
    if (error) {
      throw error;
    }
    
    logUpdateSuccess('método fallback', data);
    return data as Startup;
  } catch (error) {
    logUpdateFailure('método fallback', error);
    throw error;
  }
};
