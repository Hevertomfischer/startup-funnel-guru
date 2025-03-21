
import React, { useState, useEffect } from 'react';
import { useBoardState } from '@/hooks/board/use-board-state';
import { useConnectionCheck } from '@/hooks/board/use-connection-check';
import BoardContent from '@/components/board/BoardContent';
import BoardDialogs from '@/components/board/BoardDialogs';
import BoardStateManager from '@/components/board/states/BoardStateManager';
import BoardDebugInfo from '@/components/board/debug/BoardDebugInfo';
import { toast } from '@/components/ui/use-toast';

const BoardView = () => {
  // Component state
  const [showCompactCards, setShowCompactCards] = useState(false);
  const [loadingStartTime] = useState(Date.now());
  const [showExtendedDebug, setShowExtendedDebug] = useState(false);
  
  // Check connection with Supabase
  const { connectionError, isRetrying, statusesCount, handleRetryConnection } = useConnectionCheck();
  
  // Use the board state hook to get all data and handlers
  const boardState = useBoardState();
  
  const {
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
  } = boardState;
  
  // Check if loading is taking too long
  useEffect(() => {
    const loadingTimeoutId = setTimeout(() => {
      if (isLoadingStatuses && !connectionError) {
        console.log("Carregamento demorado detectado");
        toast({
          title: "Carregamento demorado",
          description: "O carregamento está demorando mais que o esperado. Tentando reconectar...",
        });
        
        // Show additional debug information
        setShowExtendedDebug(true);
      }
    }, 10000); // 10 seconds

    return () => clearTimeout(loadingTimeoutId);
  }, [isLoadingStatuses, connectionError]);
  
  // Detailed logs about current state
  console.log("BoardView renderizando", { 
    columnsCount: columns?.length || 0,
    statusesCount: statuses?.length || 0,
    isLoadingStatuses,
    isErrorStatuses,
    hasQueries: Object.keys(mappedQueries || {}).length,
    connectionError,
    loadingTime: (Date.now() - loadingStartTime) / 1000, // loading time in seconds
    queriesSummary: Object.entries(mappedQueries || {}).map(([key, val]) => ({
      statusId: key,
      dataCount: (val as any).data?.length || 0,
      isLoading: (val as any).isLoading,
      isError: (val as any).isError
    }))
  });
  
  // Function to toggle debug mode
  const toggleDebugMode = () => {
    setShowExtendedDebug(prev => !prev);
  };
  
  return (
    <BoardStateManager
      connectionError={connectionError}
      isRetrying={isRetrying}
      handleRetryConnection={handleRetryConnection}
      isLoadingStatuses={isLoadingStatuses}
      isErrorStatuses={isErrorStatuses}
      statuses={statuses}
      showExtendedDebug={showExtendedDebug}
      toggleDebugMode={toggleDebugMode}
      loadingStartTime={loadingStartTime}
      statusesCount={statusesCount}
      columns={columns}
      setShowCreateStatusDialog={setShowCreateStatusDialog}
    >
      <BoardContent
        columns={columns}
        statuses={statuses}
        mappedQueries={mappedQueries}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showCompactCards={showCompactCards}
        setShowCompactCards={setShowCompactCards}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        handleDragEnd={handleDragEnd}
        draggingStartupId={draggingStartupId}
        handleAddStartup={handleAddStartup}
        createStartupMutation={createStartupMutation}
        handleCardClick={handleCardClick}
        handleDeleteStartup={handleDeleteStartup}
        setShowCreateStatusDialog={setShowCreateStatusDialog}
        setStatusToEdit={setStatusToEdit}
        handleColumnDragStart={handleColumnDragStart}
        handleColumnDragOver={handleColumnDragOver}
        handleColumnDrop={handleColumnDrop}
        handleCreateTask={handleCreateTask}
      />
      
      <BoardDialogs
        showCreateStatusDialog={showCreateStatusDialog}
        setShowCreateStatusDialog={setShowCreateStatusDialog}
        statusToEdit={statusToEdit}
        setStatusToEdit={setStatusToEdit}
        showCreateDialog={showCreateDialog}
        setShowCreateDialog={setShowCreateDialog}
        showEditDialog={showEditDialog}
        setShowEditDialog={setShowEditDialog}
        selectedStartup={selectedStartup}
        statuses={statuses}
        handleStatusCreated={handleStatusCreated}
        handleStatusUpdated={handleStatusUpdated}
        handleCreateStartup={handleCreateStartup}
        handleUpdateStartup={handleUpdateStartup}
        createStartupMutation={createStartupMutation}
        updateStartupMutation={updateStartupMutation}
      />
      
      <BoardDebugInfo
        showExtendedDebug={showExtendedDebug}
        setShowExtendedDebug={setShowExtendedDebug}
        loadingStartTime={loadingStartTime}
        statusesCount={statusesCount}
        columns={columns}
        mappedQueries={mappedQueries}
      />
    </BoardStateManager>
  );
};

export default BoardView;
