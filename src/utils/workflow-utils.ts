
import { WorkflowRule } from '@/types';

// Sample workflow rules for initial setup
export const mockWorkflowRules: WorkflowRule[] = [
  {
    id: '1',
    name: 'Send follow-up email after status change',
    conditions: [
      {
        fieldId: 'statusId',
        operator: 'changed',
        value: null
      }
    ],
    actions: [
      {
        type: 'sendEmail',
        config: {
          emailTemplate: 'status-change',
          emailTo: 'CEO'
        }
      }
    ],
    active: true
  },
  {
    id: '2',
    name: 'Move to Due Diligence when all info received',
    conditions: [
      {
        fieldId: 'problem_solved',
        operator: 'notEquals',
        value: ''
      },
      {
        fieldId: 'business_model',
        operator: 'notEquals',
        value: ''
      },
      {
        fieldId: 'sector',
        operator: 'notEquals',
        value: ''
      }
    ],
    actions: [
      {
        type: 'updateField',
        config: {
          fieldId: 'statusId',
          value: 'due-diligence'
        }
      },
      {
        type: 'createNotification',
        config: {
          message: 'Startup ready for due diligence review'
        }
      }
    ],
    active: true
  },
  {
    id: '3',
    name: 'Flag high MRR startups as priority',
    conditions: [
      {
        fieldId: 'mrr',
        operator: 'greaterThan',
        value: 100000
      }
    ],
    actions: [
      {
        type: 'updateField',
        config: {
          fieldId: 'priority',
          value: 'high'
        }
      }
    ],
    active: false
  },
  {
    id: '4',
    name: 'Create task when startup moves to Due Diligence',
    conditions: [
      {
        fieldId: 'statusId',
        operator: 'changed',
        value: null
      }
    ],
    actions: [
      {
        type: 'createTask',
        config: {
          taskTitle: 'Review startup financials',
          taskDescription: 'Perform detailed financial analysis and prepare report',
          assignTo: '', // This will be assigned in the UI
          taskPriority: 'high',
          taskDueDate: '' // Will be set in UI
        }
      }
    ],
    active: false
  }
];

// Initialize workflow rules if they don't exist
export const initializeWorkflowRules = (): void => {
  const existingRules = localStorage.getItem('workflowRules');
  if (!existingRules) {
    localStorage.setItem('workflowRules', JSON.stringify(mockWorkflowRules));
  }
};
