
import { supabase, handleError } from '../base-service';
import type { Startup } from '@/integrations/supabase/client';

/**
 * Fetches all startups from the database
 * @returns A promise resolving to an array of startups
 */
export const getStartups = async (): Promise<Startup[]> => {
  try {
    // Include attachments in the query
    const { data, error } = await supabase
      .from('startups')
      .select(`
        *,
        attachments(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    handleError(error, 'Failed to fetch startups');
    return [];
  }
};

/**
 * Fetches startups filtered by status
 * @param statusId The ID of the status to filter by
 * @returns A promise resolving to an array of filtered startups
 */
export const getStartupsByStatus = async (statusId: string): Promise<Startup[]> => {
  try {
    console.log(`Fetching startups for status: ${statusId}`);
    // Include attachments in the query
    const { data, error } = await supabase
      .from('startups')
      .select(`
        *,
        attachments(*)
      `)
      .eq('status_id', statusId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    console.log(`Retrieved ${data?.length || 0} startups for status ${statusId}`);
    return data || [];
  } catch (error: any) {
    handleError(error, 'Failed to fetch startups by status');
    return [];
  }
};

/**
 * Fetches a single startup by ID
 * @param id The ID of the startup to fetch
 * @returns A promise resolving to a startup or null if not found
 */
export const getStartup = async (id: string): Promise<Startup | null> => {
  try {
    // Include attachments in the query
    const { data, error } = await supabase
      .from('startups')
      .select(`
        *,
        attachments(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    handleError(error, 'Failed to fetch startup');
    return null;
  }
};
