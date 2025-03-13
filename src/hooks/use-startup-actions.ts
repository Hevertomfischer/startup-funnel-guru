
import { useToast } from '@/hooks/use-toast';
import { useCreateStartupMutation } from './use-supabase-query';

export function useStartupActions() {
  const { toast } = useToast();
  
  // Create new startup mutation
  const createStartupMutation = useCreateStartupMutation();
  
  const handleAddStartup = (statusId: string) => {
    // In a real app, this would open a form to create a new startup
    // For now, we'll create a simple startup with default values
    createStartupMutation.mutate({
      name: `New Startup ${Date.now()}`,
      status_id: statusId,
      priority: 'medium',
      description: null,
      problem_solved: null,
      sector: null,
      business_model: null,
      website: null,
      mrr: null,
      client_count: null,
      assigned_to: null,
      due_date: null,
      time_tracking: 0
    });
  };
  
  const handleCardClick = (startup: any) => {
    toast({
      title: "Startup details",
      description: `Opening details for ${startup.name}`,
    });
    // Navigate to startup details page would go here
  };

  return {
    createStartupMutation,
    handleAddStartup,
    handleCardClick
  };
}
