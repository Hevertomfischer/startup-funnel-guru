
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStartupStatus } from '@/services';

/**
 * Specialized mutation hook for updating startup status
 * This is used for drag & drop operations
 */
export const useUpdateStartupStatusMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      id, 
      newStatusId, 
      oldStatusId 
    }: { 
      id: string; 
      newStatusId: string; 
      oldStatusId?: string 
    }) => {
      console.log(`Mutation starting: Update startup ${id} from ${oldStatusId} to ${newStatusId}`);
      return updateStartupStatus(id, newStatusId, oldStatusId);
    },
    onSuccess: (data, variables) => {
      console.log("Status update succeeded:", data);
      
      if (!data) {
        console.warn("Status update succeeded but no data returned");
        return;
      }
      
      // Invalidate generic startups query
      queryClient.invalidateQueries({ queryKey: ['startups'] });
      
      // Invalidate specific startup query
      queryClient.invalidateQueries({ queryKey: ['startup', variables.id] });
      
      // Invalidate new status query
      queryClient.invalidateQueries({ 
        queryKey: ['startups', 'status', variables.newStatusId]
      });
      
      // If we know the old status, invalidate that query too
      if (variables.oldStatusId) {
        queryClient.invalidateQueries({ 
          queryKey: ['startups', 'status', variables.oldStatusId]
        });
      }
    },
    onError: (error, variables) => {
      console.error("Status update failed:", error);
      console.error("Failed variables:", variables);
      
      // Invalidate queries to ensure UI is up-to-date
      queryClient.invalidateQueries({ queryKey: ['startups'] });
      queryClient.invalidateQueries({ queryKey: ['startup', variables.id] });
      
      if (variables.newStatusId) {
        queryClient.invalidateQueries({ 
          queryKey: ['startups', 'status', variables.newStatusId]
        });
      }
      
      if (variables.oldStatusId) {
        queryClient.invalidateQueries({ 
          queryKey: ['startups', 'status', variables.oldStatusId]
        });
      }
    }
  });
};
