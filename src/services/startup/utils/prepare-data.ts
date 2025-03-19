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
  
  // Ensure status_id is a valid UUID or null (critical fix)
  if (cleanData.status_id === undefined || cleanData.status_id === '') {
    // CRITICAL: For status updates, we can't allow null or undefined
    if (data.isStatusUpdate === true) {
      console.error('Attempted to update with null/undefined status_id in a status update operation');
      throw new Error('Status ID cannot be null or undefined when updating status');
    }
    cleanData.status_id = null;
  } else if (cleanData.status_id && typeof cleanData.status_id === 'string') {
    // Check if it's a valid UUID format
    if (!uuidPattern.test(cleanData.status_id)) {
      console.error(`Invalid UUID format for status_id: ${cleanData.status_id}`);
      // If we have an invalid format and this is a status update, throw error
      if (data.isStatusUpdate === true) {
        throw new Error(`Invalid status ID format: ${cleanData.status_id}`);
      }
      // Otherwise convert to null
      cleanData.status_id = null;
    }
  } else if (cleanData.status_id && typeof cleanData.status_id !== 'string') {
    // If it's not a string, convert to string and then check format
    const statusIdStr = String(cleanData.status_id);
    if (!uuidPattern.test(statusIdStr)) {
      console.error(`Invalid UUID format for status_id: ${statusIdStr}`);
      if (data.isStatusUpdate === true) {
        throw new Error(`Invalid status ID format: ${statusIdStr}`);
      }
      cleanData.status_id = null;
    } else {
      cleanData.status_id = statusIdStr;
    }
  }
  
  // Double check for status updates to ensure we never send null
  if (data.isStatusUpdate === true && (!cleanData.status_id || cleanData.status_id === null)) {
    console.error('Attempted to update with null status_id in a status update operation');
    throw new Error('Status ID cannot be null when updating status');
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
