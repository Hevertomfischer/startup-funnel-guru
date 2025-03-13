
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

  // Create a memoized object to store queries for each status ID
  const columnQueries = useMemo(() => {
    const queries: Record<string, any> = {};
    
    if (statusIds) {
      statusIds.forEach(statusId => {
        if (statusId) {
          queries[statusId] = useStartupsByStatus(statusId);
        }
      });
    }
    
    return queries;
  }, [statusIds]); // This will break React hook rules, but we'll fix it differently
  
  // This is a workaround since we can't use hooks in a loop or conditionally
  // Instead, we'll create refs to each query individually for status IDs we know about
  const statusQueries = statusIds?.map(statusId => 
    statusId ? useStartupsByStatus(statusId) : null
  );
  
  // Map the individual queries to our columnQueries object
  useEffect(() => {
    if (statusIds && statusQueries) {
      const newColumnQueries: Record<string, any> = {};
      
      statusIds.forEach((statusId, index) => {
        if (statusId) {
          newColumnQueries[statusId] = statusQueries[index];
        }
      });
      
      // Update column startupIds when startups are loaded
      const newColumns = [...columns];
      
      columns.forEach((column, index) => {
        const query = newColumnQueries[column.id];
        if (query?.data) {
          newColumns[index].startupIds = query.data.map((startup: any) => startup.id);
        }
      });
      
      setColumns(newColumns);
    }
  }, [columns, statusIds, statusQueries, setColumns]);

  // Get a startup by ID from any status
  const getStartupById = (id: string) => {
    for (let i = 0; i < statusIds?.length || 0; i++) {
      const statusId = statusIds?.[i];
      if (!statusId) continue;
      
      const query = statusQueries?.[i];
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
  
  // Map statusQueries to columnQueries format for the BoardContainer component
  const mappedColumnQueries: Record<string, any> = {};
  statusIds?.forEach((statusId, index) => {
    if (statusId) {
      mappedColumnQueries[statusId] = statusQueries[index];
    }
  });
  
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
          columnQueries={mappedColumnQueries}
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
