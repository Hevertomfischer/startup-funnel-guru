
import { useStartupsByStatusQuery } from './use-supabase-query';

export const useStartupsByStatus = (statusId: string) => {
  // Use the query hook at the top level with a valid statusId
  const query = useStartupsByStatusQuery(statusId);
  
  console.log(`useStartupsByStatus hook for statusId ${statusId}:`, {
    data: query.data ? query.data.length : 0,
    isLoading: query.isLoading,
    isError: query.isError,
  });
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
