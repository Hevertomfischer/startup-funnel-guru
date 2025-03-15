
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
  const handleDeleteStartup = (startupId: string) => {
    deleteStartupMutation.mutate(startupId, {
      onSuccess: () => {
        toast({
          title: "Startup deleted",
          description: "Startup has been removed"
        });
        
        // Invalidate all startup queries to update the UI
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
  };

  return {
    deleteStartupMutation,
    handleDeleteStartup
  };
}
