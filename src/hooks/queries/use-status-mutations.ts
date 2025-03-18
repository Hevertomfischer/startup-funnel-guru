
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStatusPositions } from '@/services';

// Status mutations
export const useUpdateStatusPositionsMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateStatusPositions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statuses'] });
    }
  });
};
