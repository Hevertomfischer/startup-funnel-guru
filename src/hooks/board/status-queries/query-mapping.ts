
import { useMemo } from 'react';

/**
 * Maps query results to their status IDs
 */
export const useQueriesMapping = (queryResults: Array<{statusId: string, data: any[], isLoading: boolean, isError: boolean}>) => {
  return useMemo(() => {
    const result: Record<string, any> = {};
    
    queryResults.forEach(({ statusId, ...query }) => {
      result[statusId] = query;
    });
    
    console.log("Final mapped queries:", {
      queriesCount: Object.keys(result).length,
      queriesKeys: Object.keys(result),
      queriesSummary: Object.entries(result).map(([key, val]) => ({
        statusId: key,
        dataCount: (val as any).data?.length || 0,
        isLoading: (val as any).isLoading,
        isError: (val as any).isError
      }))
    });
    
    return result;
  }, [queryResults]);
};
