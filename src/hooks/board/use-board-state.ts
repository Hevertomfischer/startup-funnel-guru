
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Startup } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useStartupActions } from './use-startup-actions';
import { useBoardColumns } from './use-board-columns';
import { useBoardDragDrop } from './use-board-drag-drop';
import { useBoardDialogs } from './use-board-dialogs';
import { useBoardSearch } from './use-board-search';
import { useStartupDeletion } from './use-startup-deletion';
import { useStatusQueries } from './use-status-queries';

export function useBoardState() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get the board columns
  const { 
    columns, 
    statuses, 
    isLoadingStatuses, 
    isErrorStatuses,
    setColumns
  } = useBoardColumns();
  
  // Get the startup queries for each status column
  const {
    mappedQueries,
    getStartupById
  } = useStatusQueries({ 
    statuses, 
    columns 
  });
  
  // Get drag and drop handlers
  const {
    draggingStartupId,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDrop
  } = useBoardDragDrop({
    columns,
    setColumns,
    queryClient,
    statuses,
    getStartupById
  });
  
  // Get the startup search functionality
  const {
    searchTerm,
    setSearchTerm
  } = useBoardSearch();
  
  // Get the startup deletion handler
  const {
    handleDeleteStartup
  } = useStartupDeletion({
    queryClient,
    toast
  });
  
  // Get all the startup dialog handlers
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
  
  // Get all the status dialog handlers
  const {
    showCreateStatusDialog,
    setShowCreateStatusDialog,
    statusToEdit,
    setStatusToEdit,
    handleStatusCreated,
    handleStatusUpdated
  } = useBoardDialogs({
    queryClient,
    toast
  });

  // Create task for a specific startup
  const handleCreateTask = useCallback((startup: Startup) => {
    navigate('/tasks', { state: { createTask: true, startupId: startup.id } });
  }, [navigate]);
  
  // Function to handle startup deletion - forwards the startupId to handleDeleteStartup
  const handleStartupDeletion = useCallback((startupId: string) => {
    handleDeleteStartup(startupId);
  }, [handleDeleteStartup]);
  
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
    handleDeleteStartup: handleStartupDeletion, // Use compatible function
    handleCreateTask,
    
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
