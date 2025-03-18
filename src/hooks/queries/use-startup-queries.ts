
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getStartups, 
  getStartupsByStatus,
  getStartup,
  createStartup,
  updateStartup,
  deleteStartup
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
      if (oldStatus && oldStatus !== data.status_id) {
        queryClient.invalidateQueries({ 
          queryKey: ['startups', 'status', oldStatus]
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
