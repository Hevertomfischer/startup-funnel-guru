
import { useMemo } from 'react';

/**
 * Checks if any real query (not placeholder) is loading
 */
export const useIsAnyQueryLoading = (
  statusIds: string[], 
  queries: Record<string, { isLoading: boolean }>
) => {
  return useMemo(() => {
    return statusIds.some((id) => {
      if (!id || id.startsWith('placeholder-')) return false;
      const query = queries[id];
      return query?.isLoading;
    });
  }, [statusIds, queries]);
};

/**
 * Checks if any real query (not placeholder) has an error
 */
export const useIsAnyQueryError = (
  statusIds: string[], 
  queries: Record<string, { isError: boolean }>
) => {
  return useMemo(() => {
    return statusIds.some((id) => {
      if (!id || id.startsWith('placeholder-')) return false;
      const query = queries[id];
      return query?.isError;
    });
  }, [statusIds, queries]);
};
