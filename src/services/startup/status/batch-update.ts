
import { supabase, handleError } from '@/services/base-service';
import { toast } from 'sonner';
import { verifyStatusExists } from './validators';
import { logBatchUpdateResult } from './logs';
import { updateStartupStatus } from './update-service';

/**
 * Updates all startups with null status to the specified status
 * @param newStatusId The ID of the status to set
 * @returns Promise with the number of updated startups
 */
export const updateNullStatusStartups = async (
  newStatusId: string
): Promise<{ updated: number, errors: any[] }> => {
  try {
    // Verify the status exists before proceeding
    const statusExists = await verifyStatusExists(newStatusId);
    if (!statusExists) {
      toast.error(`Status não encontrado: ${newStatusId}`);
      throw new Error(`Status não encontrado: ${newStatusId}`);
    }
    
    // First, get all startups with null status
    const { data: startupsWithNullStatus, error: fetchError } = await supabase
      .from('startups')
      .select('id')
      .is('status_id', null);
    
    if (fetchError) {
      console.error('Erro ao buscar startups sem status:', fetchError);
      toast.error('Falha ao buscar startups para atualização');
      throw fetchError;
    }
    
    if (!startupsWithNullStatus || startupsWithNullStatus.length === 0) {
      console.log('Nenhuma startup com status null encontrada');
      toast.info('Não existem startups para atualizar');
      return { updated: 0, errors: [] };
    }
    
    console.log(`Encontradas ${startupsWithNullStatus.length} startups com status null`);
    
    // Update each startup one by one to ensure proper logging and history
    const errors: any[] = [];
    let updatedCount = 0;
    
    for (const startup of startupsWithNullStatus) {
      try {
        await updateStartupStatus(startup.id, newStatusId);
        updatedCount++;
      } catch (error) {
        console.error(`Falha ao atualizar status da startup ${startup.id}:`, error);
        errors.push({ startupId: startup.id, error });
      }
    }
    
    // Log and notify about the results
    logBatchUpdateResult(updatedCount, startupsWithNullStatus.length, errors);
    
    if (errors.length === 0) {
      toast.success(`${updatedCount} startups atualizadas com sucesso`);
    } else {
      toast.warning(`Atualizado ${updatedCount} de ${startupsWithNullStatus.length} startups, ocorreram ${errors.length} erros`);
    }
    
    return { updated: updatedCount, errors };
  } catch (error: any) {
    console.error('Erro na função updateNullStatusStartups:', error);
    handleError(error, 'Falha ao atualizar startups sem status');
    return { updated: 0, errors: [error] };
  }
};
