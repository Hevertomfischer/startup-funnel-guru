
import { useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useBoardColumns } from '@/hooks/board/use-board-columns';
import { useStatusQueries } from '@/hooks/board/use-status-queries';
import { useBoardDragDrop } from '@/hooks/board/use-board-drag-drop';
import { useStartupActions } from '@/hooks/use-startup-actions';
import { useBoardSearch } from '@/hooks/board/use-board-search';
import { useBoardDialogs } from '@/hooks/board/use-board-dialogs';
import { useStartupDeletion } from '@/hooks/board/use-startup-deletion';

export function useBoardState() {
  const queryClient = useQueryClient();
  
  // Get board search functionality
  const { searchTerm, setSearchTerm, handleSearch } = useBoardSearch();
  
  // Get dialog state management
  const {
    showCreateStatusDialog,
    setShowCreateStatusDialog,
    statusToEdit,
    setStatusToEdit,
    handleStatusCreated,
    handleStatusUpdated
  } = useBoardDialogs();
  
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
          let startupIds = query.data.map((startup: any) => startup.id);
          
          // Filter by search term if one exists
          if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            startupIds = query.data
              .filter((startup: any) => {
                const nameMatch = (startup.name || '').toLowerCase().includes(searchLower);
                const sectorMatch = (startup.sector || '').toLowerCase().includes(searchLower);
                const problemMatch = (startup.problem_solved || '').toLowerCase().includes(searchLower);
                const businessModelMatch = (startup.business_model || '').toLowerCase().includes(searchLower);
                
                return nameMatch || sectorMatch || problemMatch || businessModelMatch;
              })
              .map((startup: any) => startup.id);
          }
          
          return {
            ...column,
            startupIds
          };
        }
        return column;
      });
      
      setColumns(updatedColumns);
    }
  }, [mappedQueries, columns, setColumns, searchTerm]);
  
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
  
  // Get startup deletion functionality
  const { deleteStartupMutation, handleDeleteStartup: baseHandleDeleteStartup } = useStartupDeletion();
  
  // Wire up the handleDeleteStartup to use our getStartupById
  const handleDeleteStartup = (startupId: string) => {
    baseHandleDeleteStartup(startupId, getStartupById);
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
    e.dataTransfer.setData('type', 'column');
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleColumnDrop = (e: React.DragEvent, columnIndex: number) => {
    e.preventDefault();
    
    // Only handle column reordering if a column is being dragged
    const type = e.dataTransfer.getData('type');
    if (type !== 'column') return;
    
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
    handleUpdateStartup,
    handleCardClick
  } = useStartupActions();

  return {
    // Board state
    columns,
    statuses,
    isLoadingStatuses,
    isErrorStatuses,
    mappedQueries,
    searchTerm,
    setSearchTerm,
    
    // Handlers
    getStartupById,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    draggingStartupId,
    handleDeleteStartup,
    handleSearch,
    
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
