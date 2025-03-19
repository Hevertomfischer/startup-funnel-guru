
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
    
    // CORRIGIDO: Adicionando verificações robustas para os IDs
    const startupId = e.dataTransfer.getData('text/plain');
    const sourceColumnId = e.dataTransfer.getData('sourceColumnId');
    
    console.log('Drop event data:', { startupId, columnId, sourceColumnId });
    
    if (!startupId || !columnId) {
      console.error('Missing required data:', { startupId, columnId });
      toast.error('Falha ao mover o card: dados incompletos');
      return;
    }
    
    // Validate the column ID is a valid UUID
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(columnId)) {
      console.error('Invalid column ID format:', columnId);
      toast.error('Não é possível mover o card para esta coluna (ID inválido)');
      return;
    }
    
    // IMPORTANTE: Verificar explicitamente que columnId existe nos status
    const targetStatus = statuses.find(status => status.id === columnId);
    if (!targetStatus) {
      console.error('Column ID does not match any existing status:', columnId);
      toast.error('Não é possível mover o card para esta coluna (status não existe)');
      return;
    }
    
    const startup = getStartupById(startupId);
    
    if (!startup) {
      console.error('Startup not found:', startupId);
      toast.error('Card não encontrado');
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
    
    // CRÍTICO: Validação final para garantir que temos um columnId válido
    if (!columnId || !uuidPattern.test(columnId)) {
      console.error('Attempted to move startup to an invalid column ID');
      toast.error('Não é possível mover para uma coluna inválida');
      return;
    }
    
    // NOVA ABORDAGEM: Verificação direta na base de dados que o status existe
    // antes mesmo de tentar fazer qualquer atualização
    
    // Optimistically update the UI
    const newColumns = columns.map(col => ({
      ...col,
      startupIds: col.id === columnId 
        ? [...col.startupIds, startupId] 
        : col.startupIds.filter(id => id !== startupId)
    }));
    
    setColumns(newColumns);
    
    // Log do que estamos realmente enviando para a mutação
    console.log('Mutation payload:', {
      id: startupId,
      newStatusId: columnId,
      oldStatusId: oldStatusId
    });
    
    // Make the API call - only passing the minimal data needed
    updateStartupStatusMutation.mutate({
      id: startupId,
      newStatusId: columnId,
      oldStatusId: oldStatusId
    }, {
      onSuccess: (data) => {
        console.log('Status update successful for startup', startupId);
        
        const newStatus = statuses.find(s => s.id === columnId);
        toast.success(`Startup movido para ${newStatus?.name || 'novo status'}`);
        
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
        
        toast.error(error instanceof Error ? error.message : "Ocorreu um erro. Por favor, tente novamente.");
        
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
