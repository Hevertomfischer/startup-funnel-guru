
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WorkflowRule, WorkflowCondition, WorkflowAction, Status, Startup, Task } from '@/types';
import { useUpdateStartupMutation } from './use-supabase-query';
import { initializeWorkflowRules } from '@/utils/workflow-utils';
import { useTeamMembersQuery } from './use-team-members';

// Initialize rules with mock data if none exist
const getWorkflowRules = (): WorkflowRule[] => {
  initializeWorkflowRules();
  return JSON.parse(localStorage.getItem('workflowRules') || '[]');
};

// Function to get tasks from local storage
const getTasks = (): Task[] => {
  return JSON.parse(localStorage.getItem('workflowTasks') || '[]');
};

// Function to save tasks to local storage
const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem('workflowTasks', JSON.stringify(tasks));
};

export const saveWorkflowRules = (rules: WorkflowRule[]): void => {
  localStorage.setItem('workflowRules', JSON.stringify(rules));
};

export const useWorkflowRules = () => {
  const [rules, setRules] = useState<WorkflowRule[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();
  const updateStartupMutation = useUpdateStartupMutation();
  const { data: teamMembers = [] } = useTeamMembersQuery();

  useEffect(() => {
    // Load rules from storage on initialization
    setRules(getWorkflowRules());
    // Load tasks from storage
    setTasks(getTasks());
  }, []);

  // Evaluate if a condition is met
  const evaluateCondition = (
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

  // Create a new task
  const createTask = (
    title: string,
    description: string,
    assignedTo: string,
    priority: 'low' | 'medium' | 'high',
    dueDate: string | undefined,
    startupId: string
  ): Task => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      assignedTo,
      priority: priority || 'medium',
      status: 'pending',
      relatedStartupId: startupId,
      createdAt: new Date(),
      dueDate: dueDate ? new Date(dueDate) : undefined
    };

    // Add task to tasks array
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);

    // Find team member name for notification
    const assignedMember = teamMembers.find(member => member.id === assignedTo);

    // Show notification
    toast({
      title: "Task Created",
      description: `Task "${title}" assigned to ${assignedMember?.name || 'a team member'}`,
    });

    return newTask;
  };

  // Execute actions when conditions are met
  const executeActions = async (
    actions: WorkflowAction[],
    startup: Startup,
    statuses: Status[]
  ) => {
    const updates: Record<string, any> = {};
    let statusChanged = false;
    let statusName = '';

    for (const action of actions) {
      switch (action.type) {
        case 'updateField':
          if (action.config.fieldId && action.config.value !== undefined) {
            updates[action.config.fieldId] = action.config.value;
            if (action.config.fieldId === 'statusId') {
              statusChanged = true;
              const newStatus = statuses.find(s => s.id === action.config.value);
              statusName = newStatus?.name || '';
            }
          }
          break;
        case 'sendEmail':
          // In a production app, this would call an API endpoint
          console.log('Email sent:', {
            template: action.config.emailTemplate,
            to: action.config.emailTo,
            startupId: startup.id
          });
          break;
        case 'createNotification':
          // Show notification to user
          toast({
            title: "Workflow Notification",
            description: action.config.message || 'Workflow rule triggered',
          });
          break;
        case 'createTask':
          if (action.config.taskTitle && action.config.assignTo) {
            createTask(
              action.config.taskTitle,
              action.config.taskDescription || '',
              action.config.assignTo,
              action.config.taskPriority || 'medium',
              action.config.taskDueDate,
              startup.id
            );
          }
          break;
      }
    }

    // If we have field updates, apply them
    if (Object.keys(updates).length > 0) {
      try {
        await updateStartupMutation.mutate({
          id: startup.id,
          startup: updates
        });

        if (statusChanged) {
          toast({
            title: "Status Updated by Workflow",
            description: `Startup "${startup.values.name || 'Unknown'}" was moved to ${statusName}`,
          });
        }
      } catch (error) {
        console.error('Error updating startup from workflow:', error);
        toast({
          title: "Workflow Error",
          description: "Failed to apply workflow actions",
          variant: "destructive"
        });
      }
    }
  };

  // Process a startup through all active workflow rules
  const processStartup = async (
    startup: Startup,
    previousValues: Record<string, any> | undefined,
    statuses: Status[]
  ) => {
    // Only process active rules
    const activeRules = rules.filter(rule => rule.active);
    
    for (const rule of activeRules) {
      // Check if all conditions are met
      const conditionsMet = rule.conditions.every(condition => 
        evaluateCondition(condition, startup, previousValues)
      );
      
      if (conditionsMet) {
        console.log(`Workflow rule "${rule.name}" triggered for startup "${startup.values.name || 'Unknown'}"`);
        await executeActions(rule.actions, startup, statuses);
      }
    }
  };

  return {
    rules,
    setRules,
    tasks,
    processStartup,
    saveRules: (newRules: WorkflowRule[]) => {
      setRules(newRules);
      saveWorkflowRules(newRules);
    }
  };
};
