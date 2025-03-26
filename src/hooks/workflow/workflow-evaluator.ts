
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
      result: startup.statusId !== previousValues.statusId
    });
    return startup.statusId !== previousValues.statusId;
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
  return actions.some(action => 
    action.type === 'updateField' && 
    action.config?.fieldId === 'statusId' && 
    (action.config?.value === null || action.config?.value === undefined)
  );
};
