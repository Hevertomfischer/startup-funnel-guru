
/**
 * Validation utilities for startup drag and drop operations
 */

/**
 * Validates that a string is a valid UUID
 */
export const isValidUUID = (id?: string | null): boolean => {
  if (!id) return false;
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(id);
};

/**
 * Performs comprehensive validation of drag & drop parameters
 * Returns an error message or null if validation passes
 */
export const validateDragDropParams = (
  startupId: string | null,
  columnId: string | null,
  sourceColumnId: string | null
): string | null => {
  console.log('Validating drag drop params:', { startupId, columnId, sourceColumnId });
  
  if (!startupId || !columnId) {
    console.error('Missing required data:', { startupId, columnId });
    return 'Falha ao mover o card: dados incompletos';
  }
  
  // Both IDs must be valid UUIDs
  if (!isValidUUID(startupId)) {
    console.error('Invalid startup ID format:', startupId);
    return 'ID da startup inválido';
  }
  
  if (!isValidUUID(columnId)) {
    console.error('Invalid column ID format:', columnId);
    return 'ID da coluna inválido';
  }
  
  return null;
};

/**
 * Sanitizes string IDs by trimming whitespace
 */
export const sanitizeId = (id?: string | null): string | undefined => {
  if (!id) return undefined;
  const trimmed = typeof id === 'string' ? id.trim() : String(id).trim();
  return trimmed === '' ? undefined : trimmed;
};
