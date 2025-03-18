
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WorkflowRule, WorkflowAction, Status, Startup } from '@/types';
import { useUpdateStartupMutation } from '../use-supabase-query';
import { getWorkflowRules, saveWorkflowRules } from './workflow-utils';
import { evaluateCondition } from './workflow-evaluator';
import { useWorkflowTasks } from './use-workflow-tasks';

export const useWorkflowRules = () => {
  const [rules, setRules] = useState<WorkflowRule[]>([]);
  const { toast } = useToast();
  const updateStartupMutation = useUpdateStartupMutation();
  const { tasks, createTask } = useWorkflowTasks();

  useEffect(() => {
    // Load rules from storage on initialization
    setRules(getWorkflowRules());
  }, []);

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
