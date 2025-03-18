
import { useQuery } from '@tanstack/react-query';
import { getLabels, getStartupLabels } from '@/services';

// Label queries
export const useLabelsQuery = () => {
  return useQuery({
    queryKey: ['labels'],
    queryFn: getLabels
  });
};

export const useStartupLabelsQuery = (startupId?: string) => {
  return useQuery({
    queryKey: ['startup', startupId, 'labels'],
    queryFn: () => getStartupLabels(startupId!),
    enabled: !!startupId
  });
};
