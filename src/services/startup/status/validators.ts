
import { supabase } from '@/services/base-service';

/**
 * Validates that a string is a valid UUID
 */
export const isValidUUID = (id?: string | null): boolean => {
  if (!id) return false;
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(id);
};

/**
 * Sanitizes string IDs by trimming whitespace
 */
export const sanitizeId = (id?: string | null): string | undefined => {
  if (!id) return undefined;
  const trimmed = id.trim();
  return trimmed === '' ? undefined : trimmed;
};

/**
 * Verifies that a status exists in the database
 */
export const verifyStatusExists = async (statusId: string): Promise<boolean> => {
  if (!isValidUUID(statusId)) return false;
  
  const { data, error } = await supabase
    .from('statuses')
    .select('id, name')
    .eq('id', statusId)
    .single();
    
  if (error || !data) {
    console.error('Status verification failed:', error || 'No data returned');
    return false;
  }
  
  console.log(`Status verified and exists: ${data.name} (${data.id})`);
  return true;
};

/**
 * Verifies that a startup exists in the database
 */
export const verifyStartupExists = async (startupId: string): Promise<{exists: boolean, currentStatusId?: string}> => {
  if (!isValidUUID(startupId)) return { exists: false };
  
  const { data, error } = await supabase
    .from('startups')
    .select('id, status_id, name')
    .eq('id', startupId)
    .single();
    
  if (error || !data) {
    console.error('Startup verification failed:', error || 'No data returned');
    return { exists: false };
  }
  
  console.log(`Startup verified: ${data.name} (${data.id}), status atual: ${data.status_id || 'nenhum'}`);
  return { 
    exists: true, 
    currentStatusId: data.status_id 
  };
};
