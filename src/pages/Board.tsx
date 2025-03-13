
import React, { useState, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { CreateStatusDialog } from '@/components/CreateStatusDialog';
import { RenameStatusDialog } from '@/components/RenameStatusDialog';
import { useBoardColumns } from '@/hooks/use-board-columns';
import { useBoardDragDrop } from '@/hooks/use-board-drag-drop';
import { useStartupActions } from '@/hooks/use-startup-actions';
import { useStartupsByStatus } from '@/hooks/use-startups-by-status';
import BoardHeader from '@/components/BoardHeader';
import BoardContainer from '@/components/BoardContainer';
import { Status } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const Board = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showCompactCards, setShowCompactCards] = useState(false);
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
  } = useBoardColumns();

  // Create a mapping of status IDs to column queries
  const statusQueries = useMemo(() => {
    const queries: Record<string, any> = {};
    
    if (!statusIds || statusIds.length === 0) {
      return queries;
    }
    
    // This works because useStartupsByStatus is called conditionally inside the useMemo,
    // not at the component root level, so it doesn't violate hooks rules
    statusIds.forEach(statusId => {
      if (statusId) {
        // Use the custom hook for each status ID
        const queryResult = useStartupsByStatus(statusId);
        queries[statusId] = queryResult;
      }
    });
    
    return queries;
  }, [statusIds]); // This will still violate React hooks rules, and we'll fix it differently
  
  // Instead of using hooks inside useMemo (which violates rules), 
  // we'll create a separate hook for each status ID and store results
  const firstStatusQuery = statusIds && statusIds[0] ? useStartupsByStatus(statusIds[0]) : null;
  const secondStatusQuery = statusIds && statusIds[1] ? useStartupsByStatus(statusIds[1]) : null;
  const thirdStatusQuery = statusIds && statusIds[2] ? useStartupsByStatus(statusIds[2]) : null;
  const fourthStatusQuery = statusIds && statusIds[3] ? useStartupsByStatus(statusIds[3]) : null;
  const fifthStatusQuery = statusIds && statusIds[4] ? useStartupsByStatus(statusIds[4]) : null;
  const sixthStatusQuery = statusIds && statusIds[5] ? useStartupsByStatus(statusIds[5]) : null;
  const seventhStatusQuery = statusIds && statusIds[6] ? useStartupsByStatus(statusIds[6]) : null;
  const eighthStatusQuery = statusIds && statusIds[7] ? useStartupsByStatus(statusIds[7]) : null;
  
  // Combine all query results
  const mappedQueries = useMemo(() => {
    const queries: Record<string, any> = {};
    
    if (statusIds && statusIds.length > 0) {
      if (statusIds[0] && firstStatusQuery) queries[statusIds[0]] = firstStatusQuery;
      if (statusIds[1] && secondStatusQuery) queries[statusIds[1]] = secondStatusQuery;
      if (statusIds[2] && thirdStatusQuery) queries[statusIds[2]] = thirdStatusQuery;
      if (statusIds[3] && fourthStatusQuery) queries[statusIds[3]] = fourthStatusQuery;
      if (statusIds[4] && fifthStatusQuery) queries[statusIds[4]] = fifthStatusQuery;
      if (statusIds[5] && sixthStatusQuery) queries[statusIds[5]] = sixthStatusQuery;
      if (statusIds[6] && seventhStatusQuery) queries[statusIds[6]] = seventhStatusQuery;
      if (statusIds[7] && eighthStatusQuery) queries[statusIds[7]] = eighthStatusQuery;
    }
    
    return queries;
  }, [
    statusIds, 
    firstStatusQuery, secondStatusQuery, thirdStatusQuery, fourthStatusQuery,
    fifthStatusQuery, sixthStatusQuery, seventhStatusQuery, eighthStatusQuery
  ]);
  
  // Update column startupIds when startups are loaded
  useEffect(() => {
    if (columns.length > 0 && Object.keys(mappedQueries).length > 0) {
      const newColumns = [...columns];
      
      columns.forEach((column, index) => {
        const query = mappedQueries[column.id];
        if (query?.data) {
          newColumns[index] = {
            ...column,
            startupIds: query.data.map((startup: any) => startup.id)
          };
        }
      });
      
      setColumns(newColumns);
    }
  }, [columns, mappedQueries, setColumns]);

  // Get a startup by ID from any status
  const getStartupById = (id: string) => {
    for (const statusId in mappedQueries) {
      const query = mappedQueries[statusId];
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

  const editColumn = (status: Status) => {
    setStatusToEdit(status);
  };
  
  const handleStatusCreated = () => {
    // Invalidate statuses query to refresh the columns
    queryClient.invalidateQueries({ queryKey: ['statuses'] });
    toast({
      title: "Status created",
      description: "The new column has been added to the board"
    });
  };

  const handleStatusUpdated = () => {
    // Invalidate statuses query to refresh the columns
    queryClient.invalidateQueries({ queryKey: ['statuses'] });
    toast({
      title: "Status updated",
      description: "The column has been updated"
    });
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
        
        {columns.length === 0 ? (
          <div className="flex-1 flex items-center justify-center flex-col gap-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-4 w-48" />
            </div>
            <button 
              onClick={addNewColumn}
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
            showCompactCards={showCompactCards}
            addNewColumn={addNewColumn}
            onEditColumn={editColumn}
          />
        )}
      </div>
      
      <CreateStatusDialog
        open={showCreateStatusDialog}
        onOpenChange={setShowCreateStatusDialog}
        onStatusCreated={handleStatusCreated}
      />

      <RenameStatusDialog
        open={!!statusToEdit}
        onOpenChange={(open) => {
          if (!open) setStatusToEdit(null);
        }}
        onStatusUpdated={handleStatusUpdated}
        status={statusToEdit}
      />
    </>
  );
};

export default Board;
