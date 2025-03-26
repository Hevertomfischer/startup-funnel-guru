
import { WorkflowCondition, Startup } from '@/types';

// Evaluate if a condition is met
export const evaluateCondition = (
  condition: WorkflowCondition,
  startup: Startup,
  previousValues?: Record<string, any>
): boolean => {
  const fieldId = condition.fieldId;
  const value = condition.value;

  // Special case for status changes
  if (fieldId === 'statusId' && condition.operator === 'changed' && previousValues) {
    console.log('Evaluating status change condition:', {
      currentStatusId: startup.statusId,
      previousStatusId: previousValues.statusId,
      result: startup.statusId !== previousValues.statusId,
      startup
    });
    
    // Make sure both values exist and are different
    if (startup.statusId && previousValues.statusId) {
      return startup.statusId !== previousValues.statusId;
    }
    
    // If either value is missing, check if there was an actual change
    return Boolean(
      (startup.statusId || previousValues.statusId) && 
      (startup.statusId !== previousValues.statusId)
    );
  }

  // For regular fields
  let currentValue;
  if (fieldId in startup) {
    // @ts-ignore - using dynamic property access
    currentValue = startup[fieldId];
  } else if (startup.values && fieldId in startup.values) {
    currentValue = startup.values[fieldId];
  } else {
    console.log(`Field "${fieldId}" not found in startup or its values`);
    return false;
  }

  console.log(`Evaluating condition: ${fieldId} ${condition.operator} ${value}`, {
    currentValue,
    conditionValue: value
  });

  switch (condition.operator) {
    case 'equals':
      return currentValue === value;
    case 'notEquals':
      return currentValue !== value;
    case 'contains':
      return typeof currentValue === 'string' && currentValue.includes(String(value));
    case 'greaterThan':
      return typeof currentValue === 'number' && currentValue > Number(value);
    case 'lessThan':
      return typeof currentValue === 'number' && currentValue < Number(value);
    case 'changed':
      return previousValues && 
        (previousValues[fieldId] !== undefined) &&
        (currentValue !== previousValues[fieldId]);
    default:
      return false;
  }
};

// This is a new function to check if a workflow rule action would set a null status
export const wouldSetNullStatus = (
  actions: any[]
): boolean => {
  // MELHORADO: Verificação mais abrangente para detectar tentativas de definir status nulo
  return actions.some(action => {
    // Verifica ações que definiriam statusId ou status_id para null ou undefined
    if (action.type === 'updateField') {
      // Verifica tanto 'statusId' quanto 'status_id'
      const isStatusField = action.config?.fieldId === 'statusId' || 
                           action.config?.fieldId === 'status_id';
      
      // Verifica se o valor é null, undefined, string vazia, 'null' ou 'undefined'
      const isNullValue = action.config?.value === null || 
                         action.config?.value === undefined ||
                         action.config?.value === '' ||
                         action.config?.value === 'null' ||
                         action.config?.value === 'undefined';
      
      return isStatusField && isNullValue;
    }
    return false;
  });
};

// Helper to debug workflow rules evaluation
export const debugWorkflowCondition = (
  rule: string,
  condition: WorkflowCondition,
  startup: Startup,
  previousValues?: Record<string, any>
): void => {
  console.log(`[DEBUG WORKFLOW] Rule: ${rule}, Condition: ${condition.fieldId} ${condition.operator} ${condition.value}`);
  console.log('  Startup:', { id: startup.id, statusId: startup.statusId });
  console.log('  Previous values:', previousValues);
  
  if (condition.fieldId === 'statusId') {
    console.log('  Status condition details:', {
      currentStatusId: startup.statusId,
      previousStatusId: previousValues?.statusId,
      wasChanged: startup.statusId !== previousValues?.statusId
    });
  }
};

// NOVA FUNÇÃO: Validar e corrigir valores de status
export const getSafeStatusId = (statusId: any): string | null => {
  // Se for um UUID válido, retorna como está
  if (typeof statusId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(statusId)) {
    return statusId;
  }
  
  // Valores que definitivamente queremos tratar como nulos
  if (
    statusId === null || 
    statusId === undefined || 
    statusId === '' || 
    statusId === 'null' || 
    statusId === 'undefined'
  ) {
    console.error('CRITICAL: Attempted to use invalid status ID:', statusId);
    return null;
  }
  
  // Para outros casos, log e retorna como está (pode ser um slug ou outro formato)
  console.warn('Questionable status ID format:', statusId);
  return String(statusId);
};
