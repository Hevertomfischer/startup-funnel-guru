
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
    
    // Ensure we're only sending clean data to the API
    let preparedData = { ...data };
    
    // Always ensure we're using status_id, not statusId
    if (preparedData.statusId && !preparedData.status_id) {
      preparedData.status_id = preparedData.statusId;
      delete preparedData.statusId;
    }
    
    // IMPORTANT: Remove changed_by field to avoid conflicts with the database trigger
    delete preparedData.changed_by;
    
    // Ensure status_id is a string
    if (preparedData.status_id && typeof preparedData.status_id !== 'string') {
      preparedData.status_id = String(preparedData.status_id);
    }
    
    createStartupMutation.mutate(preparedData, {
      onSuccess: (response) => {
        console.log("Startup created successfully:", response);
        toast({
          title: "Startup created",
          description: `${data.name} has been added successfully`
        });
        setShowCreateDialog(false);
        
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ['startups'] });
        
        if (preparedData.status_id) {
          console.log("Invalidating query for status:", preparedData.status_id);
          queryClient.invalidateQueries({ 
            queryKey: ['startups', 'status', preparedData.status_id] 
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
    
    // Create a clean copy of the data
    let preparedData = { ...data };
    
    // Always ensure we're using status_id, not statusId
    if (preparedData.statusId && !preparedData.status_id) {
      preparedData.status_id = preparedData.statusId;
      delete preparedData.statusId;
    }
    
    // Store previous status_id for cache invalidation if status changed
    const oldStatusId = selectedStartup?.status_id;
    const currentStatusId = preparedData.status_id;
    const statusChanged = oldStatusId && currentStatusId && oldStatusId !== currentStatusId;
    
    // If tracking status changes for history, add old_status_id
    if (statusChanged) {
      preparedData.old_status_id = oldStatusId;
    }
    
    // IMPORTANT: Remove changed_by field to avoid conflicts with the database trigger
    delete preparedData.changed_by;
    
    // Ensure status_id is a string
    if (preparedData.status_id && typeof preparedData.status_id !== 'string') {
      preparedData.status_id = String(preparedData.status_id);
    }
    
    // Ensure assigned_to is a string or null
    if (preparedData.assigned_to === undefined || preparedData.assigned_to === '') {
      preparedData.assigned_to = null;
    } else if (preparedData.assigned_to && typeof preparedData.assigned_to !== 'string') {
      preparedData.assigned_to = String(preparedData.assigned_to);
    }
    
    console.log('Final data being sent to update mutation:', {
      id: selectedStartup.id,
      startup: preparedData
    });
    
    updateStartupMutation.mutate(
      { id: selectedStartup.id, startup: preparedData },
      {
        onSuccess: (response) => {
          console.log("Startup updated successfully:", response);
          toast({
            title: "Startup updated",
            description: `${preparedData.name || 'Startup'} has been updated successfully`
          });
          setShowEditDialog(false);
          
          // Invalidate queries
          queryClient.invalidateQueries({ queryKey: ['startups'] });
          
          if (currentStatusId) {
            queryClient.invalidateQueries({ 
              queryKey: ['startups', 'status', currentStatusId] 
            });
          }
          
          // Also invalidate previous status query if status was changed
          if (statusChanged) {
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
