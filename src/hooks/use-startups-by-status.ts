
import { useStartupsByStatusQuery } from './use-supabase-query';

export const useStartupsByStatus = (statusId: string | undefined) => {
  // Only fetch startups data if we have a valid status ID
  const query = useStartupsByStatusQuery(statusId || '');
  
  return {
    data: query.data || [],
    isLoading: query.isLoading && !!statusId,
    isError: query.isError && !!statusId,
  };
};
