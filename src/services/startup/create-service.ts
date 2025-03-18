
import { supabase, handleError } from '../base-service';
import { toast } from 'sonner';
import type { Startup } from '@/integrations/supabase/client';
import { addAttachment } from '../attachment-service';
import { prepareStartupData } from './utils/prepare-data';

/**
 * Creates a new startup in the database
 */
export const createStartup = async (startup: Omit<Startup, 'id' | 'created_at' | 'updated_at'> & { attachments?: any[] }): Promise<Startup | null> => {
  try {
    console.log('Creating startup in Supabase with data:', startup);
    const { attachments, ...startupData } = startup;
    
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
    
    if (attachments && attachments.length > 0) {
      for (const file of attachments) {
        await addAttachment({
          startup_id: data.id,
          name: file.name,
          type: file.type,
          size: file.size,
          url: file.url
        });
      }
    }
    
    toast.success('Startup created successfully');
    return data;
  } catch (error: any) {
    console.error('Error in createStartup function:', error);
    handleError(error, 'Failed to create startup');
    return null;
  }
};
