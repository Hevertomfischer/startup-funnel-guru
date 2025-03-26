
import { WorkflowRule, Task } from '@/types';

// Function to get workflow rules from local storage
export const getWorkflowRules = (): WorkflowRule[] => {
  initializeWorkflowRules();
  try {
    const rules = JSON.parse(localStorage.getItem('workflowRules') || '[]');
    console.log('Loaded workflow rules from storage:', rules.length);
    return rules;
  } catch (error) {
    console.error('Error loading workflow rules:', error);
    return [];
  }
};

// Function to save workflow rules to local storage
export const saveWorkflowRules = (rules: WorkflowRule[]): void => {
  try {
    console.log('Saving workflow rules to storage:', rules.length);
    localStorage.setItem('workflowRules', JSON.stringify(rules));
  } catch (error) {
    console.error('Error saving workflow rules:', error);
  }
};

// Function to get tasks from local storage
export const getTasks = (): Task[] => {
  try {
    return JSON.parse(localStorage.getItem('workflowTasks') || '[]');
  } catch (error) {
    console.error('Error loading workflow tasks:', error);
    return [];
  }
};

// Function to save tasks to local storage
export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem('workflowTasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving workflow tasks:', error);
  }
};

// Initialize workflow rules if they don't exist
export const initializeWorkflowRules = (): void => {
  const existingRules = localStorage.getItem('workflowRules');
  if (!existingRules) {
    localStorage.setItem('workflowRules', JSON.stringify([]));
  }
};

// Debug utility to log workflow rule information
export const debugWorkflowRules = (): void => {
  const rules = getWorkflowRules();
  console.log('===== WORKFLOW RULES DEBUG =====');
  console.log(`Total rules: ${rules.length}`);
  console.log(`Active rules: ${rules.filter(r => r.active).length}`);
  
  rules.forEach((rule, index) => {
    console.log(`Rule ${index + 1}: ${rule.name} (${rule.active ? 'ACTIVE' : 'INACTIVE'})`);
    console.log('  Conditions:', rule.conditions);
    console.log('  Actions:', rule.actions);
  });
  
  console.log('================================');
};
