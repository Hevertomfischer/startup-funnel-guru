
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
      
      // Even if there's no startup data to update, continue with attachment handling
      if (!pitchDeck && (!attachments || attachments.length === 0)) {
        console.log('No startup data, pitch deck, or attachments to update. Returning null.');
        return null;
      }
      
      // If we only have attachments to update, try to get the current startup data
      const { data: currentStartup, error: fetchError } = await supabase
        .from('startups')
        .select()
        .eq('id', id)
        .single();
      
      if (fetchError) {
        console.error('Error fetching current startup data:', fetchError);
        throw fetchError;
      }
      
      console.log('Retrieved current startup data for attachment updates only:', currentStartup);
      
      if (!currentStartup) {
        throw new Error(`Startup with ID ${id} not found`);
      }
      
      // Use the current startup data for the rest of the function
      var data = currentStartup;
    } else {
      // Update the startup in the database
      const { data: updatedData, error } = await supabase
        .from('startups')
        .update(preparedData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Supabase update error:', error);
        toast.error(`Falha na atualização: ${error.message}`);
        throw error;
      }
      
      console.log('Startup updated in Supabase:', updatedData);
      var data = updatedData;
    }
    
    // Save or update the pitch deck if provided
    if (pitchDeck && pitchDeck.url) {
      console.log('Adding or updating pitch deck:', pitchDeck);
      try {
        const pitchDeckResult = await addAttachment({
          startup_id: id,
          name: pitchDeck.name || 'Pitch Deck',
          type: pitchDeck.type || 'application/pdf',
          size: pitchDeck.size || 0,
          url: pitchDeck.url
        });
        console.log('Pitch deck saved:', pitchDeckResult);
      } catch (pitchError) {
        console.error('Error saving pitch deck:', pitchError);
        // Don't throw here, we still want to complete the startup update
      }
    }
    
    // Handle attachments if provided
    if (attachments && attachments.length > 0) {
      console.log(`Processing ${attachments.length} attachments`);
      let savedCount = 0;
      
      for (const file of attachments) {
        // Only add if it's a new attachment (no id) and has a URL
        if (!file.id && file.url) {
          try {
            const attachmentResult = await addAttachment({
              startup_id: id,
              name: file.name || 'Attachment',
              type: file.type || 'application/octet-stream',
              size: file.size || 0,
              url: file.url
            });
            console.log('New attachment saved:', attachmentResult);
            savedCount++;
          } catch (attachError) {
            console.error('Error saving new attachment:', attachError);
            // Continue with other attachments
          }
        } else if (!file.url) {
          console.warn('Skipping attachment without URL:', file);
        } else {
          console.log('Skipping existing attachment with ID:', file.id);
        }
      }
      
      console.log(`Successfully saved ${savedCount} new attachments`);
    }
    
    toast.success('Startup atualizada com sucesso');
    return data;
  } catch (error: any) {
    console.error('Error in updateStartup function:', error);
    handleError(error, 'Falha ao atualizar startup');
    return null;
  }
};
