
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WorkflowRule, WorkflowAction, Status, Startup } from '@/types';
import { useUpdateStartupMutation } from '../use-supabase-query';
import { getWorkflowRules, saveWorkflowRules, debugWorkflowRules } from './workflow-utils';
import { evaluateCondition, wouldSetNullStatus, debugWorkflowCondition, getSafeStatusId } from './workflow-evaluator';
import { useWorkflowTasks } from './use-workflow-tasks';

export const useWorkflowRules = () => {
  const [rules, setRules] = useState<WorkflowRule[]>([]);
  const { toast } = useToast();
  const updateStartupMutation = useUpdateStartupMutation();
  const { tasks, createTask } = useWorkflowTasks();

  useEffect(() => {
    // Load rules from storage on initialization
    const loadedRules = getWorkflowRules();
    console.log('Loading workflow rules:', loadedRules.length);
    setRules(loadedRules);
  }, []);

  // Execute actions when conditions are met
  const executeActions = async (
    actions: WorkflowAction[],
    startup: Startup,
    statuses: Status[]
  ) => {
    // CRITICAL FIX: Check for null status_id updates before proceeding
    const wouldSetNull = wouldSetNullStatus(actions);
    if (wouldSetNull) {
      console.error('CRITICAL: Workflow rule attempted to set null status_id, action blocked');
      toast({
        title: "Erro no Workflow",
        description: "Uma regra de workflow tentou definir um status nulo. Esta ação foi bloqueada.",
        variant: "destructive"
      });
      return;
    }
    
    // Create a clean update object without any null status values
    const updates: Record<string, any> = {};
    let statusChanged = false;
    let statusName = '';

    console.log('Executing workflow actions:', actions);

    // First pass: collect all updates into a temporary object
    const tempUpdates: Record<string, any> = {};
    for (const action of actions) {
      if (action.type === 'updateField' && action.config.fieldId && action.config.value !== undefined) {
        tempUpdates[action.config.fieldId] = action.config.value;
      }
    }

    // Process actions with the collected updates
    for (const action of actions) {
      switch (action.type) {
        case 'updateField':
          if (action.config.fieldId && action.config.value !== undefined) {
            // CRITICAL FIX: Extra protection for status fields
            if ((action.config.fieldId === 'statusId' || action.config.fieldId === 'status_id')) {
              // Validate and sanitize the status_id
              const safeStatusId = getSafeStatusId(action.config.value);
              
              // If status is null after validation, block the action
              if (safeStatusId === null) {
                console.error('CRITICAL: Prevented setting null status_id via workflow');
                toast({
                  title: "Erro no Workflow",
                  description: "Tentativa de definir status nulo bloqueada",
                  variant: "destructive"
                });
                continue; // Skip this action and go to the next
              }
              
              // If we got here, the value is safe to use
              updates[action.config.fieldId] = safeStatusId;
              statusChanged = true;
              const newStatus = statuses.find(s => s.id === safeStatusId);
              statusName = newStatus?.name || '';
            } else {
              // For non-status fields, just add to updates
              updates[action.config.fieldId] = action.config.value;
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

    // If we have field updates, apply them with extra safety
    if (Object.keys(updates).length > 0) {
      try {
        // CRITICAL: Ensure we're never sending null statuses
        // This shouldn't happen due to earlier checks, but one last verification
        if (updates.statusId === null || updates.statusId === undefined) {
          delete updates.statusId;
          console.error('CRITICAL: Removed null statusId from updates before saving');
          toast({
            title: "Aviso de Workflow",
            description: "Uma tentativa de definir status nulo foi evitada",
            variant: "destructive"
          });
        }
        
        if (updates.status_id === null || updates.status_id === undefined) {
          delete updates.status_id;
          console.error('CRITICAL: Removed null status_id from updates before saving');
          toast({
            title: "Aviso de Workflow",
            description: "Uma tentativa de definir status nulo foi evitada",
            variant: "destructive"
          });
        }
        
        // CRITICAL FIX: If the update doesn't include statusId but we have one in the startup
        // add it to ensure it's preserved during the update
        if (!updates.statusId && !updates.status_id && startup.statusId) {
          console.log('Adding current statusId to updates to prevent nullification:', startup.statusId);
          updates.statusId = startup.statusId;
        }
        
        // Only proceed with update if we still have fields to update
        if (Object.keys(updates).length > 0) {
          console.log('Applying workflow updates to startup:', updates);
          // For debugging, show what the startup will look like after update
          console.log('Startup before update:', {
            id: startup.id,
            statusId: startup.statusId,
            updatesContainsStatusId: 'statusId' in updates || 'status_id' in updates
          });
          
          await updateStartupMutation.mutate({
            id: startup.id,
            startup: updates
          });

          if (statusChanged) {
            toast({
              title: "Status Updated by Workflow",
              description: `Startup "${startup.values?.name || 'Unknown'}" foi movido para ${statusName}`,
            });
          }
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
    
    console.log('Processing startup through workflow rules:', {
      startupId: startup.id,
      statusId: startup.statusId,
      previousStatusId: previousValues?.statusId,
      activeRulesCount: activeRules.length,
      allRulesCount: rules.length
    });
    
    if (activeRules.length === 0) {
      console.log('No active workflow rules to process');
    }
    
    for (const rule of activeRules) {
      try {
        // CRITICAL FIX: Skip rules that would set null status
        const wouldSetNull = wouldSetNullStatus(rule.actions);
        if (wouldSetNull) {
          console.error(`Workflow rule "${rule.name}" skipped because it would set null status`);
          continue;
        }
        
        // Show full rule details for debugging
        console.log(`Evaluating rule: "${rule.name}"`, {
          conditions: rule.conditions,
          actions: rule.actions.map(a => a.type)
        });
        
        // Check if all conditions are met
        const conditionResults = rule.conditions.map(condition => {
          // Add more detailed debugging for each condition
          debugWorkflowCondition(rule.name, condition, startup, previousValues);
          
          const result = evaluateCondition(condition, startup, previousValues);
          console.log(`- Condition "${condition.fieldId} ${condition.operator} ${condition.value}" result: ${result}`);
          return result;
        });
        
        const conditionsMet = conditionResults.every(result => result === true);
        console.log(`All conditions met for rule "${rule.name}": ${conditionsMet}`);
        
        if (conditionsMet) {
          console.log(`Workflow rule "${rule.name}" triggered for startup "${startup.values?.name || 'Unknown'}"`);
          await executeActions(rule.actions, startup, statuses);
        }
      } catch (error) {
        // Catch errors per rule to prevent one bad rule from breaking everything
        console.error(`Error processing workflow rule "${rule.name}":`, error);
        toast({
          title: "Workflow Rule Error",
          description: `Error in rule "${rule.name}": ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: "destructive"
        });
      }
    }
  };

  return {
    rules,
    setRules,
    tasks,
    processStartup,
    saveRules: (newRules: WorkflowRule[]) => {
      // CRITICAL FIX: Validate rules before saving
      const validatedRules = newRules.map(rule => {
        // Check if any action would set a null status
        const hasBadAction = wouldSetNullStatus(rule.actions);
        
        if (hasBadAction) {
          // Disable the rule and mark it for attention
          console.error(`CRITICAL: Rule "${rule.name}" would set null status, disabling`);
          return {
            ...rule,
            active: false,
            name: `⚠️ ${rule.name} (Erro: definindo status nulo)`
          };
        }
        
        return rule;
      });
      
      console.log('Saving workflow rules:', validatedRules.length);
      setRules(validatedRules);
      saveWorkflowRules(validatedRules);
    }
  };
};
