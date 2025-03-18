
import { supabase, handleError } from '../base-service';
import { toast } from 'sonner';
import type { Startup } from '@/integrations/supabase/client';
import { addAttachment } from '../attachment-service';
import { processStartupNumericFields } from '../utils/numeric-field-utils';

// Define a type that includes old_status_id for tracking purposes only
interface StartupWithHistory extends Partial<Startup> {
  attachments?: any[];
  old_status_id?: string; // For tracking only, not a database field
}

/**
 * Creates a new startup in the database
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
 */
export const updateStartup = async (
  id: string,
  startup: StartupWithHistory
): Promise<Startup | null> => {
  try {
    console.log('Updating startup in Supabase with id:', id, 'and data:', startup);
    
    // Extract attachments and old_status_id from the input data (they aren't database fields)
    const { attachments, old_status_id, ...startupData } = startup;
    
    // Create a clean data object for the update
    let preparedData: any = { ...startupData };
    
    // Always ensure we're using the correct field name
    if (preparedData.statusId && !preparedData.status_id) {
      preparedData.status_id = preparedData.statusId;
      delete preparedData.statusId;
    }
    
    // If status_id is missing, get it from the current database record
    if (!preparedData.status_id) {
      const { data: currentStartup, error: fetchError } = await supabase
        .from('startups')
        .select('status_id')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        console.error('Error fetching current startup:', fetchError);
        throw new Error('Failed to fetch current startup data');
      }
      
      if (currentStartup && currentStartup.status_id) {
        preparedData.status_id = currentStartup.status_id;
      } else {
        // Fallback to first status if needed
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
    
    // CRITICAL: Remove these fields which can cause type errors with the database
    // The database trigger will handle changed_by using the JWT
    delete preparedData.changed_by;
    
    // Make sure we're not sending string values for UUID fields
    if (typeof preparedData.status_id !== 'string') {
      preparedData.status_id = String(preparedData.status_id);
    }
    
    if (preparedData.assigned_to && typeof preparedData.assigned_to !== 'string') {
      preparedData.assigned_to = String(preparedData.assigned_to);
    }
    
    // Remove any other non-column fields that might cause issues
    delete preparedData.old_status_id;
    delete preparedData.values;
    delete preparedData.labels;
    
    console.log('Prepared data for Supabase update:', preparedData);
    
    // Update the startup in the database
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
