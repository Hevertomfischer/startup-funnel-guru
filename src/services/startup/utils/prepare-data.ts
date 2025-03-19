
import { processStartupNumericFields } from './numeric-field-utils';

/**
 * Prepares data for Supabase by removing non-column fields and ensuring proper types
 */
export function prepareStartupData(data: any): any {
  console.log('prepareStartupData input data:', data);
  
  // Create a clean copy of the data without any non-database fields
  const cleanData = { ...data };
  
  // CRITICAL: Always remove changed_by field as this is handled by database triggers
  if ('changed_by' in cleanData) {
    delete cleanData.changed_by;
  }
  
  // Remove virtual fields not in the database schema
  const fieldsToRemove = [
    'values',
    'labels',
    'old_status_id',
    'attachments',
    'statusId', // Remove incorrect field name if present
    'assignedTo', // Remove incorrect field name if present
    'status_current', // Remove if present (not a database column)
    'isStatusUpdate', // Remove this flag - it's only for our client code
    '__is_status_update', // Remove legacy flag
  ];
  
  // Check if this is a status update operation (special handling) BEFORE removing the flag
  const isStatusUpdate = data.isStatusUpdate === true;
  
  // Remove all non-database fields
  fieldsToRemove.forEach(field => {
    if (field in cleanData) {
      delete cleanData[field];
    }
  });
  
  // Convert camelCase fields to snake_case if present
  if ('statusId' in data && !('status_id' in cleanData)) {
    cleanData.status_id = data.statusId;
  }
  
  if ('assignedTo' in data && !('assigned_to' in cleanData)) {
    cleanData.assigned_to = data.assignedTo;
  }
  
  // Validate UUID format for status_id
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  // NOVA ABORDAGEM: Para atualizações de status, garantir que o status_id seja válido
  if (isStatusUpdate) {
    // Para status updates, queremos ser extremamente rigorosos
    
    // Primeiro vamos verificar se temos um status_id válido
    if (!cleanData.status_id) {
      console.error('Attempted status update with null/empty status_id');
      throw new Error('ID do status não pode estar vazio ao atualizar status');
    }
    
    // Garantir que status_id está definido e não é uma string vazia
    if (typeof cleanData.status_id === 'string') {
      cleanData.status_id = cleanData.status_id.trim();
      
      if (cleanData.status_id === '') {
        console.error('Status ID is an empty string');
        throw new Error('ID do status não pode estar vazio');
      }
      
      // Verificar se é um UUID válido
      if (!uuidPattern.test(cleanData.status_id)) {
        console.error(`Invalid UUID format for status_id in status update: ${cleanData.status_id}`);
        throw new Error(`Formato de ID do status inválido: ${cleanData.status_id}`);
      }
    } else {
      // Se não for uma string, é inválido para um status update
      console.error(`Invalid data type for status_id: ${typeof cleanData.status_id}`);
      throw new Error('Tipo de dado inválido para ID do status');
    }
    
    // CRÍTICO: Criar uma cópia segura para garantir que o objeto sendo passado é o que esperamos
    const safeUpdateData = {
      status_id: cleanData.status_id
    };
    
    // Processar campos numéricos apenas para o objeto seguro
    const processed = processStartupNumericFields(safeUpdateData);
    
    // Verificação final
    if (!processed.status_id || processed.status_id === null || processed.status_id === '') {
      console.error('FINAL CHECK FAILED: Status update with null status_id after processing');
      throw new Error('ID do status inválido após processamento');
    }
    
    console.log('prepareStartupData result for status update:', processed);
    return processed;
  } 
  else {
    // For non-status updates, handle normally
    if (cleanData.status_id === undefined || cleanData.status_id === '') {
      cleanData.status_id = null;
    } else if (cleanData.status_id && typeof cleanData.status_id === 'string') {
      // Check if it's a valid UUID format
      if (!uuidPattern.test(cleanData.status_id)) {
        console.error(`Invalid UUID format for status_id: ${cleanData.status_id}`);
        cleanData.status_id = null;
      }
    } else if (cleanData.status_id && typeof cleanData.status_id !== 'string') {
      // If it's not a string, convert to string and then check format
      const statusIdStr = String(cleanData.status_id);
      if (!uuidPattern.test(statusIdStr)) {
        console.error(`Invalid UUID format for status_id: ${statusIdStr}`);
        cleanData.status_id = null;
      } else {
        cleanData.status_id = statusIdStr;
      }
    }
  }
  
  // Ensure assigned_to is a string or null
  if (cleanData.assigned_to === undefined || cleanData.assigned_to === '') {
    cleanData.assigned_to = null;
  } else if (cleanData.assigned_to && typeof cleanData.assigned_to !== 'string') {
    cleanData.assigned_to = String(cleanData.assigned_to);
  }
  
  // Process numeric fields (ensuring correct types)
  const processed = processStartupNumericFields(cleanData);
  console.log('prepareStartupData result:', processed);
  
  return processed;
}
