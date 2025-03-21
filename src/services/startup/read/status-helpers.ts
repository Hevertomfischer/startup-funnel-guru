
import { supabase } from '../../base-service';
import { applyExponentialBackoff } from './utils';

/**
 * Verifica a existência de um status específico
 * @param statusId O ID do status a verificar
 * @returns Objeto com informações sobre o status
 */
export const verifyStatusExists = async (statusId: string): Promise<{
  statusFound: boolean;
  statusName: string;
}> => {
  let statusCheckAttempts = 0;
  let statusFound = false;
  let statusName = '';
  
  while (statusCheckAttempts < 3 && !statusFound) {
    console.log(`Verificando existência do status ${statusId} (tentativa ${statusCheckAttempts + 1})`);
    
    const { data: statusCheck, error: statusError } = await supabase
      .from('statuses')
      .select('id, name')
      .eq('id', statusId)
      .maybeSingle();
    
    if (statusError) {
      console.warn(`Erro ao verificar status ${statusId} (tentativa ${statusCheckAttempts + 1}):`, statusError);
      statusCheckAttempts++;
      await applyExponentialBackoff(statusCheckAttempts);
    } else if (statusCheck) {
      console.log(`Status encontrado: ${statusCheck.name} (${statusId})`);
      statusFound = true;
      statusName = statusCheck.name;
    } else {
      console.warn(`Status com ID ${statusId} não encontrado (tentativa ${statusCheckAttempts + 1})`);
      statusCheckAttempts++;
      await applyExponentialBackoff(statusCheckAttempts);
    }
  }
  
  return { statusFound, statusName };
};
