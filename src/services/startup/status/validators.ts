
import { supabase } from '@/services/base-service';

/**
 * Checks if a status ID exists in the database
 */
export const verifyStatusExists = async (statusId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('statuses')
      .select('id')
      .eq('id', statusId)
      .single();
    
    if (error) {
      console.error('Error checking status existence:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in verifyStatusExists:', error);
    return false;
  }
};

/**
 * Sanitizes an ID by trimming and returning undefined if empty
 */
export const sanitizeId = (id?: string): string | undefined => {
  return id ? id.trim() : undefined;
};

/**
 * Checks if an ID is a valid UUID format
 */
export const isValidUUID = (id?: string): boolean => {
  if (!id) return false;
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(id);
};

/**
 * Checks if a startup exists and returns its current status ID
 */
export const verifyStartupExists = async (startupId: string): Promise<{ exists: boolean, currentStatusId?: string }> => {
  try {
    const { data, error } = await supabase
      .from('startups')
      .select('id, status_id')
      .eq('id', startupId)
      .single();
    
    if (error) {
      console.error('Error checking startup existence:', error);
      return { exists: false };
    }
    
    return { exists: true, currentStatusId: data.status_id };
  } catch (error) {
    console.error('Error in verifyStartupExists:', error);
    return { exists: false };
  }
};

/**
 * Maps a status slug to a UUID if needed
 */
export const mapStatusSlugToUUID = async (slug: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('statuses')
      .select('id')
      .ilike('name', slug)
      .single();
    
    if (error || !data) {
      console.error('Error mapping status slug to UUID:', error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error('Error in mapStatusSlugToUUID:', error);
    return null;
  }
};
