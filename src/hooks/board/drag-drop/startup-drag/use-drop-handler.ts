
import { useState } from 'react';
import { toast } from 'sonner';
import { useUpdateStartupStatusMutation } from '../../../queries/startups';
import { useWorkflowRules } from '../../../workflow';
import { Startup } from '@/types';
import { validateDragDropParams, isValidUUID } from './validation';
import { getSourceColumnId, validateTargetColumn, prepareMutationPayload } from './data-extraction';
import { updateColumnsOptimistically } from './ui-update';
import { StartupDragHandlerParams } from './types';

/**
 * Hook that handles the drop logic for startups
 */
export const useDropHandler = ({
  columns,
  setColumns,
  statuses,
  getStartupById,
  queryClient
}: StartupDragHandlerParams) => {
  const updateStartupStatusMutation = useUpdateStartupStatusMutation();
  const { processStartup } = useWorkflowRules();
  
  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    
    console.log('Drop event triggered in column:', columnId);
    const type = e.dataTransfer.getData('type');
    
    if (type !== 'startup') {
      console.log('Not a startup drop event, type:', type);
      return;
    }
    
    // Log all data transfer items for debugging
    console.log('All dataTransfer items:', {
      'text/plain': e.dataTransfer.getData('text/plain'),
      'type': e.dataTransfer.getData('type'),
      'sourceColumnId': e.dataTransfer.getData('sourceColumnId')
    });
    
    // Extract data from drag event
    const startupId = e.dataTransfer.getData('text/plain');
    const sourceColumnId = e.dataTransfer.getData('sourceColumnId');
    
    console.log('Drop event data:', { startupId, columnId, sourceColumnId });
    
    // CRITICAL: Ensure columnId is a valid UUID
    if (!isValidUUID(columnId)) {
      console.error('Received invalid column ID format:', columnId);
      toast.error(`Formato de ID da coluna inválido: ${columnId}`);
      return;
    }
    
    // Validate parameters
    const validationError = validateDragDropParams(startupId, columnId, sourceColumnId);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    
    // Validate target column
    const targetStatus = validateTargetColumn(columnId, statuses);
    if (!targetStatus) {
      toast.error('Status não encontrado');
      return;
    }
    
    // Check if this is a move to "Investida" status
    const isInvestedStatus = targetStatus.name.toLowerCase().includes('investida');
    console.log('Moving to invested status:', isInvestedStatus);
    
    // Get startup data
    const startup = getStartupById(startupId);
    if (!startup) {
      console.error('Startup not found:', startupId);
      toast.error('Startup não encontrada');
      return;
    }
    
    // Get source column ID from various places
    const oldStatusId = getSourceColumnId(sourceColumnId, startup, columns);
    
    // Check if nothing is actually changing
    if (oldStatusId === columnId) {
      console.log('Startup is already in this column, no update needed');
      return;
    }
    
    // Additional validation for new status ID
    if (!columnId || columnId === 'null' || columnId === 'undefined') {
      console.error('FATAL ERROR: New status ID is invalid:', columnId);
      toast.error('Erro interno: status inválido');
      return;
    }
    
    // Optimistically update the UI
    const newColumns = updateColumnsOptimistically(columns, startupId, columnId);
    setColumns(newColumns);
    
    // Create mutation payload
    const mutationPayload = prepareMutationPayload(startupId, columnId, oldStatusId);
    
    console.log('Mutation payload:', mutationPayload);
    
    // Execute the mutation
    updateStartupStatusMutation.mutate(mutationPayload, {
      onSuccess: (data) => {
        console.log('Status update successful for startup', startupId);
        
        const newStatus = statuses.find(s => s.id === columnId);
        toast.success(`Startup movido para ${newStatus?.name || 'novo status'}`);
        
        // If this is a move to "Investida", invalidate portfolio queries
        if (isInvestedStatus) {
          console.log('Invalidating portfolio queries after moving to Investida status');
          queryClient?.invalidateQueries({ queryKey: ['startups', 'portfolio'] });
        }
        
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
        
        // More detailed error message for debugging
        if (error instanceof Error) {
          console.error('Error details:', {
            message: error.message,
            name: error.name,
            stack: error.stack
          });
        }
        
        const errorMessage = error instanceof Error 
          ? `Erro ao atualizar status: ${error.message}` 
          : "Ocorreu um erro ao mover o card. Por favor, tente novamente.";
        
        toast.error(errorMessage);
        
        // Revert the optimistic update on error
        setColumns(columns);
      }
    });
  };

  return { handleDrop };
};
