
import { useState, useMemo, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Status } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useBoardColumns } from '@/hooks/board/use-board-columns';
import { useStatusQueries } from '@/hooks/board/use-status-queries';
import { useBoardDragDrop } from '@/hooks/board/use-board-drag-drop';
import { useStartupActions } from '@/hooks/use-startup-actions';

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
  
  // Force refresh on create or update
  useEffect(() => {
    // Subscribe to all status queries
    const subscription = queryClient.getQueryCache().subscribe(() => {
      console.log("Query cache updated, refreshing board state");
      
      // After any query updates, make sure column IDs are updated
      if (statusIds && statusIds.length > 0) {
        statusIds.forEach(statusId => {
          if (statusId) {
            console.log(`Refreshing query for status: ${statusId}`);
            queryClient.refetchQueries({ 
              queryKey: ['startups', 'status', statusId],
              exact: true
            });
          }
        });
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, statusIds]);
  
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
