
import { supabase, handleError } from '../base-service';
import { toast } from 'sonner';
import type { Startup } from '@/integrations/supabase/client';
import { addAttachment } from '../attachment-service';
import { processStartupNumericFields } from '../utils/numeric-field-utils';

/**
 * Prepares data for Supabase by removing non-column fields and ensuring proper types
 */
function prepareStartupData(data: any): any {
  console.log('prepareStartupData input data:', data);
  
  // Create a clean copy of the data without any non-database fields
  const cleanData = { ...data };
  
  // Remove virtual fields not in the database schema
  const fieldsToRemove = [
    'changed_by',
    'values',
    'labels',
    'old_status_id',
    'attachments',
    'statusId', // Remove incorrect field name if present
    'assignedTo', // Remove incorrect field name if present
  ];
  
  // Remove all non-database fields
  fieldsToRemove.forEach(field => {
    if (field in cleanData) {
      delete cleanData[field];
    }
  });
  
  // Convert camelCase fields to snake_case if present
  if ('statusId' in data && !('status_id' in cleanData)) {
    cleanData.status_id = data.statusId;
  }
  
  if ('assignedTo' in data && !('assigned_to' in cleanData)) {
    cleanData.assigned_to = data.assignedTo;
  }
  
  // Ensure status_id is a string or null (critical fix)
  if (cleanData.status_id === undefined || cleanData.status_id === '') {
    cleanData.status_id = null;
  } else if (cleanData.status_id && typeof cleanData.status_id !== 'string') {
    cleanData.status_id = String(cleanData.status_id);
  }
  
  // Ensure assigned_to is a string or null
  if (cleanData.assigned_to === undefined || cleanData.assigned_to === '') {
    cleanData.assigned_to = null;
  } else if (cleanData.assigned_to && typeof cleanData.assigned_to !== 'string') {
    cleanData.assigned_to = String(cleanData.assigned_to);
  }
  
  // Process numeric fields (ensuring correct types)
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
    // No changed_by field here - the database trigger will handle this with the current user
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
      throw error;
    }
    
    console.log('Successfully updated startup status:', data);
    return data;
  } catch (error: any) {
    console.error('Error in updateStartupStatus function:', error);
    handleError(error, 'Failed to update startup status');
    return null;
  }
};
