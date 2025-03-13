
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { CreateStatusDialog } from '@/components/CreateStatusDialog';
import { useBoardColumns } from '@/hooks/use-board-columns';
import { useBoardDragDrop } from '@/hooks/use-board-drag-drop';
import { useStartupActions } from '@/hooks/use-startup-actions';
import { useStartupsByStatus } from '@/hooks/use-startups-by-status';
import BoardHeader from '@/components/BoardHeader';
import BoardContainer from '@/components/BoardContainer';

const Board = () => {
  const queryClient = useQueryClient();
  const [showCompactCards, setShowCompactCards] = useState(false);
  const [showCreateStatusDialog, setShowCreateStatusDialog] = useState(false);
  
  // Get board columns and statuses
  const {
    columns,
    setColumns,
    statusIds,
    statuses,
    isLoadingStatuses,
    isErrorStatuses,
  } = useBoardColumns();

  // Explicitly fetch startup data for each column to avoid hooks rule violations
  const columnQueries: Record<string, any> = {};
  
  // We need to get query results outside of a reducer function to avoid hooks rule violations
  statusIds?.forEach(statusId => {
    if (statusId) {
      const queryResult = useStartupsByStatus(statusId);
      if (statusId) {
        columnQueries[statusId] = queryResult;
      }
    }
  });
  
  // Update column startupIds when startups are loaded
  useEffect(() => {
    if (columns.length > 0 && Object.keys(columnQueries).length > 0) {
      const newColumns = [...columns];
      
      columns.forEach((column, index) => {
        const query = columnQueries[column.id];
        if (query?.data) {
          newColumns[index].startupIds = query.data.map((startup: any) => startup.id);
        }
      });
      
      setColumns(newColumns);
    }
  }, [columns, columnQueries, setColumns]);

  // Get a startup by ID from any status
  const getStartupById = (id: string): any | undefined => {
    for (const columnId in columnQueries) {
      const query = columnQueries[columnId];
      const startup = query?.data?.find((s: any) => s.id === id);
      if (startup) return startup;
    }
    return undefined;
  };
  
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
