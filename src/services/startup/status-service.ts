
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
    if (!uuidPattern.test(id) || !uuidPattern.test(newStatusId)) {
      throw new Error(`Invalid UUID format: ${!uuidPattern.test(id) ? 'startup ID' : 'status ID'}`);
    }
    
    console.log(`Updating startup ${id} status from ${oldStatusId} to ${newStatusId}`);
    
    // Create a minimal update with only the status_id field
    // IMPORTANT: Don't set changed_by here - the database trigger will handle this automatically
    // using the auth context from the JWT
    const updateData = { 
      status_id: newStatusId
    };
    
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
