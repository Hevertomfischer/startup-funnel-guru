
import { useMemo } from 'react';
import { useStartupsByStatus } from '../use-startups-by-status';

export const useStatusQueries = (statusIds: string[]) => {
  // Create an array to hold all the query results
  const queryResults = [];
  
  // Use all hooks at the top level (Rule #1 of React Hooks)
  // This ensures hooks are called in the same order on every render
  const status1Query = statusIds[0] ? useStartupsByStatus(statusIds[0]) : { data: [], isLoading: false, isError: false };
  if (statusIds[0]) queryResults.push({ statusId: statusIds[0], ...status1Query });
  
  const status2Query = statusIds[1] ? useStartupsByStatus(statusIds[1]) : { data: [], isLoading: false, isError: false };
  if (statusIds[1]) queryResults.push({ statusId: statusIds[1], ...status2Query });
  
  const status3Query = statusIds[2] ? useStartupsByStatus(statusIds[2]) : { data: [], isLoading: false, isError: false };
  if (statusIds[2]) queryResults.push({ statusId: statusIds[2], ...status3Query });
  
  const status4Query = statusIds[3] ? useStartupsByStatus(statusIds[3]) : { data: [], isLoading: false, isError: false };
  if (statusIds[3]) queryResults.push({ statusId: statusIds[3], ...status4Query });
  
  const status5Query = statusIds[4] ? useStartupsByStatus(statusIds[4]) : { data: [], isLoading: false, isError: false };
  if (statusIds[4]) queryResults.push({ statusId: statusIds[4], ...status5Query });
  
  const status6Query = statusIds[5] ? useStartupsByStatus(statusIds[5]) : { data: [], isLoading: false, isError: false };
  if (statusIds[5]) queryResults.push({ statusId: statusIds[5], ...status6Query });
  
  const status7Query = statusIds[6] ? useStartupsByStatus(statusIds[6]) : { data: [], isLoading: false, isError: false };
  if (statusIds[6]) queryResults.push({ statusId: statusIds[6], ...status7Query });
  
  const status8Query = statusIds[7] ? useStartupsByStatus(statusIds[7]) : { data: [], isLoading: false, isError: false };
  if (statusIds[7]) queryResults.push({ statusId: statusIds[7], ...status8Query });
  
  const status9Query = statusIds[8] ? useStartupsByStatus(statusIds[8]) : { data: [], isLoading: false, isError: false };
  if (statusIds[8]) queryResults.push({ statusId: statusIds[8], ...status9Query });
  
  const status10Query = statusIds[9] ? useStartupsByStatus(statusIds[9]) : { data: [], isLoading: false, isError: false };
  if (statusIds[9]) queryResults.push({ statusId: statusIds[9], ...status10Query });
  
  const status11Query = statusIds[10] ? useStartupsByStatus(statusIds[10]) : { data: [], isLoading: false, isError: false };
  if (statusIds[10]) queryResults.push({ statusId: statusIds[10], ...status11Query });
  
  const status12Query = statusIds[11] ? useStartupsByStatus(statusIds[11]) : { data: [], isLoading: false, isError: false };
  if (statusIds[11]) queryResults.push({ statusId: statusIds[11], ...status12Query });
  
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
