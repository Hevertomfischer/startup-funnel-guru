
import { useStartupsByStatusQuery } from './use-supabase-query';

export const useStartupsByStatus = (statusId: string | undefined) => {
  // Use the query hook at the top level
  const query = useStartupsByStatusQuery(statusId || '');
  
  return {
    data: statusId && query.data ? query.data : [],
    isLoading: statusId ? query.isLoading : false,
    isError: statusId ? query.isError : false,
  };
};
