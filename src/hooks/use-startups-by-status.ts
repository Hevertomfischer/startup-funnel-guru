
import { useStartupsByStatusQuery } from './use-supabase-query';

export const useStartupsByStatus = (statusId: string) => {
  const query = useStartupsByStatusQuery(statusId);
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError
  };
};
