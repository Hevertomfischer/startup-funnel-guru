
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStartup } from '@/services';
import { toast } from 'sonner';

export const useUpdateStartupMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, startup }: { id: string; startup: any }) => 
      updateStartup(id, startup),
    onSuccess: (data, variables) => {
      console.log("Update mutation succeeded with data:", data);
      console.log("Update variables:", variables);
      
      // Invalidate generic startups query
      queryClient.invalidateQueries({ queryKey: ['startups'] });
      
      // Invalidate specific startup query
      queryClient.invalidateQueries({ queryKey: ['startup', variables.id] });
      
      // If we have the startup data with status_id, invalidate that specific status query
      if (data && data.status_id) {
        queryClient.invalidateQueries({ 
          queryKey: ['startups', 'status', data.status_id]
        });
      }
      
      // If status changed, also invalidate previous status
      const oldStatus = variables.startup.old_status_id;
      if (oldStatus && oldStatus !== data?.status_id) {
        queryClient.invalidateQueries({ 
          queryKey: ['startups', 'status', oldStatus]
        });
      }
    },
    onError: (error, variables) => {
      console.error("Update mutation failed:", error);
      console.error("Failed update variables:", variables);
      
      toast.error(`Failed to update startup: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Even on error, invalidate the queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['startups'] });
      if (variables.startup.status_id) {
        queryClient.invalidateQueries({ 
          queryKey: ['startups', 'status', variables.startup.status_id]
        });
      }
      if (variables.startup.old_status_id) {
        queryClient.invalidateQueries({ 
          queryKey: ['startups', 'status', variables.startup.old_status_id]
        });
      }
    }
  });
};
