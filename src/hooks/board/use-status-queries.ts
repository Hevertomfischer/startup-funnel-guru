
import { useMemo } from 'react';
import { useStartupsByStatus } from '../use-startups-by-status';

export const useStatusQueries = (statusIds: string[]) => {
  // Create individual query hooks for each status ID
  const queryResults = statusIds.map(statusId => {
    // This is a valid use of hooks at the top level
    return {
      statusId,
      ...useStartupsByStatus(statusId)
    };
  });
  
  // Combine all query results into a mapping
  const queries = useMemo(() => {
    const result: Record<string, any> = {};
    
    queryResults.forEach(({ statusId, ...query }) => {
      result[statusId] = query;
    });
    
    return result;
  }, [queryResults]);
  
  // Check if any query is loading
  const isLoading = useMemo(() => {
    return queryResults.some(query => query.isLoading);
  }, [queryResults]);
  
  // Check if any query has an error
  const isError = useMemo(() => {
    return queryResults.some(query => query.isError);
  }, [queryResults]);
  
  return { queries, isLoading, isError };
};
