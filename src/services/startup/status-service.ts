
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
    
    // Create a minimal update with only the status_id field
    const updateData = { 
      status_id: newStatusId
    };
    
    // CRITICAL: Explicitly remove changed_by if it somehow exists
    // This ensures it will be set by the database trigger
    if ('changed_by' in updateData) {
      delete updateData.changed_by;
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
