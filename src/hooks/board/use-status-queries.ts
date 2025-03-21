
import { useMemo, useEffect } from 'react';
import { useStartupsByStatus } from '../use-startups-by-status';

export const useStatusQueries = ({ statuses, columns }: { statuses: any[], columns: any[] }) => {
  // Get all status IDs from the columns array
  const statusIds = useMemo(() => 
    columns.map(column => column.id),
    [columns]
  );

  // Each hook must be called unconditionally at the top level
  // We'll use fixed number of hooks based on maximum possible number of statuses
  // We're using 12 as the maximum number of possible statuses
  const query1 = useStartupsByStatus(statusIds[0] || 'placeholder-1');
  const query2 = useStartupsByStatus(statusIds[1] || 'placeholder-2');
  const query3 = useStartupsByStatus(statusIds[2] || 'placeholder-3');
  const query4 = useStartupsByStatus(statusIds[3] || 'placeholder-4');
  const query5 = useStartupsByStatus(statusIds[4] || 'placeholder-5');
  const query6 = useStartupsByStatus(statusIds[5] || 'placeholder-6');
  const query7 = useStartupsByStatus(statusIds[6] || 'placeholder-7');
  const query8 = useStartupsByStatus(statusIds[7] || 'placeholder-8');
  const query9 = useStartupsByStatus(statusIds[8] || 'placeholder-9');
  const query10 = useStartupsByStatus(statusIds[9] || 'placeholder-10');
  const query11 = useStartupsByStatus(statusIds[10] || 'placeholder-11');
  const query12 = useStartupsByStatus(statusIds[11] || 'placeholder-12');

  // Combine real queries into results array based on available statusIds
  const queryResults = useMemo(() => {
    const results = [];
    
    if (statusIds[0]) results.push({ statusId: statusIds[0], ...query1 });
    if (statusIds[1]) results.push({ statusId: statusIds[1], ...query2 });
    if (statusIds[2]) results.push({ statusId: statusIds[2], ...query3 });
    if (statusIds[3]) results.push({ statusId: statusIds[3], ...query4 });
    if (statusIds[4]) results.push({ statusId: statusIds[4], ...query5 });
    if (statusIds[5]) results.push({ statusId: statusIds[5], ...query6 });
    if (statusIds[6]) results.push({ statusId: statusIds[6], ...query7 });
    if (statusIds[7]) results.push({ statusId: statusIds[7], ...query8 });
    if (statusIds[8]) results.push({ statusId: statusIds[8], ...query9 });
    if (statusIds[9]) results.push({ statusId: statusIds[9], ...query10 });
    if (statusIds[10]) results.push({ statusId: statusIds[10], ...query11 });
    if (statusIds[11]) results.push({ statusId: statusIds[11], ...query12 });
    
    return results;
  }, [
    statusIds,
    query1, query2, query3, query4, query5, query6,
    query7, query8, query9, query10, query11, query12
  ]);
  
  // Map queries to their status IDs
  const queries = useMemo(() => {
    const result: Record<string, any> = {};
    
    queryResults.forEach(({ statusId, ...query }) => {
      result[statusId] = query;
    });
    
    return result;
  }, [queryResults]);
  
  // Update the startupIds in columns based on query data
  useEffect(() => {
    if (columns.length > 0) {
      // Only update if we have columns and data
      const updatedColumns = columns.map(column => {
        const query = queries[column.id];
        if (query && query.data) {
          // Extract IDs from the query data
          const startupIds = query.data.map((startup: any) => startup.id);
          return {
            ...column,
            startupIds: startupIds
          };
        }
        return column;
      });

      // Update columns with startupIds
      if (updatedColumns.some((col, i) => col.startupIds.length !== columns[i].startupIds.length)) {
        console.log('Updating columns with startupIds', updatedColumns);
      }
    }
  }, [columns, queries]);
  
  // Check if any real query (not placeholder) is loading
  const isLoading = useMemo(() => {
    return statusIds.some((id, index) => {
      if (!id) return false;
      const queryIndex = index + 1;
      const query = eval(`query${queryIndex}`);
      return query.isLoading;
    });
  }, [
    statusIds,
    query1, query2, query3, query4, query5, query6,
    query7, query8, query9, query10, query11, query12
  ]);
  
  // Check if any real query (not placeholder) has an error
  const isError = useMemo(() => {
    return statusIds.some((id, index) => {
      if (!id) return false;
      const queryIndex = index + 1;
      const query = eval(`query${queryIndex}`);
      return query.isError;
    });
  }, [
    statusIds,
    query1, query2, query3, query4, query5, query6,
    query7, query8, query9, query10, query11, query12
  ]);

  // Create a function to get a startup by its ID from any of the queries
  const getStartupById = (id: string) => {
    // Check all status queries
    for (const statusId of statusIds) {
      if (!statusId) continue;
      const query = queries[statusId];
      if (!query || !query.data) continue;
      
      // Find startup in the data array
      const startup = query.data.find((s: any) => s.id === id);
      if (startup) return startup;
    }
    return undefined;
  };
  
  return { 
    queries, 
    isLoading, 
    isError,
    mappedQueries: queries, // Add mappedQueries alias for backward compatibility
    getStartupById 
  };
};
