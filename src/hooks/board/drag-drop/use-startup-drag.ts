
import { useState } from 'react';
import { toast } from 'sonner';
import { useUpdateStartupStatusMutation } from '../../queries/startups';
import { useWorkflowRules } from '../../workflow';
import { UseBoardDragDropParams, StartupDragState } from './types';
import { Startup } from '@/types';

export function useStartupDrag({
  columns,
  setColumns,
  statuses,
  getStartupById
}: UseBoardDragDropParams): StartupDragState {
  const [draggingStartupId, setDraggingStartupId] = useState<string | null>(null);
  const { processStartup } = useWorkflowRules();
  
  const updateStartupStatusMutation = useUpdateStartupStatusMutation();
  
  const handleDragStart = (e: React.DragEvent, startupId: string) => {
    e.dataTransfer.setData('text/plain', startupId);
    e.dataTransfer.setData('type', 'startup');
    setDraggingStartupId(startupId);
    
    // Store source column for tracking
    const sourceColumn = columns.find(col => col.startupIds.includes(startupId));
    if (sourceColumn) {
      e.dataTransfer.setData('sourceColumnId', sourceColumn.id);
      console.log(`Dragging startup ${startupId} from column ${sourceColumn.id}`);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    
    const type = e.dataTransfer.getData('type');
    if (type !== 'startup') return;
    
    const startupId = e.dataTransfer.getData('text/plain');
    const sourceColumnId = e.dataTransfer.getData('sourceColumnId');
    
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
    
    // Determine the current status ID of the startup
    let oldStatusId;
    
    // First try to use sourceColumnId from drag event (most reliable)
    if (sourceColumnId && uuidPattern.test(sourceColumnId)) {
      oldStatusId = sourceColumnId;
      console.log(`Using sourceColumnId from drag event: ${oldStatusId}`);
    }
    // Then try to get status_id directly from the startup object
    else if (startup.status_id && uuidPattern.test(startup.status_id)) {
      oldStatusId = startup.status_id;
      console.log(`Using status_id from startup object: ${oldStatusId}`);
    } 
    // If not available or invalid, try to find which column contains this startup
    else {
      const currentColumn = columns.find(col => col.startupIds.includes(startupId));
      if (currentColumn && uuidPattern.test(currentColumn.id)) {
        oldStatusId = currentColumn.id;
        console.log(`Found startup in column: ${oldStatusId}`);
      } else {
        console.warn('Could not determine current status of startup:', startupId);
        // We'll still try to update with just the new status
      }
    }
    
    if (oldStatusId === columnId) {
      console.log('Startup is already in this column, no update needed');
      return;
    }
    
    console.log('Moving startup', startupId, 'from status', oldStatusId, 'to status', columnId);
    
    // CRITICAL: Final validation to ensure we have a valid new column ID
    if (!columnId || !uuidPattern.test(columnId)) {
      console.error('Attempted to move startup to an invalid column ID');
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

  return {
    draggingStartupId,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  };
}
