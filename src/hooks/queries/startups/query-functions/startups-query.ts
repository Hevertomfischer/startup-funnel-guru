
import { useQuery } from '@tanstack/react-query';
import { getStartups } from '@/services';
import { getBackoffDelay } from '../query-helpers';

/**
 * Hook for fetching all startups
 */
export const useStartupsQuery = () => {
  return useQuery({
    queryKey: ['startups'],
    queryFn: getStartups,
    retry: 3,
    retryDelay: getBackoffDelay
  });
};
