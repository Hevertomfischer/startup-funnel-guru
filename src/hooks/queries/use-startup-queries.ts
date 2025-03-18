
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getStartups, 
  getStartupsByStatus,
  getStartup,
  createStartup,
  updateStartup,
  updateStartupStatus
} from '@/services';

// Basic startup queries
export const useStartupsQuery = () => {
  return useQuery({
    queryKey: ['startups'],
    queryFn: getStartups
  });
};

export const useStartupsByStatusQuery = (statusId: string) => {
  // Check if this is a placeholder ID (for conditional rendering)
  const isPlaceholder = statusId.startsWith('placeholder-');
  
  return useQuery({
    queryKey: ['startups', 'status', statusId],
    queryFn: () => getStartupsByStatus(statusId),
    enabled: !!statusId && !isPlaceholder, // Don't run query for placeholder IDs
    staleTime: isPlaceholder ? Infinity : 5000, // 5 seconds for real queries, Infinity for placeholders
    gcTime: isPlaceholder ? 0 : 60000, // 1 minute for real queries, 0 for placeholders
    refetchInterval: isPlaceholder ? false : 10000 // Auto refresh every 10 seconds for real status
  });
};

export const useStartupQuery = (id?: string) => {
  return useQuery({
    queryKey: ['startup', id],
    queryFn: () => getStartup(id!),
    enabled: !!id
  });
};

// Startup mutations
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
    }) => updateStartupStatus(id, newStatusId, oldStatusId),
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
    },
    onError: (error, variables) => {
      console.error("Status update failed:", error);
      console.error("Failed variables:", variables);
      
      // Invalidate queries to ensure UI is up-to-date
      queryClient.invalidateQueries({ queryKey: ['startups'] });
      queryClient.invalidateQueries({ queryKey: ['startup', variables.id] });
      queryClient.invalidateQueries({ 
        queryKey: ['startups', 'status', variables.newStatusId]
      });
      if (variables.oldStatusId) {
        queryClient.invalidateQueries({ 
          queryKey: ['startups', 'status', variables.oldStatusId]
        });
      }
    }
  });
};

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
