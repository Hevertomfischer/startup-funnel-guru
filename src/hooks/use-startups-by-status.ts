
import { useStartupsByStatusQuery } from './use-supabase-query';

export const useStartupsByStatus = (statusId: string | undefined) => {
  // Only fetch startups data if we have a valid status ID
  const query = useStartupsByStatusQuery(statusId || '');
  
  return {
    data: statusId && query.data ? query.data : [],
    isLoading: statusId ? query.isLoading : false,
    isError: statusId ? query.isError : false,
  };
};
