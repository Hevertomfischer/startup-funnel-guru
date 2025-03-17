
import { useState } from 'react';
import { Status } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export function useBoardDialogs() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showCreateStatusDialog, setShowCreateStatusDialog] = useState(false);
  const [statusToEdit, setStatusToEdit] = useState<Status | null>(null);
  
  // Status handlers
  const handleStatusCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['statuses'] });
    toast({
      title: "Status created",
      description: "The new column has been added to the board"
    });
  };

  const handleStatusUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ['statuses'] });
    toast({
      title: "Status updated",
      description: "The column has been updated"
    });
  };

  return {
    showCreateStatusDialog,
    setShowCreateStatusDialog,
    statusToEdit,
    setStatusToEdit,
    handleStatusCreated,
    handleStatusUpdated,
    queryClient,
    toast
  };
}
