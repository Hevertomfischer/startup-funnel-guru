
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
    pitchDeck: startup.pitch_deck || null,
    attachments: startup.attachments || [],
    values: {
      Startup: startup.name || '',
      'Site da Startup': startup.website || '',
      'Problema que Resolve': startup.problem_solved || '',
      'Origem Lead': startup.origin_lead || '',
      'Quem Indicou': startup.referred_by || '',
      'Observações': startup.observations || '',
      Setor: startup.sector || '',
      'Modelo de Negócio': startup.business_model || '',
      MRR: startup.mrr || '',
      'Quantidade de Clientes': startup.client_count || '',
      'Nome do CEO': startup.ceo_name || '',
      'E-mail do CEO': startup.ceo_email || '',
      'Whatsapp do CEO': startup.ceo_whatsapp || '',
      'Linkedin CEO': startup.ceo_linkedin || '',
      'Data da Fundação': startup.founding_date || '',
      'Cidade': startup.city || '',
      'Estado': startup.state || '',
      'Link do Google Drive': startup.google_drive_link || '',
      'Category': startup.category || '',
      'Mercado': startup.market || '',
      'Como Resolve o Problema': startup.problem_solution || '',
      'Diferenciais da Startup': startup.differentials || '',
      'Principais Concorrentes': startup.competitors || '',
      'Pontos Positivos': startup.positive_points || '',
      'Pontos de Atenção': startup.attention_points || '',
      'Como a SCAngels pode agregar valor na Startup': startup.scangels_value_add || '',
      'Motivo Não Investimento': startup.no_investment_reason || '',
      'Receita Acumulada no Ano corrente': startup.accumulated_revenue_current_year || '',
      'Receita Total do último Ano': startup.total_revenue_last_year || '',
      'Receita total do penúltimo Ano': startup.total_revenue_previous_year || '',
      'Quantidade de Sócios': startup.partner_count || '',
      'TAM': startup.tam || '',
      'SAM': startup.sam || '',
      'SOM': startup.som || '',
      // Include any other fields that might be in the database
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
