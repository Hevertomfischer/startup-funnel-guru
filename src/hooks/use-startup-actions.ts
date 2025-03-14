
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { 
  useCreateStartupMutation, 
  useUpdateStartupMutation
} from './use-supabase-query';

export function useStartupActions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStartup, setSelectedStartup] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  // Create new startup mutation
  const createStartupMutation = useCreateStartupMutation();
  
  // Update startup mutation
  const updateStartupMutation = useUpdateStartupMutation();
  
  const handleAddStartup = (statusId: string) => {
    console.log("handleAddStartup called with statusId:", statusId);
    setSelectedStartup({ status_id: statusId });
    setShowCreateDialog(true);
    console.log("After setting dialog state - showCreateDialog:", true);
  };
  
  const handleCreateStartup = (data: any) => {
    console.log("Creating startup with data:", data);
    createStartupMutation.mutate(data, {
      onSuccess: (response) => {
        console.log("Startup created successfully:", response);
        toast({
          title: "Startup created",
          description: `${data.name} has been added successfully`
        });
        setShowCreateDialog(false);
        queryClient.invalidateQueries({ queryKey: ['startups'] });
      },
      onError: (error) => {
        console.error("Error creating startup:", error);
        toast({
          title: "Error",
          description: `Failed to create startup: ${error.message}`,
          variant: "destructive"
        });
      }
    });
  };
  
  const handleEditStartup = (startup: any) => {
    setSelectedStartup(startup);
    setShowEditDialog(true);
  };
  
  const handleUpdateStartup = (data: any) => {
    console.log("Updating startup with data:", data);
    updateStartupMutation.mutate(
      { id: selectedStartup.id, startup: data },
      {
        onSuccess: (response) => {
          console.log("Startup updated successfully:", response);
          toast({
            title: "Startup updated",
            description: `${data.name} has been updated successfully`
          });
          setShowEditDialog(false);
          queryClient.invalidateQueries({ queryKey: ['startups'] });
        },
        onError: (error) => {
          console.error("Error updating startup:", error);
          toast({
            title: "Error",
            description: `Failed to update startup: ${error.message}`,
            variant: "destructive"
          });
        }
      }
    );
  };
  
  const handleCardClick = (startup: any) => {
    handleEditStartup(startup);
  };

  return {
    createStartupMutation,
    updateStartupMutation,
    selectedStartup,
    showCreateDialog,
    setShowCreateDialog,
    showEditDialog,
    setShowEditDialog,
    handleAddStartup,
    handleCreateStartup,
    handleEditStartup,
    handleUpdateStartup,
    handleCardClick
  };
}
