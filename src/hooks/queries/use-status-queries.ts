
import { useQuery } from '@tanstack/react-query';
import { getStatuses } from '@/services';

// Status queries
export const useStatusesQuery = () => {
  return useQuery({
    queryKey: ['statuses'],
    queryFn: getStatuses
  });
};
