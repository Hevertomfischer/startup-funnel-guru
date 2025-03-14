
export type DataType = 
  | 'shortText' 
  | 'longText' 
  | 'url' 
  | 'email' 
  | 'phone' 
  | 'number' 
  | 'date' 
  | 'monetary' 
  | 'attachment';

export interface Field {
  id: string;
  name: string;
  type: DataType;
  required?: boolean;
}

export interface Status {
  id: string;
  name: string;
  color: string;
  position?: number;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: number;
  uploadedAt: Date;
}

export interface StartupFieldValues {
  [key: string]: any;
}

export interface Startup {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  statusId: string;
  values: StartupFieldValues;
  labels: string[];
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  dueDate?: Date;
  timeTracking?: number;
  attachments: Attachment[];
}

export interface Column {
  id: string;
  title: string;
  startupIds: string[];
  position?: number;
}

export interface Board {
  columns: Column[];
}

export interface WorkflowCondition {
  fieldId: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'changed';
  value: any;
}

export interface WorkflowAction {
  type: 'updateField' | 'sendEmail' | 'createNotification';
  config: {
    fieldId?: string;
    value?: any;
    emailTemplate?: string;
    emailTo?: string;
    message?: string;
  };
}

export interface WorkflowRule {
  id: string;
  name: string;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  active: boolean;
}

export type ViewMode = 'board' | 'list';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AppSettings {
  currentView: ViewMode;
  activeStatusFilter?: string[];
  activeLabelFilter?: string[];
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}
