
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStartupStatus } from '@/services';
import { toast } from 'sonner';

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
      console.log(`Mutation starting: Update startup ${id} from ${oldStatusId || 'unknown'} to ${newStatusId}`);
      
      // IMPROVED: More thorough UUID validation
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      // Check if the provided values are valid UUIDs
      if (!id || !uuidPattern.test(id)) {
        console.error(`Invalid startup ID format: ${id}`);
        throw new Error(`Invalid startup ID format: ${id}`);
      }
      
      if (!newStatusId || !uuidPattern.test(newStatusId)) {
        console.error(`Invalid status ID format: ${newStatusId}`);
        throw new Error(`Invalid status ID format: ${newStatusId}`);
      }
      
      // CRITICAL: Ensure newStatusId is not null or empty - redundant check but safer
      if (!newStatusId) {
        console.error('Status ID cannot be null or empty');
        throw new Error('Status ID cannot be null or empty');
      }
      
      // Ensure oldStatusId is either a valid UUID or undefined, but never null
      if (oldStatusId && !uuidPattern.test(oldStatusId)) {
        console.warn(`Invalid old status ID format: ${oldStatusId}. Setting to undefined.`);
        oldStatusId = undefined;
      }
      
      // Ensure UUIDs are properly formatted as strings
      const formattedId = typeof id === 'string' ? id : String(id);
      const formattedNewStatusId = typeof newStatusId === 'string' ? newStatusId : String(newStatusId);
      const formattedOldStatusId = oldStatusId && uuidPattern.test(oldStatusId) ? 
        (typeof oldStatusId === 'string' ? oldStatusId : String(oldStatusId)) : undefined;
      
      console.log(`Calling updateStartupStatus with:`, {
        id: formattedId,
        newStatusId: formattedNewStatusId,
        oldStatusId: formattedOldStatusId
      });
      
      // Call the service with properly formatted and validated IDs
      return updateStartupStatus(formattedId, formattedNewStatusId, formattedOldStatusId);
    },
    onSuccess: (data, variables) => {
      console.log("Status update succeeded:", data);
      
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
      
      toast.success('Card moved successfully');
    },
    onError: (error, variables) => {
      console.error("Status update failed:", error);
      console.error("Failed variables:", variables);
      
      toast.error(error instanceof Error ? error.message : 'Failed to update startup status');
      
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
