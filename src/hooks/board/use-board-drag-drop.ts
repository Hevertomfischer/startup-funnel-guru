
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUpdateStartupMutation } from '../queries/use-startup-queries';
import { Column, Startup } from '@/types';
import { useWorkflowRules } from '../use-workflow-rules';

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
  const { toast } = useToast();
  const [draggingStartupId, setDraggingStartupId] = useState<string | null>(null);
  const [draggingColumnId, setDraggingColumnId] = useState<string | null>(null);
  const { processStartup } = useWorkflowRules();
  
  // Mutations for updating startups
  const updateStartupMutation = useUpdateStartupMutation();
  
  // Drag and drop handlers for startups
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
    
    // Check if this is a startup being dragged
    const type = e.dataTransfer.getData('type');
    if (type !== 'startup') return;
    
    const startupId = e.dataTransfer.getData('text/plain');
    const startup = getStartupById(startupId);
    
    if (startup && startup.status_id !== columnId) {
      // Save the previous status for workflow rules and history tracking
      const oldStatusId = startup.status_id;
      
      console.log('Moving startup', startupId, 'from status', oldStatusId, 'to status', columnId);
      
      // Update the columns state immediately for better UX
      const newColumns = columns.map(col => ({
        ...col,
        startupIds: col.id === columnId 
          ? [...col.startupIds, startupId] 
          : col.startupIds.filter(id => id !== startupId)
      }));
      
      // Update the columns state
      setColumns(newColumns);
      
      // CRITICAL FIX: Send only the absolute minimal required data
      // This reduces the chance of type mismatches and other issues
      updateStartupMutation.mutate({
        id: startupId,
        startup: { 
          status_id: columnId,
          old_status_id: oldStatusId
        }
      }, {
        onSuccess: () => {
          console.log('Mutation successful for startup', startupId);
          
          const newStatus = statuses.find(s => s.id === columnId);
          toast({
            title: "Startup moved",
            description: `Startup moved to ${newStatus?.name || 'new status'}`,
          });
        },
        onError: (error) => {
          console.error('Error updating startup status:', error);
          
          // Revert the UI change in case of error
          setColumns(columns);
          
          toast({
            title: "Failed to move startup",
            description: "An error occurred. Please try again.",
            variant: "destructive"
          });
        }
      });
      
      // Trigger workflow rules after startup status change
      // Convert startup to the format expected by workflow rules
      const startupForWorkflow: Startup = {
        id: startup.id,
        createdAt: startup.created_at || new Date().toISOString(),
        updatedAt: startup.updated_at || new Date().toISOString(),
        statusId: columnId, // Use the new status id
        values: { ...startup }, // Include all fields
        labels: [], // Would be populated in production
        priority: startup.priority || 'medium',
        attachments: []
      };
      
      // Process the startup through workflow rules
      processStartup(startupForWorkflow, { statusId: oldStatusId }, statuses);
    }
    
    setDraggingStartupId(null);
  };
  
  const handleDragEnd = () => {
    setDraggingStartupId(null);
  };

  // Column drag and drop handlers
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
    
    // Check if this is a column being dragged
    const type = e.dataTransfer.getData('type');
    if (type !== 'column') return;
    
    const sourceColumnId = e.dataTransfer.getData('text/plain');
    
    if (sourceColumnId !== targetColumnId) {
      // Find the indices of the source and target columns
      const sourceIndex = columns.findIndex(col => col.id === sourceColumnId);
      const targetIndex = columns.findIndex(col => col.id === targetColumnId);
      
      if (sourceIndex !== -1 && targetIndex !== -1) {
        // Create a new array and move the column
        const newColumns = [...columns];
        const [movedColumn] = newColumns.splice(sourceIndex, 1);
        newColumns.splice(targetIndex, 0, movedColumn);
        
        // Update the positions of all columns
        const columnsWithNewPositions = newColumns.map((col, index) => ({
          ...col,
          position: index
        }));
        
        // Update the state with the new columns array
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
