
import { useQuery } from '@tanstack/react-query';
import { 
  getStartups, 
  getStartupsByStatus,
  getStartup,
} from '@/services';
import { supabase } from '@/integrations/supabase/client';

// Direct Supabase query function for debugging
const debugFetchStartupsByStatus = async (statusId: string) => {
  console.log(`Directly fetching startups for status ID: ${statusId}`);
  
  try {
    // Log more details about what we're trying to fetch
    console.log(`Attempting Supabase query: FROM 'startups' WHERE status_id = '${statusId}'`);
    
    const { data, error } = await supabase
      .from('startups')
      .select('*')
      .eq('status_id', statusId);
      
    if (error) {
      console.error('Supabase direct query error:', error);
      throw error;
    }
    
    // Enhanced logging with more details about the response
    console.log(`Direct query result for status ${statusId}:`, {
      count: data?.length || 0,
      firstItem: data && data.length > 0 ? {
        id: data[0].id,
        name: data[0].name,
        status_id: data[0].status_id
      } : null,
      allIds: data ? data.map(s => s.id) : []
    });
    
    return data || [];
  } catch (e) {
    console.error(`Critical error in debugFetchStartupsByStatus for status ${statusId}:`, e);
    throw e;
  }
};

// Fetch all statuses to check if any exist
const debugFetchAllStatuses = async () => {
  try {
    console.log('Fetching all statuses to verify database connection');
    const { data, error } = await supabase
      .from('statuses')
      .select('*');
      
    if (error) {
      console.error('Error fetching statuses:', error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} statuses in database`);
    return data || [];
  } catch (e) {
    console.error('Critical error fetching statuses:', e);
    throw e;
  }
};

// Basic startup fetch queries
export const useStartupsQuery = () => {
  return useQuery({
    queryKey: ['startups'],
    queryFn: getStartups
  });
};

export const useStartupsByStatusQuery = (statusId: string) => {
  // Check if this is a placeholder ID (for conditional rendering)
  const isPlaceholder = statusId.startsWith('placeholder-');
  
  return useQuery({
    queryKey: ['startups', 'status', statusId],
    queryFn: async () => {
      console.log(`Query function execution for status ${statusId}`);
      
      // First check if we can fetch statuses at all (connection test)
      if (!isPlaceholder) {
        try {
          await debugFetchAllStatuses();
        } catch (error) {
          console.error('Failed to verify database connection:', error);
          // Continue anyway to give the main query a chance
        }
      }
      
      // Use the debugging function for direct Supabase access
      return isPlaceholder ? [] : debugFetchStartupsByStatus(statusId);
    },
    enabled: !!statusId && !isPlaceholder, // Don't run query for placeholder IDs
    staleTime: isPlaceholder ? Infinity : 5000, // 5 seconds for real queries
    gcTime: isPlaceholder ? 0 : 60000, // 1 minute for real queries
    refetchInterval: isPlaceholder ? false : 15000, // Refresh every 15 seconds
    retry: 3, // Increase retries to give more chances to connect
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000), // Exponential backoff
  });
};

export const useStartupQuery = (id?: string) => {
  return useQuery({
    queryKey: ['startup', id],
    queryFn: () => getStartup(id!),
    enabled: !!id
  });
};
