
import { supabase, handleError } from '../base-service';
import { toast } from 'sonner';
import type { Startup } from '@/integrations/supabase/client';
import { addAttachment } from '../attachment-service';
import { processStartupNumericFields } from '../utils/numeric-field-utils';

/**
 * Creates a new startup in the database
 * @param startup The startup data to create
 * @returns A promise resolving to the created startup or null if failed
 */
export const createStartup = async (startup: Omit<Startup, 'id' | 'created_at' | 'updated_at'> & { attachments?: any[] }): Promise<Startup | null> => {
  try {
    console.log('Creating startup in Supabase with data:', startup);
    const { attachments, ...startupData } = startup;
    
    // Process numeric fields
    const preparedData = processStartupNumericFields(startupData);
    
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

/**
 * Updates an existing startup in the database
 * @param id The ID of the startup to update
 * @param startup The startup data to update
 * @returns A promise resolving to the updated startup or null if failed
 */
export const updateStartup = async (
  id: string,
  startup: Partial<Startup> & { 
    attachments?: any[],
    old_status_id?: string // Add explicit type for old_status_id
  }
): Promise<Startup | null> => {
  try {
    console.log('Updating startup in Supabase with id:', id, 'and data:', startup);
    const { attachments, old_status_id, ...startupData } = startup;
    
    // Ensure status_id is not null or undefined before updating
    let preparedData: any = { ...startupData };
    
    if (startupData.status_id === null || startupData.status_id === undefined) {
      // Get the current startup data to preserve the status_id
      const { data: currentStartup, error: fetchError } = await supabase
        .from('startups')
        .select('status_id')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        console.error('Error fetching current startup:', fetchError);
        throw new Error('Failed to fetch current startup data');
      }
      
      // Use the current status_id if it exists
      if (currentStartup && currentStartup.status_id) {
        preparedData.status_id = currentStartup.status_id;
      } else {
        // If for some reason we still don't have a status_id, get the first available status
        const { data: firstStatus, error: statusError } = await supabase
          .from('statuses')
          .select('id')
          .order('position', { ascending: true })
          .limit(1)
          .single();
        
        if (statusError) {
          console.error('Error fetching first status:', statusError);
          throw new Error('Failed to fetch default status');
        }
        
        preparedData.status_id = firstStatus.id;
      }
    }
    
    // Process numeric fields
    preparedData = processStartupNumericFields(preparedData);
    
    console.log('Prepared data for Supabase update:', preparedData);
    
    const { data, error } = await supabase
      .from('startups')
      .update(preparedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }
    
    console.log('Startup updated in Supabase:', data);
    
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
