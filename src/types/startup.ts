
import { Attachment } from './attachment';

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
