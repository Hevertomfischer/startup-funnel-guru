
import { useMemo } from 'react';
import { useStartupsByStatus } from './use-startups-by-status';

export const useStatusQueries = (statusIds: string[]) => {
  // Create individual query results for each status ID
  const firstQuery = useStartupsByStatus(statusIds[0]);
  const secondQuery = useStartupsByStatus(statusIds[1]);
  const thirdQuery = useStartupsByStatus(statusIds[2]);
  const fourthQuery = useStartupsByStatus(statusIds[3]);
  const fifthQuery = useStartupsByStatus(statusIds[4]);
  const sixthQuery = useStartupsByStatus(statusIds[5]);
  const seventhQuery = useStartupsByStatus(statusIds[6]);
  const eighthQuery = useStartupsByStatus(statusIds[7]);
  
  // Combine all query results into a mapping
  const queries = useMemo(() => {
    const result: Record<string, any> = {};
    
    if (statusIds.length > 0) {
      if (statusIds[0]) result[statusIds[0]] = firstQuery;
      if (statusIds[1]) result[statusIds[1]] = secondQuery;
      if (statusIds[2]) result[statusIds[2]] = thirdQuery;
      if (statusIds[3]) result[statusIds[3]] = fourthQuery;
      if (statusIds[4]) result[statusIds[4]] = fifthQuery;
      if (statusIds[5]) result[statusIds[5]] = sixthQuery;
      if (statusIds[6]) result[statusIds[6]] = seventhQuery;
      if (statusIds[7]) result[statusIds[7]] = eighthQuery;
    }
    
    return result;
  }, [
    statusIds,
    firstQuery, secondQuery, thirdQuery, fourthQuery,
    fifthQuery, sixthQuery, seventhQuery, eighthQuery
  ]);
  
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
