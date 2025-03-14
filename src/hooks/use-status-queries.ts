
import { useMemo } from 'react';
import { useStartupsByStatus } from './use-startups-by-status';

export const useStatusQueries = (statusIds: string[]) => {
  // Create query results for all status IDs dynamically
  const statusQueries = statusIds.map((statusId) => {
    return {
      statusId,
      query: useStartupsByStatus(statusId),
    };
  });
  
  // Combine all query results into a mapping
  const queries = useMemo(() => {
    const result: Record<string, any> = {};
    
    statusQueries.forEach(({ statusId, query }) => {
      result[statusId] = query;
    });
    
    return result;
  }, [statusQueries]);
  
  // Check if any query is loading
  const isLoading = useMemo(() => {
    return Object.values(queries).some(query => query?.isLoading);
  }, [queries]);
  
  // Check if any query has an error
  const isError = useMemo(() => {
    return Object.values(queries).some(query => query?.isError);
  }, [queries]);
  
  return { queries, isLoading, isError };
};
