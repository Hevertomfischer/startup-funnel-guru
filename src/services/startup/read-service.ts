
import { supabase, handleError } from '../base-service';
import type { Startup } from '@/integrations/supabase/client';

/**
 * Fetches all startups from the database
 * @returns A promise resolving to an array of startups
 */
export const getStartups = async (): Promise<Startup[]> => {
  try {
    console.log('Fetching all startups');
    const { data, error } = await supabase
      .from('startups')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching all startups:', error);
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} startups`);
    return data || [];
  } catch (error: any) {
    console.error('Critical error in getStartups:', error);
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
    
    // Primeiro verificar se o status existe
    const { data: statusCheck, error: statusError } = await supabase
      .from('statuses')
      .select('id, name')
      .eq('id', statusId)
      .single();
      
    if (statusError) {
      console.warn(`Status with ID ${statusId} may not exist:`, statusError);
      // Continue anyway, as the error might be something else
    } else {
      console.log(`Found status: ${statusCheck?.name || 'unknown'} (${statusId})`);
    }
    
    // Agora buscar as startups
    const { data, error } = await supabase
      .from('startups')
      .select('*')
      .eq('status_id', statusId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching startups for status ${statusId}:`, error);
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} startups for status ${statusId}`);
    if (data && data.length > 0) {
      console.log(`First startup for status ${statusId}:`, {
        id: data[0].id,
        name: data[0].name,
        created_at: data[0].created_at
      });
    }
    
    return data || [];
  } catch (error: any) {
    console.error(`Critical error in getStartupsByStatus for ${statusId}:`, error);
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
    console.log(`Fetching startup with ID: ${id}`);
    const { data, error } = await supabase
      .from('startups')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching startup ${id}:`, error);
      throw error;
    }
    
    console.log(`Retrieved startup: ${data?.name || 'unknown'} (${id})`);
    return data;
  } catch (error: any) {
    console.error(`Critical error in getStartup for ${id}:`, error);
    handleError(error, 'Failed to fetch startup');
    return null;
  }
};
