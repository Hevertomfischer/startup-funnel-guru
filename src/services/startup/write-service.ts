
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
 * Prepares data for Supabase by removing non-column fields and ensuring proper types
 */
function prepareStartupData(data: any): any {
  console.log('prepareStartupData input data:', data);
  // Create a clean copy of the data
  const cleanData = { ...data };
  
  // CRITICAL: Remove these fields which can cause type errors with the database
  // The database trigger will handle changed_by using the JWT
  delete cleanData.changed_by;
  delete cleanData.values;
  delete cleanData.labels;
  delete cleanData.old_status_id;
  
  // Ensure status_id is a string
  if (cleanData.status_id && typeof cleanData.status_id !== 'string') {
    cleanData.status_id = String(cleanData.status_id);
  }
  
  // Ensure assigned_to is a string or null
  if (cleanData.assigned_to === undefined || cleanData.assigned_to === '') {
    cleanData.assigned_to = null;
  } else if (cleanData.assigned_to && typeof cleanData.assigned_to !== 'string') {
    cleanData.assigned_to = String(cleanData.assigned_to);
  }
  
  // Process numeric fields
  const processed = processStartupNumericFields(cleanData);
  console.log('prepareStartupData result:', processed);
  return processed;
}

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

/**
 * Updates an existing startup in the database
 */
export const updateStartup = async (
  id: string,
  startup: StartupWithHistory
): Promise<Startup | null> => {
  try {
    console.log('updateStartup called with id:', id, 'and data:', startup);
    
    // Extract attachments from the input data (they aren't database fields)
    const { attachments, ...startupData } = startup;
    
    // For status changes, we need to track the old status for history
    const oldStatusId = startupData.old_status_id;
    delete startupData.old_status_id;
    
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
