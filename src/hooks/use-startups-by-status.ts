
import { useMemo } from 'react';
import { useStartupsByStatusQuery } from './use-supabase-query';

export const useStartupsByStatus = (statusId: string) => {
  // Only fetch startups data if we have a valid status ID
  const query = useStartupsByStatusQuery(statusId);
  
  // Memoize the result to avoid unnecessary re-renders
  const result = useMemo(() => ({
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
  }), [query.data, query.isLoading, query.isError]);
  
  return result;
};
