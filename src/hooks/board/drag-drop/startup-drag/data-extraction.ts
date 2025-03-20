
import { Column, Status, Startup } from '@/types';
import { isValidUUID, sanitizeId } from './validation';

/**
 * Extracts and validates the source column ID from different sources
 */
export const getSourceColumnId = (
  sourceColumnId: string | null | undefined,
  startup: any | null | undefined,
  columns: Column[]
): string | undefined => {
  console.log('Getting source column ID:', { sourceColumnId, startup: startup?.id });
  
  // Try to get the current status ID from multiple sources:
  if (sourceColumnId && isValidUUID(sourceColumnId)) {
    console.log('Using sourceColumnId from drag event:', sourceColumnId);
    return sanitizeId(sourceColumnId);
  }
  
  if (startup?.status_id && isValidUUID(startup.status_id)) {
    console.log('Using status_id from startup object:', startup.status_id);
    return sanitizeId(startup.status_id);
  } 
  
  // If sourceColumnId is present but not a UUID, it might be a slug - look it up in columns
  if (sourceColumnId && !isValidUUID(sourceColumnId)) {
    console.log('Received non-UUID sourceColumnId (possible slug):', sourceColumnId);
    // This might be a slug, need to find the corresponding column's actual UUID
    const matchBySlug = columns.find(col => 
      col.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === sourceColumnId);
    
    if (matchBySlug) {
      console.log('Matched slug to UUID:', matchBySlug.id);
      return matchBySlug.id;
    }
  }
  
  // Last resort - find the column containing the startup
  if (startup?.id) {
    console.log('Looking for startup in columns:', startup.id);
    const currentColumn = columns.find(col => col.startupIds.includes(startup.id));
    if (currentColumn && isValidUUID(currentColumn.id)) {
      console.log('Found startup in column:', currentColumn.id);
      return sanitizeId(currentColumn.id);
    }
  }
  
  console.log('Could not determine source column ID');
  return undefined;
};

/**
 * Validates that the target column exists and has a valid status
 */
export const validateTargetColumn = (
  columnId: string,
  statuses: Status[]
): Status | null => {
  console.log('Validating target column:', columnId);
  
  // Check if columnId is a slug instead of a UUID
  if (!isValidUUID(columnId)) {
    console.log('Received non-UUID columnId (possible slug):', columnId);
    // Try to map it to a status ID
    const matchByName = statuses.find(status => 
      status.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === columnId);
    
    if (matchByName) {
      console.log('Matched column name to UUID:', matchByName.id);
      return matchByName;
    }
    
    console.error('Could not match non-UUID column ID to any status');
    return null;
  }
  
  const targetStatus = statuses.find(status => status.id === columnId);
  if (!targetStatus) {
    console.error('Column ID does not match any existing status:', columnId);
    return null;
  }
  
  return targetStatus;
};

/**
 * Prepares the mutation payload for status update
 */
export const prepareMutationPayload = (
  startupId: string,
  columnId: string,
  oldStatusId: string | undefined
): {
  id: string;
  newStatusId: string;
  oldStatusId?: string;
} => {
  const cleanStartupId = sanitizeId(startupId) || '';
  const cleanColumnId = sanitizeId(columnId) || '';
  const cleanOldStatusId = oldStatusId ? sanitizeId(oldStatusId) : undefined;
  
  // CRITICAL DEBUG: Log the exact values that will be sent for the update
  console.log('CRITICAL DEBUG - Values that will be used for status update:');
  console.log('- Startup ID:', cleanStartupId);
  console.log('- New status ID:', cleanColumnId);
  console.log('- Old status ID:', cleanOldStatusId);
  
  return {
    id: cleanStartupId,
    newStatusId: cleanColumnId,
    oldStatusId: cleanOldStatusId
  };
};
