
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import BoardHeader from '@/components/BoardHeader';
import BoardContainer from '@/components/board/BoardContainer';
import BoardDialogs from '@/components/board/BoardDialogs';
import { useBoardState } from '@/hooks/board/use-board-state';
import { useBoardSearch } from '@/hooks/board/use-board-search';

const BoardView = () => {
  // Component state
  const [showCompactCards, setShowCompactCards] = useState(false);
  
  // Use the board search hook to get search functionality
  const { searchTerm, setSearchTerm, handleSearch } = useBoardSearch();
  
  // Use the board state hook to get all the data and handlers
  const boardState = useBoardState();
  
  const {
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
  
  // Function to open the add startup dialog with the first status
  const openAddStartupDialog = () => {
    if (statuses && statuses.length > 0) {
      console.log("Opening add startup dialog with status:", statuses[0]);
      handleAddStartup(statuses[0].id);
    } else {
      console.log("No statuses available to add startup");
    }
  };
  
  if (isLoadingStatuses) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading board...</span>
      </div>
    );
  }
  
  if (isErrorStatuses) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">Failed to load board</h2>
          <p className="text-muted-foreground mt-2">Please try again later</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        <BoardHeader 
          showCompactCards={showCompactCards}
          setShowCompactCards={setShowCompactCards}
          addNewStartup={openAddStartupDialog}
          searchTerm={searchTerm}
          onSearchChange={(e) => handleSearch(e.target.value)}
        />
        
        {columns.length === 0 ? (
          <div className="flex-1 flex items-center justify-center flex-col gap-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-4 w-48" />
            </div>
            <button 
              onClick={() => setShowCreateStatusDialog(true)}
              className="text-primary hover:underline"
            >
              Add your first column
            </button>
          </div>
        ) : (
          <BoardContainer
            columns={columns}
            statuses={statuses}
            columnQueries={mappedQueries}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            draggingStartupId={draggingStartupId}
            onAddStartup={handleAddStartup}
            isPendingAdd={createStartupMutation.isPending}
            pendingAddStatusId={createStartupMutation.isPending ? createStartupMutation.variables?.status_id : null}
            onCardClick={handleCardClick}
            onDeleteStartup={handleDeleteStartup}
            showCompactCards={showCompactCards}
            addNewColumn={() => setShowCreateStatusDialog(true)}
            onEditColumn={setStatusToEdit}
            onColumnDragStart={handleColumnDragStart}
            onColumnDragOver={handleColumnDragOver}
            onColumnDrop={handleColumnDrop}
            onCreateTask={handleCreateTask}
            searchTerm={searchTerm}
          />
        )}
      </div>
      
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
