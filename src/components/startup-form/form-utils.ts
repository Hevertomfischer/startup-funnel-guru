
import { StartupFormValues } from './schema';
import { Status } from '@/types';

/**
 * Maps database startup values to form structure
 */
export const mapStartupToFormValues = (startup: any, statuses: Status[]): StartupFormValues => {
  if (!startup) return {
    priority: 'medium',
    statusId: statuses[0]?.id || '',
    values: {}
  };
  
  return {
    priority: startup.priority || 'medium',
    statusId: startup.status_id || statuses[0]?.id || '',
    dueDate: startup.due_date || '',
    assignedTo: startup.assigned_to || '',
    values: {
      Startup: startup.name || '',
      'Site da Startup': startup.website || '',
      'Problema que Resolve': startup.problem_solved || '',
      Setor: startup.sector || '',
      'Modelo de Negócio': startup.business_model || '',
      MRR: startup.mrr || '',
      'Quantidade de Clientes': startup.client_count || '',
      // Add other fields as needed
      ...(startup.values || {})
    },
  };
};

/**
 * Calculates form completion progress
 */
export const calculateFormProgress = (values: any): number => {
  const requiredFields = [
    'values.Startup', 
    'priority', 
    'statusId'
  ];
  
  const optionalFields = [
    'values.Setor',
    'values.Modelo de Negócio',
    'values.Problema que Resolve',
    'values.Site da Startup',
    'values.MRR',
    'values.Quantidade de Clientes',
    'values.Nome do CEO',
    'values.Pontos Positivos',
    'values.Pontos de Atenção'
  ];
  
  // Count filled required fields
  const filledRequired = requiredFields.filter(field => {
    const fieldValue = field.split('.').reduce((obj, key) => obj && obj[key], values as any);
    return fieldValue !== undefined && fieldValue !== '';
  }).length;
  
  // Count filled optional fields
  const filledOptional = optionalFields.filter(field => {
    const fieldValue = field.split('.').reduce((obj, key) => obj && obj[key], values as any);
    return fieldValue !== undefined && fieldValue !== '';
  }).length;
  
  // Calculate progress percentage
  const requiredWeight = 60; // 60% of progress from required fields
  const optionalWeight = 40; // 40% of progress from optional fields
  
  const requiredProgress = (filledRequired / requiredFields.length) * requiredWeight;
  const optionalProgress = (filledOptional / optionalFields.length) * optionalWeight;
  
  return Math.round(requiredProgress + optionalProgress);
};
