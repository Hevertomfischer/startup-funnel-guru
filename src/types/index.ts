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

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
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
  uploadedAt: string;
  startup_id?: string;
  related_id?: string;
  related_type?: 'kpi' | 'board_meeting' | 'startup';
}

export interface StartupFieldValues {
  [key: string]: any;
}

export interface Startup {
  id: string;
  createdAt: string;
  updatedAt: string;
  statusId: string;
  values: {
    Startup?: string;
    'Problema que Resolve'?: string;
    'Problema Resolvido'?: string; // Alias for backward compatibility
    Setor?: string;
    'Modelo de Negócio'?: string;
    'Site da Startup'?: string;
    MRR?: number;
    'Quantidade de Clientes'?: number;
    [key: string]: any;
  };
  labels: string[];
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  dueDate?: string;
  timeTracking?: number;
  attachments: any[];
  pitchDeck?: {
    name: string;
    url: string;
    size?: number;
    type?: string;
    isPitchDeck?: boolean;
  };
}

export interface StartupValues {
  // General information
  Startup?: string;
  'Site da Startup'?: string;
  'Status Current'?: string;
  'Origem Lead'?: string;
  'Quem Indicou'?: string;
  'Observações'?: string;
  
  // Team information
  'Nome do CEO'?: string;
  'E-mail do CEO'?: string;
  'Whatsapp do CEO'?: string;
  'Linkedin CEO'?: string;
  'Quantidade de Sócios'?: number;
  
  // Company details
  'Data da Fundação'?: string;
  'Data Fundação'?: string;
  'Cidade'?: string;
  'Estado'?: string;
  'Link do Google Drive'?: string;
  
  // Business aspects
  'Setor'?: string;
  'Category'?: string;
  'Modelo de Negócio'?: string;
  'Mercado'?: string;
  
  // Problem and solution
  'Problema que Resolve'?: string;
  'Como Resolve o Problema'?: string;
  'Diferenciais da Startup'?: string;
  'Principais Concorrentes'?: string;
  
  // Analysis
  'Pontos Positivos'?: string;
  'Pontos de Atenção'?: string;
  'Como a SCAngels pode agregar valor na Startup'?: string;
  'Motivo Não Investimento'?: string;
  'Motivo da Não continuidade'?: string;
  
  // Financial metrics
  'Quantidade de Clientes'?: number;
  'Receita Acumulada no Ano corrente'?: number;
  'Receita Recorrente Mensal (MRR)'?: number;
  'Receita total do penúltimo Ano'?: number;
  'Receita Total do último Ano'?: number;
  'MRR'?: number;
  
  // Market size
  'TAM'?: number;
  'SAM'?: number;
  'SOM'?: number;
  
  // Scheduling
  'Actual end'?: string;
  
  // Alias for compatibility with existing code
  name?: string;
  Description?: string;
  Website?: string;
  'Problema Resolvido'?: string;
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

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  assignedTo?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  relatedStartupId?: string;
  createdAt: Date;
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
