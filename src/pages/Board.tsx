
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { CreateStatusDialog } from '@/components/CreateStatusDialog';
import { useBoardColumns } from '@/hooks/use-board-columns';
import { useBoardDragDrop } from '@/hooks/use-board-drag-drop';
import { useStartupActions } from '@/hooks/use-startup-actions';
import BoardHeader from '@/components/BoardHeader';
import BoardContainer from '@/components/BoardContainer';

const Board = () => {
  const queryClient = useQueryClient();
  const [showCompactCards, setShowCompactCards] = useState(false);
  const [showCreateStatusDialog, setShowCreateStatusDialog] = useState(false);
  
  // Custom hooks
  const {
    columns,
    setColumns,
    columnQueries,
    statuses,
    isLoadingStatuses,
    isErrorStatuses,
    getStartupById
  } = useBoardColumns();
  
  const {
    draggingStartupId,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  } = useBoardDragDrop(columns, setColumns, statuses, getStartupById);
  
  const {
    createStartupMutation,
    handleAddStartup,
    handleCardClick
  } = useStartupActions();
  
  // UI helpers
  const addNewColumn = () => {
    setShowCreateStatusDialog(true);
  };
  
  const handleStatusCreated = () => {
    // Invalidate statuses query to refresh the columns
    queryClient.invalidateQueries({ queryKey: ['statuses'] });
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
        />
        
        <BoardContainer
          columns={columns}
          statuses={statuses}
          columnQueries={columnQueries}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          draggingStartupId={draggingStartupId}
          onAddStartup={handleAddStartup}
          isPendingAdd={createStartupMutation.isPending}
          pendingAddStatusId={createStartupMutation.isPending ? createStartupMutation.variables?.status_id : null}
          onCardClick={handleCardClick}
          showCompactCards={showCompactCards}
          addNewColumn={addNewColumn}
        />
      </div>
      
      <CreateStatusDialog
        open={showCreateStatusDialog}
        onOpenChange={setShowCreateStatusDialog}
        onStatusCreated={handleStatusCreated}
      />
    </>
  );
};

export default Board;
