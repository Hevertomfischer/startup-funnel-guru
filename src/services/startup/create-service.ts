
import { supabase, handleError } from '../base-service';
import { toast } from 'sonner';
import type { Startup } from '@/integrations/supabase/client';
import { addAttachment } from '../attachment-service';
import { prepareStartupData } from './utils/prepare-data';

/**
 * Creates a new startup in the database
 */
export const createStartup = async (startup: Omit<Startup, 'id' | 'created_at' | 'updated_at'> & { 
  attachments?: any[],
  pitchDeck?: any
}): Promise<Startup | null> => {
  try {
    console.log('Creating startup in Supabase with data:', startup);
    const { attachments, pitchDeck, ...startupData } = startup;
    
    // Prepare data for Supabase
    const preparedData = prepareStartupData(startupData);
    
    console.log('Prepared data for Supabase insert:', preparedData);
    
    const { data, error } = await supabase
      .from('startups')
      .insert(preparedData)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }
    
    console.log('Startup created in Supabase:', data);
    
    // Save the pitch deck as an attachment if provided
    if (pitchDeck && pitchDeck.url) {
      console.log('Adding pitch deck as attachment:', pitchDeck);
      try {
        const pitchDeckResult = await addAttachment({
          startup_id: data.id,
          name: pitchDeck.name || 'Pitch Deck',
          type: pitchDeck.type || 'application/pdf',
          size: pitchDeck.size || 0,
          url: pitchDeck.url
        });
        console.log('Pitch deck saved as attachment:', pitchDeckResult);
      } catch (pitchError) {
        console.error('Error saving pitch deck as attachment:', pitchError);
        // Don't throw here, we still want to complete the startup creation
      }
    } else {
      console.log('No pitch deck provided or missing URL');
    }
    
    // Save additional attachments
    if (attachments && attachments.length > 0) {
      console.log(`Adding ${attachments.length} attachments`);
      let savedCount = 0;
      
      for (const file of attachments) {
        if (!file.url) {
          console.warn('Skipping attachment without URL:', file);
          continue;
        }
        
        try {
          const attachmentResult = await addAttachment({
            startup_id: data.id,
            name: file.name || 'Attachment',
            type: file.type || 'application/octet-stream',
            size: file.size || 0,
            url: file.url
          });
          console.log('Attachment saved:', attachmentResult);
          savedCount++;
        } catch (attachError) {
          console.error('Error saving attachment:', attachError);
          // Continue with other attachments
        }
      }
      
      console.log(`Successfully saved ${savedCount} out of ${attachments.length} attachments`);
    } else {
      console.log('No attachments provided');
    }
    
    toast.success('Startup criada com sucesso');
    return data;
  } catch (error: any) {
    console.error('Error in createStartup function:', error);
    handleError(error, 'Falha ao criar startup');
    return null;
  }
};
