
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
  const { data, error } = await supabase
    .from('startups')
    .select('*')
    .eq('status_id', statusId);
    
  if (error) {
    console.error('Supabase direct query error:', error);
    throw error;
  }
  
  console.log(`Direct query result for status ${statusId}:`, {
    count: data?.length || 0,
    firstItem: data && data.length > 0 ? data[0] : null
  });
  
  return data || [];
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
    queryFn: () => {
      console.log(`Query function execution for status ${statusId}`);
      // Use the debugging function for direct Supabase access
      return isPlaceholder ? [] : debugFetchStartupsByStatus(statusId);
    },
    enabled: !!statusId && !isPlaceholder, // Don't run query for placeholder IDs
    staleTime: isPlaceholder ? Infinity : 5000, // 5 seconds for real queries
    gcTime: isPlaceholder ? 0 : 60000, // 1 minute for real queries
    refetchInterval: isPlaceholder ? false : 15000, // Refresh every 15 seconds
    retry: 2, // Retry failed requests twice before giving up
  });
};

export const useStartupQuery = (id?: string) => {
  return useQuery({
    queryKey: ['startup', id],
    queryFn: () => getStartup(id!),
    enabled: !!id
  });
};
