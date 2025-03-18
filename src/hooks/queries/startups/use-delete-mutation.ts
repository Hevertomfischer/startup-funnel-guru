
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteStartup } from '@/services';

export const useDeleteStartupMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteStartup,
    onSuccess: (_, variables) => {
      // Invalidate generic startups query
      queryClient.invalidateQueries({ queryKey: ['startups'] });
      
      // Invalidate specific startup query
      queryClient.invalidateQueries({ queryKey: ['startup', variables] });
      
      // Get the deleted startup to find its status
      const deletedStartup = queryClient.getQueryData(['startup', variables]);
      if (deletedStartup && (deletedStartup as any).status_id) {
        queryClient.invalidateQueries({ 
          queryKey: ['startups', 'status', (deletedStartup as any).status_id] 
        });
      }
    }
  });
};
