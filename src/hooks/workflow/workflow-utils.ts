
import { WorkflowRule, Task } from '@/types';

// Function to get workflow rules from local storage
export const getWorkflowRules = (): WorkflowRule[] => {
  initializeWorkflowRules();
  try {
    const rulesJson = localStorage.getItem('workflowRules');
    
    // Debug log the raw JSON
    console.log('Raw workflow rules JSON:', rulesJson);
    
    const rules = JSON.parse(rulesJson || '[]');
    console.log('Loaded workflow rules from storage:', rules.length);
    
    if (rules.length > 0) {
      // Log the first rule to check its format
      console.log('Sample rule structure:', {
        name: rules[0].name,
        conditions: rules[0].conditions,
        active: rules[0].active
      });
    }
    
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
    
    // Verify the save worked
    const savedRules = localStorage.getItem('workflowRules');
    console.log('Verified saved rules length:', savedRules ? JSON.parse(savedRules).length : 0);
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

// Function to clear workflow rules - useful for debugging
export const clearWorkflowRules = (): void => {
  try {
    localStorage.setItem('workflowRules', JSON.stringify([]));
    console.log('All workflow rules cleared');
  } catch (error) {
    console.error('Error clearing workflow rules:', error);
  }
};
