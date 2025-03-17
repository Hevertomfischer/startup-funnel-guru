
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { 
  useCreateStartupMutation, 
  useUpdateStartupMutation
} from '@/hooks/use-supabase-query';
import { Startup } from '@/integrations/supabase/client';

export function useStartupActions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStartup, setSelectedStartup] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  // Create and update mutations
  const createStartupMutation = useCreateStartupMutation();
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
        
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ['startups'] });
        
        if (data.status_id) {
          console.log("Invalidating query for status:", data.status_id);
          queryClient.invalidateQueries({ 
            queryKey: ['startups', 'status', data.status_id] 
          });
        }
      },
      onError: (error: any) => {
        console.error("Error creating startup:", error);
        toast({
          title: "Error",
          description: `Failed to create startup: ${error.message || 'Unknown error'}`,
          variant: "destructive"
        });
      }
    });
  };
  
  const handleEditStartup = (startup: any) => {
    // Store the complete startup object for reference
    setSelectedStartup(startup);
    setShowEditDialog(true);
  };
  
  const handleUpdateStartup = (data: any) => {
    console.log("Updating startup with data:", data);
    
    // Make sure we have the proper status_id field name
    if (!data.status_id && data.statusId) {
      data.status_id = data.statusId;
      delete data.statusId; // Remove the incorrect field
    }
    
    // If we need to track old status, explicitly add it as status history field
    // but don't try to update the database field that doesn't exist
    const oldStatusId = selectedStartup?.status_id;
    const currentStatusId = data.status_id;
    const trackOldStatus = oldStatusId && currentStatusId && oldStatusId !== currentStatusId;
    
    // Don't pass old_status_id to the database update
    // It will be used only for cache invalidation
    const { old_status_id, ...updateData } = data;
    
    updateStartupMutation.mutate(
      { id: selectedStartup.id, startup: updateData },
      {
        onSuccess: (response) => {
          console.log("Startup updated successfully:", response);
          toast({
            title: "Startup updated",
            description: `${data.name} has been updated successfully`
          });
          setShowEditDialog(false);
          
          // Invalidate queries
          queryClient.invalidateQueries({ queryKey: ['startups'] });
          
          if (data.status_id) {
            queryClient.invalidateQueries({ 
              queryKey: ['startups', 'status', data.status_id] 
            });
          }
          
          // Also invalidate previous status query if status was changed
          if (trackOldStatus) {
            queryClient.invalidateQueries({ 
              queryKey: ['startups', 'status', oldStatusId] 
            });
          }
        },
        onError: (error: any) => {
          console.error("Error updating startup:", error);
          toast({
            title: "Error",
            description: `Failed to update startup: ${error.message || 'Unknown error'}`,
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
