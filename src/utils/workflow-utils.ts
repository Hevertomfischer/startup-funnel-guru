
import { WorkflowRule } from '@/types';

// Initialize workflow rules if they don't exist
export const initializeWorkflowRules = (): void => {
  const existingRules = localStorage.getItem('workflowRules');
  if (!existingRules) {
    localStorage.setItem('workflowRules', JSON.stringify([]));
  }
};
