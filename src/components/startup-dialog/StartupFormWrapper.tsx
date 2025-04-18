
import React, { useEffect } from 'react';
import StartupForm from '../startup-form';
import { Status } from '@/types';

interface StartupFormWrapperProps {
  startup?: any;
  statuses: Status[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const StartupFormWrapper: React.FC<StartupFormWrapperProps> = ({
  startup,
  statuses,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  // UUID validation helper
  const isValidUUID = (id: string): boolean => {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidPattern.test(id);
  };
  
  // Log startup data for debugging
  useEffect(() => {
    if (startup) {
      console.log('StartupFormWrapper received startup data:', startup);
      console.log('StartupFormWrapper startup has attachments:', startup.attachments);
      console.log('StartupFormWrapper startup has pitchDeck:', startup.pitchDeck);
    }
  }, [startup]);
  
  const handleFormSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
    
    // Validate that statusId exists and is valid UUID
    if (!data.statusId || !isValidUUID(data.statusId)) {
      console.warn('Invalid status ID provided, using first available status');
      if (statuses && statuses.length > 0) {
        data.statusId = statuses[0].id;
      } else {
        console.error('No valid status available');
        return; // Don't submit if we can't find a valid status
      }
    }
    
    // Verify that the status exists in our list of valid statuses
    const statusExists = statuses.some(status => status.id === data.statusId);
    if (!statusExists) {
      console.warn('Status ID not found in statuses list, using first available status');
      if (statuses && statuses.length > 0) {
        data.statusId = statuses[0].id;
      } else {
        console.error('No valid status available');
        return; // Don't submit if we can't find a valid status
      }
    }
    
    // IMPORTANT: Do not include the changed_by field as it must be handled by DB triggers
    const startupData = {
      // Map form values to database schema
      name: data.values.Startup,
      status_id: data.statusId, // Will be normalized in the service
      priority: data.priority,
      assigned_to: data.assignedTo || null,
      due_date: data.dueDate || null,
      website: data.values["Site da Startup"] || null,
      problem_solved: data.values["Problema que Resolve"] || null,
      sector: data.values.Setor || null,
      business_model: data.values["Modelo de Negócio"] || null,
      
      // Map all other fields
      ceo_name: data.values["Nome do CEO"] || null,
      ceo_email: data.values["E-mail do CEO"] || null,
      ceo_whatsapp: data.values["Whatsapp do CEO"] || null,
      ceo_linkedin: data.values["Linkedin CEO"] || null,
      founding_date: data.values["Data da Fundação"] || null,
      city: data.values["Cidade"] || null,
      state: data.values["Estado"] || null,
      google_drive_link: data.values["Link do Google Drive"] || null,
      category: data.values.Category || null,
      market: data.values.Mercado || null,
      problem_solution: data.values["Como Resolve o Problema"] || null,
      differentials: data.values["Diferenciais da Startup"] || null,
      competitors: data.values["Principais Concorrentes"] || null,
      positive_points: data.values["Pontos Positivos"] || null,
      attention_points: data.values["Pontos de Atenção"] || null,
      scangels_value_add: data.values["Como a SCAngels pode agregar valor na Startup"] || null,
      no_investment_reason: data.values["Motivo Não Investimento"] || null,
      origin_lead: data.values["Origem Lead"] || null,
      referred_by: data.values["Quem Indicou"] || null,
      observations: data.values["Observações"] || null,
      
      // For numeric fields, explicitly convert to numbers when not null or empty
      // This prevents type errors with string values
      mrr: data.values.MRR !== undefined && data.values.MRR !== '' ? 
        parseFloat(data.values.MRR) : null,
      
      client_count: data.values["Quantidade de Clientes"] !== undefined && 
        data.values["Quantidade de Clientes"] !== '' ? 
        parseInt(data.values["Quantidade de Clientes"], 10) : null,
      
      accumulated_revenue_current_year: data.values["Receita Acumulada no Ano corrente"] !== undefined && 
        data.values["Receita Acumulada no Ano corrente"] !== '' ? 
        parseFloat(data.values["Receita Acumulada no Ano corrente"]) : null,
      
      total_revenue_last_year: data.values["Receita Total do último Ano"] !== undefined && 
        data.values["Receita Total do último Ano"] !== '' ? 
        parseFloat(data.values["Receita Total do último Ano"]) : null,
      
      total_revenue_previous_year: data.values["Receita total do penúltimo Ano"] !== undefined && 
        data.values["Receita total do penúltimo Ano"] !== '' ? 
        parseFloat(data.values["Receita total do penúltimo Ano"]) : null,
      
      partner_count: data.values["Quantidade de Sócios"] !== undefined && 
        data.values["Quantidade de Sócios"] !== '' ? 
        parseInt(data.values["Quantidade de Sócios"], 10) : null,
      
      tam: data.values.TAM !== undefined && data.values.TAM !== '' ? 
        parseFloat(data.values.TAM) : null,
      
      sam: data.values.SAM !== undefined && data.values.SAM !== '' ? 
        parseFloat(data.values.SAM) : null,
      
      som: data.values.SOM !== undefined && data.values.SOM !== '' ? 
        parseFloat(data.values.SOM) : null,
      
      // Add attachments and pitchDeck to the data being submitted
      attachments: data.attachments || [],
      pitchDeck: data.pitchDeck || null,
      
      // If it's an update, include the id
      ...(startup?.id && { id: startup.id }),
    };
    
    console.log('Mapped startup data to send to Supabase:', startupData);
    
    try {
      onSubmit(startupData);
    } catch (error) {
      console.error('Error in startup form submission:', error);
    }
  };

  return (
    <StartupForm
      startup={startup}
      statuses={statuses}
      onSubmit={handleFormSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
    />
  );
};

export default StartupFormWrapper;
