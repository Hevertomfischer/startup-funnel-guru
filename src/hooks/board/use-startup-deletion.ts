
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { deleteStartup } from '@/services';

export function useStartupDeletion({
  queryClient,
  toast
}: {
  queryClient: ReturnType<typeof useQueryClient>;
  toast: ReturnType<typeof useToast>['toast'];
}) {
  // Function to handle startup deletion
  const handleDeleteStartup = useCallback(async (startupId: string) => {
    if (!startupId) {
      console.error('No startup ID provided for deletion');
      return;
    }
    
    try {
      // Call the API to delete the startup
      await deleteStartup(startupId);
      
      // Invalidate the startups queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['startups'] });
      
      // Show success toast
      toast({
        title: "Startup deleted",
        description: "The startup has been removed"
      });
    } catch (error) {
      console.error('Error deleting startup:', error);
      toast({
        title: "Error",
        description: "Failed to delete the startup",
        variant: "destructive"
      });
    }
  }, [queryClient, toast]);
  
  return { handleDeleteStartup };
}
