
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
    return false;
  }

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
