
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
  // Try to get the current status ID from multiple sources:
  if (sourceColumnId && isValidUUID(sourceColumnId)) {
    return sanitizeId(sourceColumnId);
  }
  
  if (startup?.status_id && isValidUUID(startup.status_id)) {
    return sanitizeId(startup.status_id);
  } 
  
  // Last resort - find the column containing the startup
  if (startup?.id) {
    const currentColumn = columns.find(col => col.startupIds.includes(startup.id));
    if (currentColumn && isValidUUID(currentColumn.id)) {
      return sanitizeId(currentColumn.id);
    }
  }
  
  return undefined;
};

/**
 * Validates that the target column exists and has a valid status
 */
export const validateTargetColumn = (
  columnId: string,
  statuses: Status[]
): Status | null => {
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
  
  // CRITICAL DEBUG: Log the exact values that will be sent for the update
  console.log('CRITICAL DEBUG - Values that will be used for status update:');
  console.log('- Startup ID:', cleanStartupId);
  console.log('- New status ID:', cleanColumnId);
  console.log('- Old status ID:', oldStatusId);
  
  return {
    id: cleanStartupId,
    newStatusId: cleanColumnId,
    oldStatusId
  };
};
