
import { useMemo } from 'react';
import { useStartupsByStatus } from '@/hooks/use-startups-by-status';

/**
 * Creates a fixed set of query hooks for each board status
 */
export const useStatusQueryHooks = (statusIds: string[]) => {
  // Each hook must be called unconditionally at the top level
  // We'll use fixed number of hooks based on maximum possible number of statuses
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

  return {
    query1, query2, query3, query4, 
    query5, query6, query7, query8,
    query9, query10, query11, query12
  };
};

/**
 * Combines queries into results array based on available statusIds
 */
export const useQueryResults = (
  statusIds: string[],
  queryHooks: ReturnType<typeof useStatusQueryHooks>
) => {
  const { 
    query1, query2, query3, query4, 
    query5, query6, query7, query8,
    query9, query10, query11, query12 
  } = queryHooks;

  return useMemo(() => {
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
};
