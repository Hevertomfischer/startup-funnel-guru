
import React, { useState } from 'react';
import { useBoardState } from '@/hooks/board/use-board-state';
import { useConnectionCheck } from '@/hooks/board/use-connection-check';
import BoardContent from '@/components/board/BoardContent';
import BoardDialogs from '@/components/board/BoardDialogs';
import BoardLoadingState from '@/components/board/states/BoardLoadingState';
import BoardErrorState from '@/components/board/states/BoardErrorState';
import ConnectionErrorState from '@/components/board/states/ConnectionErrorState';

const BoardView = () => {
  // Component state
  const [showCompactCards, setShowCompactCards] = useState(false);
  
  // Check connection to Supabase
  const { connectionError, isRetrying, handleRetryConnection } = useConnectionCheck();
  
  // Use the board state hook to get all the data and handlers
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
  
  console.log("BoardView rendering", { 
    columnsCount: columns?.length || 0,
    statusesCount: statuses?.length || 0,
    isLoadingStatuses,
    isErrorStatuses,
    hasQueries: Object.keys(mappedQueries || {}).length,
    connectionError
  });
  
  if (connectionError) {
    return (
      <ConnectionErrorState
        isRetrying={isRetrying}
        onRetry={handleRetryConnection}
      />
    );
  }
  
  if (isLoadingStatuses) {
    return <BoardLoadingState />;
  }
  
  if (isErrorStatuses) {
    return (
      <BoardErrorState
        isRetrying={isRetrying}
        onRetry={handleRetryConnection}
      />
    );
  }
  
  return (
    <>
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
    </>
  );
};

export default BoardView;
