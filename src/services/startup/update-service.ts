
import { supabase, handleError } from '../base-service';
import { toast } from 'sonner';
import type { Startup } from '@/integrations/supabase/client';
import { addAttachment } from '../attachment-service';
import { prepareStartupData } from './utils/prepare-data';

/**
 * Updates an existing startup in the database
 * For minimal updates like drag-and-drop status changes, prefer using updateStartupStatus
 */
export const updateStartup = async (
  id: string,
  startup: Partial<Startup> & { attachments?: any[] }
): Promise<Startup | null> => {
  try {
    console.log('updateStartup called with id:', id, 'and data:', startup);
    
    // Extract attachments from the input data (they aren't database fields)
    const { attachments, ...startupData } = startup;
    
    // CRITICAL: Always remove changed_by field completely
    if ('changed_by' in startupData) {
      delete startupData.changed_by;
    }
    
    // Prepare the data for update
    const preparedData = prepareStartupData(startupData);
    
    console.log('Prepared data for Supabase update:', preparedData);
    
    // IMPORTANT FIX: Check if we have any data to update
    if (Object.keys(preparedData).length === 0) {
      console.warn('No valid update data provided for startup:', id);
      return null;
    }
    
    // Update the startup in the database
    const { data, error } = await supabase
      .from('startups')
      .update(preparedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase update error:', error);
      toast.error(`Update failed: ${error.message}`);
      throw error;
    }
    
    console.log('Startup updated in Supabase:', data);
    
    // Handle attachments if provided
    if (attachments && attachments.length > 0) {
      for (const file of attachments) {
        if (!file.id) {
          await addAttachment({
            startup_id: id,
            name: file.name,
            type: file.type,
            size: file.size,
            url: file.url
          });
        }
      }
    }
    
    toast.success('Startup updated successfully');
    return data;
  } catch (error: any) {
    console.error('Error in updateStartup function:', error);
    handleError(error, 'Failed to update startup');
    return null;
  }
};
