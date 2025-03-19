
import { processStartupNumericFields } from './numeric-field-utils';

/**
 * Prepares data for Supabase by removing non-column fields and ensuring proper types
 */
export function prepareStartupData(data: any): any {
  console.log('prepareStartupData input data:', data);
  
  // Create a clean copy of the data without any non-database fields
  const cleanData = { ...data };
  
  // CRITICAL: Always remove changed_by field as this is handled by database triggers
  if ('changed_by' in cleanData) {
    delete cleanData.changed_by;
  }
  
  // Remove virtual fields not in the database schema
  const fieldsToRemove = [
    'values',
    'labels',
    'old_status_id',
    'attachments',
    'statusId', // Remove incorrect field name if present
    'assignedTo', // Remove incorrect field name if present
    'status_current', // Remove if present (not a database column)
    'isStatusUpdate', // Remove this flag - it's only for our client code
    '__is_status_update', // Remove legacy flag
  ];
  
  // Check if this is a status update operation (special handling) BEFORE removing the flag
  const isStatusUpdate = data.isStatusUpdate === true;
  
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
  
  // Validate UUID format for status_id
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  // Special handling for status_id in status update operations
  if (isStatusUpdate) {
    // For status updates, we need to be extra careful
    if (!cleanData.status_id) {
      console.error('Attempted status update with null/empty status_id');
      throw new Error('ID do status não pode estar vazio ao atualizar status');
    }
    
    // CRÍTICO: Verifica explicitamente por strings vazias
    if (typeof cleanData.status_id === 'string' && cleanData.status_id.trim() === '') {
      console.error('Status ID is an empty string');
      throw new Error('ID do status não pode estar vazio');
    }
    
    // Ensure status_id is a valid UUID for status updates
    if (typeof cleanData.status_id === 'string' && !uuidPattern.test(cleanData.status_id)) {
      console.error(`Invalid UUID format for status_id in status update: ${cleanData.status_id}`);
      throw new Error(`Formato de ID do status inválido: ${cleanData.status_id}`);
    }
    
    // CRITICAL: Final verification to ensure we never send null status_id during a status update
    if (!cleanData.status_id || cleanData.status_id === null || cleanData.status_id === '') {
      console.error('CRITICAL ERROR: Attempted to update with null status_id in a status update operation');
      throw new Error('ID do status não pode estar vazio ao atualizar status');
    }
  } else {
    // Regular handling for non-status-update operations
    if (cleanData.status_id === undefined || cleanData.status_id === '') {
      cleanData.status_id = null;
    } else if (cleanData.status_id && typeof cleanData.status_id === 'string') {
      // Check if it's a valid UUID format
      if (!uuidPattern.test(cleanData.status_id)) {
        console.error(`Invalid UUID format for status_id: ${cleanData.status_id}`);
        cleanData.status_id = null;
      }
    } else if (cleanData.status_id && typeof cleanData.status_id !== 'string') {
      // If it's not a string, convert to string and then check format
      const statusIdStr = String(cleanData.status_id);
      if (!uuidPattern.test(statusIdStr)) {
        console.error(`Invalid UUID format for status_id: ${statusIdStr}`);
        cleanData.status_id = null;
      } else {
        cleanData.status_id = statusIdStr;
      }
    }
  }
  
  // Double check for status updates to ensure we never send null
  if (isStatusUpdate && (!cleanData.status_id || cleanData.status_id === null || cleanData.status_id === '')) {
    console.error('Attempted to update with null status_id in a status update operation');
    throw new Error('ID do status não pode estar vazio ao atualizar status');
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
  
  // FINAL SAFETY CHECK: If this is a status update, ensure status_id is not null
  if (isStatusUpdate && (!processed.status_id || processed.status_id === null)) {
    console.error('FINAL CHECK FAILED: Status update with null status_id after processing');
    throw new Error('ID do status inválido após processamento');
  }
  
  return processed;
}
