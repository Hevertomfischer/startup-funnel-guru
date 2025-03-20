
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
  const trimmed = typeof id === 'string' ? id.trim() : String(id).trim();
  return trimmed === '' ? undefined : trimmed;
};

/**
 * Maps a status slug (like "due-diligence") to a UUID by looking it up in the database
 * Returns the UUID if found, undefined otherwise
 */
export const mapStatusSlugToUUID = async (slug: string): Promise<string | undefined> => {
  if (!slug) return undefined;
  if (isValidUUID(slug)) return slug;
  
  // Normalize slug by removing special characters and converting to lowercase
  const normalizedSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  console.log(`Trying to map status slug "${slug}" (normalized to "${normalizedSlug}") to UUID`);
  
  try {
    // Try to find a status with a name that, when converted to a slug, matches the input
    const { data, error } = await supabase
      .from('statuses')
      .select('id, name')
      .order('position');
      
    if (error || !data || data.length === 0) {
      console.error('Failed to retrieve statuses for slug mapping:', error || 'No data returned');
      return undefined;
    }
    
    // Look for a match by normalizing each status name
    const matchingStatus = data.find(status => {
      const statusSlug = status.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return statusSlug === normalizedSlug;
    });
    
    if (matchingStatus) {
      console.log(`Mapped status slug "${slug}" to UUID "${matchingStatus.id}"`);
      return matchingStatus.id;
    } else {
      console.warn(`Could not map status slug "${slug}" to any known status`);
      return undefined;
    }
  } catch (error) {
    console.error('Error trying to map status slug to UUID:', error);
    return undefined;
  }
};

/**
 * Verifies that a status exists in the database
 */
export const verifyStatusExists = async (statusId: string): Promise<boolean> => {
  // First, check if this might be a slug instead of a UUID
  if (!isValidUUID(statusId)) {
    console.log(`Status ID "${statusId}" is not a UUID, trying to map it as a slug`);
    const mappedId = await mapStatusSlugToUUID(statusId);
    if (mappedId) {
      console.log(`Successfully mapped slug "${statusId}" to UUID "${mappedId}"`);
      statusId = mappedId;
    } else {
      console.error(`Failed to map slug "${statusId}" to a valid UUID`);
      return false;
    }
  }
  
  // Now verify that the status ID exists in the database
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
