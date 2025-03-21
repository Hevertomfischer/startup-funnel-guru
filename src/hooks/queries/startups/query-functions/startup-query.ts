
import { useQuery } from '@tanstack/react-query';
import { getStartup } from '@/services';
import { getBackoffDelay } from '../query-helpers';

/**
 * Hook for fetching a single startup by ID
 */
export const useStartupQuery = (id?: string) => {
  return useQuery({
    queryKey: ['startup', id],
    queryFn: () => getStartup(id!),
    enabled: !!id,
    retry: 3,
    retryDelay: getBackoffDelay
  });
};
