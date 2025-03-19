
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStartupStatus } from '@/services';
import { toast } from 'sonner';

/**
 * Specialized mutation hook for updating startup status
 * This is used for drag & drop operations
 */
export const useUpdateStartupStatusMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      id, 
      newStatusId, 
      oldStatusId 
    }: { 
      id: string; 
      newStatusId: string; 
      oldStatusId?: string 
    }) => {
      console.log(`Mutation starting: Update startup ${id} from ${oldStatusId || 'unknown'} to ${newStatusId}`);
      
      // MELHORADO: Validação UUID mais completa
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      // CRÍTICO: Verificar explicitamente se os valores não são null/undefined antes de validar
      if (!id) {
        console.error(`Invalid startup ID: ${id} (null or undefined)`);
        throw new Error(`ID da startup inválido`);
      }
      
      if (!newStatusId) {
        console.error(`Invalid status ID: ${newStatusId} (null or undefined)`);
        throw new Error(`ID do status inválido`);
      }
      
      // CRÍTICO: Verificar explicitamente se newStatusId é uma string vazia após trim
      if (typeof newStatusId === 'string') {
        newStatusId = newStatusId.trim();
        if (newStatusId === '') {
          console.error('Status ID is empty after trimming');
          throw new Error('ID do status não pode estar vazio');
        }
      } else {
        console.error(`Status ID is not a string: ${typeof newStatusId}`);
        throw new Error('ID do status deve ser uma string');
      }
      
      // Verificar se os valores são UUIDs válidos
      if (!uuidPattern.test(id)) {
        console.error(`Invalid startup ID format: ${id}`);
        throw new Error(`Formato do ID da startup inválido: ${id}`);
      }
      
      if (!uuidPattern.test(newStatusId)) {
        console.error(`Invalid status ID format: ${newStatusId}`);
        throw new Error(`Formato do ID do status inválido: ${newStatusId}`);
      }
      
      // CRÍTICO: Verificar novamente se newStatusId não é null ou vazio
      if (!newStatusId) {
        console.error('Status ID cannot be null or empty or whitespace');
        throw new Error('ID do status não pode estar vazio');
      }
      
      // Garantir que oldStatusId é um UUID válido ou undefined, nunca null
      if (oldStatusId) {
        oldStatusId = oldStatusId.trim();
        if (!uuidPattern.test(oldStatusId)) {
          console.warn(`Invalid old status ID format: ${oldStatusId}. Setting to undefined.`);
          oldStatusId = undefined;
        }
      }
      
      // NOVA ABORDAGEM: Criar um objeto limpo e seguro para a chamada da API
      const safeParams = {
        id: id.trim(),
        newStatusId: newStatusId.trim(),
        oldStatusId: oldStatusId && uuidPattern.test(oldStatusId) ? oldStatusId.trim() : undefined
      };
      
      // CRÍTICO: Verificação final explícita
      if (!safeParams.newStatusId) {
        console.error('Final check - newStatusId is empty after formatting');
        throw new Error('Status inválido após formatação');
      }
      
      console.log(`Calling updateStartupStatus with:`, safeParams);
      
      // NOVA ABORDAGEM: Usar try-catch para garantir que qualquer erro é capturado
      try {
        return updateStartupStatus(safeParams.id, safeParams.newStatusId, safeParams.oldStatusId);
      } catch (error) {
        console.error('Error in updateStartupStatus:', error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      console.log("Status update succeeded:", data);
      
      // Invalidate generic startups query
      queryClient.invalidateQueries({ queryKey: ['startups'] });
      
      // Invalidate specific startup query
      queryClient.invalidateQueries({ queryKey: ['startup', variables.id] });
      
      // Invalidate new status query
      queryClient.invalidateQueries({ 
        queryKey: ['startups', 'status', variables.newStatusId]
      });
      
      // If we know the old status, invalidate that query too
      if (variables.oldStatusId) {
        queryClient.invalidateQueries({ 
          queryKey: ['startups', 'status', variables.oldStatusId]
        });
      }
      
      toast.success('Card movido com sucesso');
    },
    onError: (error, variables) => {
      console.error("Status update failed:", error);
      console.error("Failed variables:", variables);
      
      toast.error(error instanceof Error ? error.message : 'Falha ao atualizar o status da startup');
      
      // Invalidate queries to ensure UI is up-to-date
      queryClient.invalidateQueries({ queryKey: ['startups'] });
      queryClient.invalidateQueries({ queryKey: ['startup', variables.id] });
      
      if (variables.newStatusId) {
        queryClient.invalidateQueries({ 
          queryKey: ['startups', 'status', variables.newStatusId]
        });
      }
      
      if (variables.oldStatusId) {
        queryClient.invalidateQueries({ 
          queryKey: ['startups', 'status', variables.oldStatusId]
        });
      }
    }
  });
};
