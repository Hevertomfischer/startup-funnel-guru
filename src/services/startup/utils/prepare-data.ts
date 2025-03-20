
import { processStartupNumericFields } from './numeric-field-utils';

/**
 * Prepares data for Supabase by removing non-column fields and ensuring proper types
 */
export function prepareStartupData(data: any): any {
  console.log('prepareStartupData input data:', data);
  
  // CRITICAL: Defensive copy that is not a reference to the input
  const cleanData = JSON.parse(JSON.stringify(data || {}));
  
  // Check if this is a status update operation (special handling) BEFORE removing flags
  const isStatusUpdate = data.isStatusUpdate === true;
  console.log('Is status update operation?', isStatusUpdate);
  
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
  
  // Remove all non-database fields
  fieldsToRemove.forEach(field => {
    if (field in cleanData) {
      delete cleanData[field];
    }
  });
  
  // Convert camelCase fields to snake_case if present
  if ('statusId' in data && data.statusId && !('status_id' in cleanData)) {
    cleanData.status_id = data.statusId;
  }
  
  if ('assignedTo' in data && !('assigned_to' in cleanData)) {
    cleanData.assigned_to = data.assignedTo;
  }
  
  // CRITICAL: Log data state after field mapping
  console.log('Data after mapping and cleanup:', cleanData);
  console.log('Is status update?', isStatusUpdate);
  console.log('Current status_id value:', cleanData.status_id);
  
  // CRITICAL: UUID validation pattern
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  // CRITICAL: ADDITIONAL PROTECTION - IMPORTANT CHANGE:
  // For status updates, ensure that status_id is a valid UUID and never null or empty
  if (isStatusUpdate) {
    console.log('Processing a status update with status_id:', cleanData.status_id);
    
    if (!cleanData.status_id) {
      console.error('Attempted status update with null/empty status_id');
      throw new Error('ID do status não pode estar vazio ao atualizar status');
    }
    
    // Sanitize status_id
    if (typeof cleanData.status_id === 'string') {
      cleanData.status_id = cleanData.status_id.trim();
      
      if (cleanData.status_id === '') {
        console.error('Status ID is an empty string after trimming');
        throw new Error('ID do status vazio após limpeza');
      }
      
      // ENHANCED ERROR DETECTION: Print slug-like status IDs before they cause errors
      if (cleanData.status_id.includes('-') && !uuidPattern.test(cleanData.status_id)) {
        console.error(`Received slug-like status_id: ${cleanData.status_id}. This is not a valid UUID.`);
      }
      
      // CRITICAL FIX: Reject non-UUID values like "due-diligence"
      if (!uuidPattern.test(cleanData.status_id)) {
        console.error(`Invalid UUID format for status_id: ${cleanData.status_id}`);
        // Add more detail to error message
        throw new Error(`Formato de ID do status inválido (deve ser UUID): ${cleanData.status_id}`);
      }
    } else {
      console.error(`Invalid data type for status_id: ${typeof cleanData.status_id}`);
      throw new Error('Tipo de dado inválido para ID do status');
    }
    
    // CRITICAL: For status update operations, create a new object with ONLY status_id
    // to avoid any potential issues with other fields
    const safeUpdateData = {
      status_id: cleanData.status_id
    };
    
    // IMPORTANT: Log the final safe data
    console.log('Status update with safe data:', safeUpdateData);
    return safeUpdateData;
  } 
  else {
    // For normal updates (non-status updates)
    // Handle normal field validations and conversions
    if (cleanData.status_id === undefined || cleanData.status_id === '') {
      console.log('Status ID is empty or undefined in a normal update - setting to null');
      cleanData.status_id = null;
    } else if (cleanData.status_id && typeof cleanData.status_id === 'string') {
      cleanData.status_id = cleanData.status_id.trim();
      
      // ENHANCED ERROR DETECTION: Print slug-like status IDs before they cause errors
      if (cleanData.status_id.includes('-') && !uuidPattern.test(cleanData.status_id)) {
        console.error(`Received slug-like status_id: ${cleanData.status_id} in normal update. Converting to null.`);
      }
      
      // CRITICAL FIX: Detect non-UUID values and handle appropriately
      if (!uuidPattern.test(cleanData.status_id)) {
        console.warn(`Invalid UUID format for status_id in normal update: ${cleanData.status_id} - setting to null`);
        cleanData.status_id = null;
      }
    } 
    
    // Ensure assigned_to is a string or null
    if (cleanData.assigned_to === undefined || cleanData.assigned_to === '') {
      cleanData.assigned_to = null;
    } else if (cleanData.assigned_to && typeof cleanData.assigned_to !== 'string') {
      cleanData.assigned_to = String(cleanData.assigned_to);
    }
    
    // Process numeric fields
    const processed = processStartupNumericFields(cleanData);
    console.log('Normal update with processed data:', processed);
    return processed;
  }
}
