
export interface WorkflowCondition {
  fieldId: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'changed';
  value: any;
}

export interface WorkflowAction {
  type: 'updateField' | 'sendEmail' | 'createNotification' | 'createTask';
  config: {
    fieldId?: string;
    value?: any;
    emailTemplate?: string;
    emailTo?: string;
    message?: string;
    taskTitle?: string;
    taskDescription?: string;
    taskDueDate?: string;
    assignTo?: string;
    taskPriority?: 'low' | 'medium' | 'high';
  };
}

export interface WorkflowRule {
  id: string;
  name: string;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  active: boolean;
}
