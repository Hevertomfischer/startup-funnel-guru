
import { WorkflowRule, Task } from '@/types';
import { mockWorkflowRules } from '@/utils/workflow-utils';

// Function to get workflow rules from local storage
export const getWorkflowRules = (): WorkflowRule[] => {
  initializeWorkflowRules();
  return JSON.parse(localStorage.getItem('workflowRules') || '[]');
};

// Function to save workflow rules to local storage
export const saveWorkflowRules = (rules: WorkflowRule[]): void => {
  localStorage.setItem('workflowRules', JSON.stringify(rules));
};

// Function to get tasks from local storage
export const getTasks = (): Task[] => {
  return JSON.parse(localStorage.getItem('workflowTasks') || '[]');
};

// Function to save tasks to local storage
export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem('workflowTasks', JSON.stringify(tasks));
};

// Initialize workflow rules if they don't exist
export const initializeWorkflowRules = (): void => {
  const existingRules = localStorage.getItem('workflowRules');
  if (!existingRules) {
    localStorage.setItem('workflowRules', JSON.stringify(mockWorkflowRules));
  }
};
