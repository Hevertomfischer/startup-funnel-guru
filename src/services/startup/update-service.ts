
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
  startup: Partial<Startup> & { 
    attachments?: any[],
    pitchDeck?: any
  }
): Promise<Startup | null> => {
  try {
    console.log('updateStartup called with id:', id, 'and data:', startup);
    
    // Extract attachments and pitchDeck from the input data (they aren't database fields)
    const { attachments, pitchDeck, ...startupData } = startup;
    
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
    
    // Save or update the pitch deck if provided
    if (pitchDeck) {
      console.log('Adding or updating pitch deck:', pitchDeck);
      const pitchDeckResult = await addAttachment({
        startup_id: id,
        name: pitchDeck.name,
        type: pitchDeck.type,
        size: pitchDeck.size,
        url: pitchDeck.url
      });
      console.log('Pitch deck saved:', pitchDeckResult);
    }
    
    // Handle attachments if provided
    if (attachments && attachments.length > 0) {
      console.log(`Processing ${attachments.length} attachments`);
      for (const file of attachments) {
        if (!file.id) { // Only add if it's a new attachment
          const attachmentResult = await addAttachment({
            startup_id: id,
            name: file.name,
            type: file.type,
            size: file.size,
            url: file.url
          });
          console.log('New attachment saved:', attachmentResult);
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
