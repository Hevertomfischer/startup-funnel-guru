
import { useDeleteStartupMutation } from '@/hooks/use-supabase-query';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface UseStartupDeletionParams {
  queryClient: any;
  toast: any;
}

export function useStartupDeletion({ queryClient, toast }: UseStartupDeletionParams) {
  // Delete startup mutation
  const deleteStartupMutation = useDeleteStartupMutation();
  
  // Handle startup deletion
  const handleDeleteStartup = (startupId: string, getStartupById: (id: string) => any) => {
    const startup = getStartupById(startupId);
    
    if (!startup) {
      toast({
        title: "Error",
        description: "Startup not found",
        variant: "destructive"
      });
      return;
    }
    
    // Confirm deletion
    if (confirm(`Are you sure you want to delete "${startup.name}"?`)) {
      deleteStartupMutation.mutate(startupId, {
        onSuccess: () => {
          toast({
            title: "Startup deleted",
            description: `${startup.name} has been removed`
          });
          
          // Invalidate queries to update the UI
          if (startup.status_id) {
            queryClient.invalidateQueries({ 
              queryKey: ['startups', 'status', startup.status_id] 
            });
          }
          queryClient.invalidateQueries({ queryKey: ['startups'] });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: `Failed to delete startup: ${(error as Error).message}`,
            variant: "destructive"
          });
        }
      });
    }
  };

  return {
    deleteStartupMutation,
    handleDeleteStartup
  };
}
