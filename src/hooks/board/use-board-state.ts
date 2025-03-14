
import { useState, useMemo, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Status } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useBoardColumns } from '@/hooks/board/use-board-columns';
import { useStatusQueries } from '@/hooks/board/use-status-queries';
import { useBoardDragDrop } from '@/hooks/board/use-board-drag-drop';
import { useStartupActions } from '@/hooks/use-startup-actions';
import { useDeleteStartupMutation } from '@/hooks/use-supabase-query';

export function useBoardState() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showCreateStatusDialog, setShowCreateStatusDialog] = useState(false);
  const [statusToEdit, setStatusToEdit] = useState<Status | null>(null);
  
  // Get board columns and statuses
  const {
    columns,
    setColumns,
    statusIds,
    statuses,
    isLoadingStatuses,
    isErrorStatuses,
    reorderColumns
  } = useBoardColumns();

  // Get status queries using our hook
  const { queries: mappedQueries, isLoading, isError } = useStatusQueries(statusIds || []);
  
  // Manual refresh instead of automatic subscription
  useEffect(() => {
    // Only set up refreshing when we have valid status IDs
    if (statusIds && statusIds.length > 0) {
      console.log("Setting up manual refresh for status queries");
      
      // Create a refresh interval
      const intervalId = setInterval(() => {
        statusIds.forEach(statusId => {
          if (statusId) {
            queryClient.invalidateQueries({ 
              queryKey: ['startups', 'status', statusId]
            });
          }
        });
      }, 10000); // Refresh every 10 seconds
      
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [queryClient, statusIds]);
  
  // Update columns with startup IDs from queries
  useEffect(() => {
    if (columns.length > 0 && mappedQueries) {
      const updatedColumns = columns.map(column => {
        const query = mappedQueries[column.id];
        if (query && query.data) {
          // Extract startup IDs from the query data
          const startupIds = query.data.map((startup: any) => startup.id);
          return {
            ...column,
            startupIds
          };
        }
        return column;
      });
      
      setColumns(updatedColumns);
    }
  }, [mappedQueries, columns, setColumns]);
  
  // Get a startup by ID from any status
  const getStartupById = useMemo(() => {
    return (id: string) => {
      for (const statusId in mappedQueries) {
        const query = mappedQueries[statusId];
        const startup = query?.data?.find((s: any) => s.id === id);
        if (startup) return startup;
      }
      return undefined;
    };
  }, [mappedQueries]);
  
  // Delete startup mutation
  const deleteStartupMutation = useDeleteStartupMutation();
  
  // Handle startup deletion
  const handleDeleteStartup = (startupId: string) => {
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
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to delete startup: ${(error as Error).message}`,
            variant: "destructive"
          });
        }
      });
    }
  };
  
  // Drag and drop functionality
  const {
    draggingStartupId,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  } = useBoardDragDrop(columns, setColumns, statuses, getStartupById);
  
  // Column drag functionality
  const handleColumnDragStart = (e: React.DragEvent, columnIndex: number) => {
    e.dataTransfer.setData('columnIndex', columnIndex.toString());
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleColumnDrop = (e: React.DragEvent, columnIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('columnIndex'));
    
    if (sourceIndex !== columnIndex) {
      reorderColumns(sourceIndex, columnIndex);
    }
  };
  
  // Startup actions
  const {
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
  } = useStartupActions();
  
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
    // Board state
    columns,
    statuses,
    isLoadingStatuses,
    isErrorStatuses,
    mappedQueries,
    
    // Handlers
    getStartupById,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    draggingStartupId,
    handleDeleteStartup,
    
    // Column drag handlers
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDrop,
    
    // Dialog state
    showCreateStatusDialog,
    setShowCreateStatusDialog,
    statusToEdit,
    setStatusToEdit,
    
    // Startup actions
    handleAddStartup,
    handleCardClick,
    handleCreateStartup,
    handleUpdateStartup,
    createStartupMutation,
    updateStartupMutation,
    deleteStartupMutation,
    selectedStartup,
    showCreateDialog,
    setShowCreateDialog,
    showEditDialog,
    setShowEditDialog,
    
    // Toast handlers
    handleStatusCreated,
    handleStatusUpdated
  };
}
