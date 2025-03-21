
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
      
      // CRITICAL: Validação de entrada extremamente rigorosa
      if (!id) {
        console.error(`Invalid startup ID: null or undefined`);
        throw new Error(`ID da startup é obrigatório`);
      }
      
      if (!newStatusId) {
        console.error(`Invalid status ID: null or undefined`);
        throw new Error(`ID do status é obrigatório`);
      }
      
      // Sanitize inputs by trimming
      const cleanId = typeof id === 'string' ? id.trim() : String(id).trim();
      const cleanNewStatusId = typeof newStatusId === 'string' ? newStatusId.trim() : String(newStatusId).trim();
      const cleanOldStatusId = oldStatusId && typeof oldStatusId === 'string' ? oldStatusId.trim() : undefined;
      
      // Validate all inputs after sanitization
      if (cleanId === '') {
        console.error(`Empty startup ID after trimming`);
        throw new Error(`ID da startup não pode estar vazio`);
      }
      
      if (cleanNewStatusId === '') {
        console.error(`Empty status ID after trimming`);
        throw new Error(`ID do status não pode estar vazio`);
      }
      
      // ENHANCED ERROR DETECTION: Log potential slug-like status IDs before validation fails
      if (cleanNewStatusId.includes('-') && cleanNewStatusId.length < 36) {
        console.warn(`Potential slug detected in status ID: ${cleanNewStatusId}`);
      }
      
      // CRITICAL: UUID validation - only accept valid UUIDs
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      if (!uuidPattern.test(cleanId)) {
        console.error(`Invalid startup ID format: ${cleanId}`);
        throw new Error(`Formato do ID da startup inválido: ${cleanId}`);
      }
      
      // ENHANCED ERROR DETECTION: Provide clearer error for common issues
      if (!uuidPattern.test(cleanNewStatusId)) {
        console.error(`Invalid status ID format: ${cleanNewStatusId}`);
        if (cleanNewStatusId.includes('-') && cleanNewStatusId.length < 36) {
          // Likely a slug or descriptive ID instead of UUID
          throw new Error(`Formato do ID do status inválido (recebido: ${cleanNewStatusId}). É necessário um UUID válido.`);
        } else {
          throw new Error(`Formato do ID do status inválido: ${cleanNewStatusId}`);
        }
      }
      
      // Only validate oldStatusId if it's present
      if (cleanOldStatusId !== undefined && !uuidPattern.test(cleanOldStatusId)) {
        console.warn(`Invalid old status ID format: ${cleanOldStatusId}. Setting to undefined.`);
        // Keep undefined to allow service to fetch from DB
      }
      
      // CRITICAL DEBUG: Log complete details of parameters after all validation
      console.log('MUTATION VALIDATION COMPLETE');
      console.log('Final parameters after validation:');
      console.log('- Startup ID:', cleanId);
      console.log('- New status ID:', cleanNewStatusId);
      console.log('- Old status ID:', cleanOldStatusId);
      
      // Finally create a clean object with validated data
      const safeParams = {
        id: cleanId,
        newStatusId: cleanNewStatusId,
        oldStatusId: cleanOldStatusId && uuidPattern.test(cleanOldStatusId) ? cleanOldStatusId : undefined
      };
      
      console.log(`Calling updateStartupStatus with safe parameters:`, safeParams);
      
      // CRITICAL: Make sure we send 100% valid parameters
      return updateStartupStatus(safeParams.id, safeParams.newStatusId, safeParams.oldStatusId);
    },
    onMutate: async (variables) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['startups'] });
      
      console.log("Optimistic update for status change:", variables);
      
      // Return a context object with the original status
      return { oldStatusId: variables.oldStatusId };
    },
    onSuccess: (data, variables) => {
      console.log("Status update succeeded:", data);
      
      // Check if the status name contains "investida" or "invested" to identify portfolio changes
      const checkIfInvestedStatus = async () => {
        try {
          // Get the status name from supabase directly
          const { supabase } = await import('@/integrations/supabase/client');
          const { data: statusData } = await supabase
            .from('statuses')
            .select('name')
            .eq('id', variables.newStatusId)
            .single();
          
          if (statusData && statusData.name) {
            const statusName = statusData.name.toLowerCase();
            return statusName.includes('investida') || statusName.includes('invested');
          }
          return false;
        } catch (error) {
          console.error('Error checking if status is invested:', error);
          return false;
        }
      };
      
      // Invalidate all potentially affected queries
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
      
      // Check if this is a move to an "Investida" status and invalidate portfolio queries
      checkIfInvestedStatus().then(isInvestedStatus => {
        if (isInvestedStatus) {
          console.log('Portfolio change detected, invalidating portfolio queries');
          queryClient.invalidateQueries({ 
            queryKey: ['startups', 'portfolio']
          });
        }
      });
      
      toast.success('Card movido com sucesso');
    },
    onError: (error, variables, context) => {
      console.error("Status update failed:", error);
      console.error("Failed variables:", variables);
      
      // More detailed error message and logging
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      }
      
      toast.error(error instanceof Error 
        ? `Falha ao atualizar status: ${error.message}` 
        : 'Falha ao atualizar o status da startup');
      
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
