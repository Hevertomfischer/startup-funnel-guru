
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStartup } from '@/services';

export const useCreateStartupMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createStartup,
    onSuccess: (data) => {
      console.log("Mutation completed successfully with data:", data);
      
      // Invalidate generic startups query
      queryClient.invalidateQueries({ queryKey: ['startups'] });
      
      // If we have the startup data with status_id, invalidate that specific status query
      if (data && data.status_id) {
        queryClient.invalidateQueries({ 
          queryKey: ['startups', 'status', data.status_id]
        });
      }
    }
  });
};
