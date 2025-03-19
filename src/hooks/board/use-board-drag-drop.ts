import { useState } from 'react';
import { useUpdateStartupStatusMutation } from '../queries/startups';
import { Column, Startup } from '@/types';
import { useWorkflowRules } from '../workflow';
import { toast } from 'sonner';

type UseBoardDragDropParams = {
  columns: Column[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  queryClient: any;
  statuses: any[];
  getStartupById: (id: string) => any | undefined;
};

export function useBoardDragDrop({
  columns,
  setColumns,
  queryClient,
  statuses,
  getStartupById
}: UseBoardDragDropParams) {
  const [draggingStartupId, setDraggingStartupId] = useState<string | null>(null);
  const [draggingColumnId, setDraggingColumnId] = useState<string | null>(null);
  const { processStartup } = useWorkflowRules();
  
  const updateStartupStatusMutation = useUpdateStartupStatusMutation();
  
  const handleDragStart = (e: React.DragEvent, startupId: string) => {
    e.dataTransfer.setData('text/plain', startupId);
    e.dataTransfer.setData('type', 'startup');
    setDraggingStartupId(startupId);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    
    const type = e.dataTransfer.getData('type');
    if (type !== 'startup') return;
    
    const startupId = e.dataTransfer.getData('text/plain');
    if (!startupId || !columnId) {
      console.error('Missing required data:', { startupId, columnId });
      return;
    }
    
    // Validate the column ID is a valid UUID
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(columnId)) {
      console.error('Invalid column ID format:', columnId);
      toast.error('Cannot move card to this column (invalid column)');
      return;
    }
    
    // Validate that this columnId exists in the status list
    const statusExists = statuses.some(status => status.id === columnId);
    if (!statusExists) {
      console.error('Column ID does not match any existing status:', columnId);
      toast.error('Cannot move card to this column (status does not exist)');
      return;
    }
    
    const startup = getStartupById(startupId);
    
    if (!startup) {
      console.error('Startup not found:', startupId);
      return;
    }
    
    // Make sure the startup has a valid status_id (even if it's different from columnId)
    const oldStatusId = startup.status_id || columns.find(col => col.startupIds.includes(startupId))?.id;
    
    if (oldStatusId === columnId) {
      console.log('Startup is already in this column, no update needed');
      return;
    }
    
    console.log('Moving startup', startupId, 'from status', oldStatusId, 'to status', columnId);
    
    // CRITICAL: Ensure we're not passing null values to the mutation
    if (!columnId) {
      console.error('Attempted to move startup to a null column ID');
      toast.error('Cannot move to an invalid column');
      return;
    }
    
    // Optimistically update the UI
    const newColumns = columns.map(col => ({
      ...col,
      startupIds: col.id === columnId 
        ? [...col.startupIds, startupId] 
        : col.startupIds.filter(id => id !== startupId)
    }));
    
    setColumns(newColumns);
    
    // Make the API call - only passing the minimal data needed
    updateStartupStatusMutation.mutate({
      id: startupId,
      newStatusId: columnId,
      oldStatusId: oldStatusId
    }, {
      onSuccess: (data) => {
        console.log('Status update successful for startup', startupId);
        
        const newStatus = statuses.find(s => s.id === columnId);
        toast.success(`Startup moved to ${newStatus?.name || 'new status'}`);
        
        if (data) {
          const startupForWorkflow: Startup = {
            id: startup.id,
            createdAt: startup.created_at || new Date().toISOString(),
            updatedAt: startup.updated_at || new Date().toISOString(),
            statusId: columnId,
            values: { ...startup },
            labels: [],
            priority: startup.priority || 'medium',
            attachments: []
          };
          
          // Run any workflow rules that might apply to this status change
          processStartup(startupForWorkflow, { statusId: oldStatusId }, statuses);
        }
      },
      onError: (error) => {
        console.error('Error updating startup status:', error);
        
        toast.error(error instanceof Error ? error.message : "An error occurred. Please try again.");
        
        // Revert the optimistic update
        setColumns(columns);
      }
    });
    
    setDraggingStartupId(null);
  };
  
  const handleDragEnd = () => {
    setDraggingStartupId(null);
  };

  const handleColumnDragStart = (e: React.DragEvent, columnId: string) => {
    e.dataTransfer.setData('text/plain', columnId);
    e.dataTransfer.setData('type', 'column');
    setDraggingColumnId(columnId);
  };
  
  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleColumnDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    
    const type = e.dataTransfer.getData('type');
    if (type !== 'column') return;
    
    const sourceColumnId = e.dataTransfer.getData('text/plain');
    
    if (sourceColumnId !== targetColumnId) {
      const sourceIndex = columns.findIndex(col => col.id === sourceColumnId);
      const targetIndex = columns.findIndex(col => col.id === targetColumnId);
      
      if (sourceIndex !== -1 && targetIndex !== -1) {
        const newColumns = [...columns];
        const [movedColumn] = newColumns.splice(sourceIndex, 1);
        newColumns.splice(targetIndex, 0, movedColumn);
        
        const columnsWithNewPositions = newColumns.map((col, index) => ({
          ...col,
          position: index
        }));
        
        setColumns(columnsWithNewPositions);
      }
    }
    
    setDraggingColumnId(null);
  };

  return {
    draggingStartupId,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDrop
  };
}
