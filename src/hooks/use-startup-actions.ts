
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { 
  useCreateStartupMutation, 
  useUpdateStartupMutation
} from './use-supabase-query';
import { Status } from '@/types';

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
    setSelectedStartup({ status_id: statusId });
    setShowCreateDialog(true);
  };
  
  const handleCreateStartup = (data: any) => {
    createStartupMutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Startup created",
          description: `${data.name} has been added successfully`
        });
        setShowCreateDialog(false);
        queryClient.invalidateQueries({ queryKey: ['startups'] });
      },
      onError: (error) => {
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
    updateStartupMutation.mutate(
      { id: selectedStartup.id, startup: data },
      {
        onSuccess: () => {
          toast({
            title: "Startup updated",
            description: `${data.name} has been updated successfully`
          });
          setShowEditDialog(false);
          queryClient.invalidateQueries({ queryKey: ['startups'] });
        },
        onError: (error) => {
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
