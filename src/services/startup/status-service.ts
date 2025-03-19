
import { supabase, handleError } from '../base-service';
import type { Startup } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    
    // Validate inputs to avoid DB errors
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid startup ID');
    }
    
    if (!newStatusId || typeof newStatusId !== 'string') {
      throw new Error('Invalid status ID');
    }
    
    // UUID validation check - could be more thorough but this catches the basic issues
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(id)) {
      throw new Error(`Invalid UUID format for startup ID: ${id}`);
    }
    
    if (!uuidPattern.test(newStatusId)) {
      throw new Error(`Invalid UUID format for status ID: ${newStatusId}`);
    }
    
    if (oldStatusId && !uuidPattern.test(oldStatusId)) {
      console.warn(`Invalid UUID format for old status ID: ${oldStatusId}. Will proceed without tracking previous status.`);
      oldStatusId = undefined;
    }
    
    console.log(`Updating startup ${id} status from ${oldStatusId || 'unknown'} to ${newStatusId}`);
    
    // CRITICAL: Check if newStatusId is valid before proceeding
    const { data: statusCheck, error: statusError } = await supabase
      .from('statuses')
      .select('id')
      .eq('id', newStatusId)
      .single();
      
    if (statusError || !statusCheck) {
      console.error('Invalid status ID, does not exist in database:', newStatusId);
      toast.error(`Failed to update status: Status does not exist`);
      return null;
    }
    
    // If we're here, we also need to check if the startup exists
    const { data: startupCheck, error: startupError } = await supabase
      .from('startups')
      .select('id, status_id')
      .eq('id', id)
      .single();
      
    if (startupError || !startupCheck) {
      console.error('Startup does not exist:', id);
      toast.error(`Failed to update status: Startup does not exist`);
      return null;
    }
    
    // If oldStatusId wasn't provided, get it from the startup
    if (!oldStatusId && startupCheck.status_id) {
      oldStatusId = startupCheck.status_id;
      console.log(`Retrieved oldStatusId from database: ${oldStatusId}`);
    }
    
    // Create a minimal update with only the status_id field
    const updateData = { 
      status_id: newStatusId,
      // Add a flag that this is explicitly a status update
      // This is used in prepareStartupData to ensure we don't send null
      __is_status_update: true
    };
    
    // CRITICAL: Explicitly remove changed_by if it somehow exists
    // This ensures it will be set by the database trigger
    if ('changed_by' in updateData) {
      delete updateData.changed_by;
    }
    
    // CRITICAL: Ensure we never send null for status_id
    if (!updateData.status_id) {
      console.error('Attempted to update with null status_id, aborting operation');
      toast.error('Failed to update status: Invalid status');
      return null;
    }
    
    // If the startup doesn't have a status_id and we're about to set one,
    // we need to manually ensure a startup_status_history record exists
    // This handles the case where a startup was created without a status_id
    if (!startupCheck.status_id && newStatusId) {
      console.log('Startup has no previous status_id, will create initial history record');
      
      // Create a history record manually if needed
      try {
        const { error: historyError } = await supabase
          .from('startup_status_history')
          .insert({
            startup_id: id,
            status_id: newStatusId,
            previous_status_id: null,
            entered_at: new Date().toISOString()
          });
        
        if (historyError) {
          console.error('Failed to create initial status history record:', historyError);
          // Continue anyway as the update might still work
        }
      } catch (historyError) {
        console.error('Error creating history record:', historyError);
        // Continue anyway
      }
    }
    
    // Update just the status_id field
    const { data, error } = await supabase
      .from('startups')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Failed to update startup status:', error);
      toast.error(`Failed to update status: ${error.message}`);
      throw error;
    }
    
    console.log('Successfully updated startup status:', data);
    toast.success('Status updated successfully');
    return data;
  } catch (error: any) {
    console.error('Error in updateStartupStatus function:', error);
    handleError(error, 'Failed to update startup status');
    return null;
  }
};
