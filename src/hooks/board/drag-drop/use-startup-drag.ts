
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
    
    // Log all data transfer items for debugging
    console.log('All dataTransfer items:', {
      'text/plain': e.dataTransfer.getData('text/plain'),
      'type': e.dataTransfer.getData('type'),
      'sourceColumnId': e.dataTransfer.getData('sourceColumnId')
    });
    
    // CRITICAL: Early validation checks - must have valid IDs
    const startupId = e.dataTransfer.getData('text/plain');
    const sourceColumnId = e.dataTransfer.getData('sourceColumnId');
    
    console.log('Drop event data:', { startupId, columnId, sourceColumnId });
    
    if (!startupId || !columnId) {
      console.error('Missing required data:', { startupId, columnId });
      toast.error('Falha ao mover o card: dados incompletos');
      return;
    }
    
    // CRITICAL: Both IDs must be valid UUIDs
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (!uuidPattern.test(startupId)) {
      console.error('Invalid startup ID format:', startupId);
      toast.error('ID da startup inválido');
      return;
    }
    
    if (!uuidPattern.test(columnId)) {
      console.error('Invalid column ID format:', columnId);
      toast.error('ID da coluna inválido');
      return;
    }
    
    // CRITICAL: The column ID must be for an existing status
    const targetStatus = statuses.find(status => status.id === columnId);
    if (!targetStatus) {
      console.error('Column ID does not match any existing status:', columnId);
      toast.error('Status não encontrado');
      return;
    }
    
    // The startup must exist
    const startup = getStartupById(startupId);
    if (!startup) {
      console.error('Startup not found:', startupId);
      toast.error('Startup não encontrada');
      return;
    }
    
    // CRITICAL: IDs should be sanitized before use
    const cleanStartupId = startupId.trim();
    const cleanColumnId = columnId.trim();
    let oldStatusId = undefined;
    
    // Try to get the current status ID from multiple sources:
    if (sourceColumnId && uuidPattern.test(sourceColumnId)) {
      oldStatusId = sourceColumnId.trim();
      console.log(`Using sourceColumnId from drag event: ${oldStatusId}`);
    }
    else if (startup.status_id && uuidPattern.test(startup.status_id)) {
      oldStatusId = startup.status_id.trim();
      console.log(`Using status_id from startup object: ${oldStatusId}`);
    } 
    else {
      const currentColumn = columns.find(col => col.startupIds.includes(startupId));
      if (currentColumn && uuidPattern.test(currentColumn.id)) {
        oldStatusId = currentColumn.id.trim();
        console.log(`Found startup in column: ${oldStatusId}`);
      }
    }
    
    // Check if nothing is actually changing
    if (oldStatusId === cleanColumnId) {
      console.log('Startup is already in this column, no update needed');
      return;
    }
    
    // CRITICAL DEBUG: Log the exact values that will be sent for the update
    console.log('CRITICAL DEBUG - Values that will be used for status update:');
    console.log('- Startup ID:', cleanStartupId);
    console.log('- New status ID:', cleanColumnId);
    console.log('- Old status ID:', oldStatusId);
    console.log('- Target status details:', targetStatus);
    
    // Ensure the new status ID is definitely valid
    if (!cleanColumnId || cleanColumnId === 'null' || cleanColumnId === 'undefined') {
      console.error('FATAL ERROR: New status ID is invalid:', cleanColumnId);
      toast.error('Erro interno: status inválido');
      return;
    }
    
    // Optimistically update the UI (more reliable than waiting for API)
    const newColumns = columns.map(col => ({
      ...col,
      startupIds: col.id === cleanColumnId 
        ? [...col.startupIds, cleanStartupId] 
        : col.startupIds.filter(id => id !== cleanStartupId)
    }));
    
    setColumns(newColumns);
    
    // Create a minimal, safe mutation payload object
    const mutationPayload = {
      id: cleanStartupId,
      newStatusId: cleanColumnId,
      oldStatusId: oldStatusId
    };
    
    // Final validation before sending
    if (!mutationPayload.newStatusId || !uuidPattern.test(mutationPayload.newStatusId)) {
      console.error('VALIDATION FAILED: newStatusId is invalid:', mutationPayload.newStatusId);
      toast.error('Status inválido');
      return;
    }
    
    console.log('Mutation payload:', mutationPayload);
    
    updateStartupStatusMutation.mutate(mutationPayload, {
      onSuccess: (data) => {
        console.log('Status update successful for startup', cleanStartupId);
        
        const newStatus = statuses.find(s => s.id === cleanColumnId);
        toast.success(`Startup movido para ${newStatus?.name || 'novo status'}`);
        
        if (data) {
          const startupForWorkflow: Startup = {
            id: startup.id,
            createdAt: startup.created_at || new Date().toISOString(),
            updatedAt: startup.updated_at || new Date().toISOString(),
            statusId: cleanColumnId,
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
        
        toast.error(error instanceof Error ? error.message : "Ocorreu um erro. Por favor, tente novamente.");
        
        // Revert the optimistic update on error
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
