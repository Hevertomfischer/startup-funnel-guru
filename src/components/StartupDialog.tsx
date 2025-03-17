
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTabs,
  DialogTabsContent,
  DialogTabsList,
  DialogTabsTrigger
} from '@/components/ui/dialog';
import StartupForm from './StartupForm';
import { Status } from '@/types';
import StartupHistoryTab from './startup-history/StartupHistoryTab';

interface StartupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  startup?: any;
  statuses: Status[];
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

const StartupDialog: React.FC<StartupDialogProps> = ({
  open,
  onOpenChange,
  title,
  startup,
  statuses,
  onSubmit,
  isSubmitting,
}) => {
  console.log('StartupDialog rendered with open:', open);
  console.log('Startup data:', startup);
  console.log('Status length:', statuses?.length);
  
  useEffect(() => {
    console.log('StartupDialog useEffect - open state changed to:', open);
  }, [open]);
  
  const handleFormSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
    
    // Validate that statusId exists and is valid
    if (!data.statusId && statuses && statuses.length > 0) {
      console.warn('No status ID provided, using first available status');
      data.statusId = statuses[0].id;
    }
    
    // Prepare data for Supabase
    const startupData = {
      // Map form values to database schema
      name: data.values.Startup,
      status_id: data.statusId,
      priority: data.priority,
      assigned_to: data.assignedTo || null,
      due_date: data.dueDate || null,
      website: data.values["Site da Startup"] || null,
      problem_solved: data.values["Problema que Resolve"] || null,
      sector: data.values.Setor || null,
      business_model: data.values["Modelo de Negócio"] || null,
      
      // Ensure numeric fields are properly converted
      mrr: data.values.MRR !== undefined && data.values.MRR !== '' ? Number(data.values.MRR) : null,
      client_count: data.values["Quantidade de Clientes"] !== undefined && data.values["Quantidade de Clientes"] !== '' ? 
        Number(data.values["Quantidade de Clientes"]) : null,
      
      // New fields mapped from form to database
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
      
      // Ensure numeric fields are properly converted with null fallbacks
      accumulated_revenue_current_year: data.values["Receita Acumulada no Ano corrente"] !== undefined && 
        data.values["Receita Acumulada no Ano corrente"] !== '' ? 
        Number(data.values["Receita Acumulada no Ano corrente"]) : null,
      
      total_revenue_last_year: data.values["Receita Total do último Ano"] !== undefined && 
        data.values["Receita Total do último Ano"] !== '' ? 
        Number(data.values["Receita Total do último Ano"]) : null,
      
      total_revenue_previous_year: data.values["Receita total do penúltimo Ano"] !== undefined && 
        data.values["Receita total do penúltimo Ano"] !== '' ? 
        Number(data.values["Receita total do penúltimo Ano"]) : null,
      
      partner_count: data.values["Quantidade de Sócios"] !== undefined && data.values["Quantidade de Sócios"] !== '' ? 
        Number(data.values["Quantidade de Sócios"]) : null,
      
      tam: data.values.TAM !== undefined && data.values.TAM !== '' ? Number(data.values.TAM) : null,
      sam: data.values.SAM !== undefined && data.values.SAM !== '' ? Number(data.values.SAM) : null,
      som: data.values.SOM !== undefined && data.values.SOM !== '' ? Number(data.values.SOM) : null,
      
      origin_lead: data.values["Origem Lead"] || null,
      referred_by: data.values["Quem Indicou"] || null,
      observations: data.values["Observações"] || null,
      
      // If it's an update, include the id
      ...(startup?.id && { id: startup.id }),
      
      // Add old_status_id explicitly for the history tracking
      // If this is an edit and status is changing, store the original status_id
      old_status_id: startup?.status_id && data.statusId !== startup.status_id ? startup.status_id : undefined
    };
    
    console.log('Mapped startup data to send to Supabase:', startupData);
    
    try {
      onSubmit(startupData);
    } catch (error) {
      console.error('Error in startup form submission:', error);
    }
  };
  
  // Determine if we should show the history tab (only for existing startups)
  const showHistoryTab = startup?.id ? true : false;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        {showHistoryTab ? (
          <DialogTabs defaultValue="form">
            <DialogTabsList className="grid grid-cols-2">
              <DialogTabsTrigger value="form">Formulário</DialogTabsTrigger>
              <DialogTabsTrigger value="history">Histórico</DialogTabsTrigger>
            </DialogTabsList>
            
            <DialogTabsContent value="form">
              <StartupForm
                startup={startup}
                statuses={statuses}
                onSubmit={handleFormSubmit}
                onCancel={() => onOpenChange(false)}
                isSubmitting={isSubmitting}
              />
            </DialogTabsContent>
            
            <DialogTabsContent value="history">
              <StartupHistoryTab startupId={startup.id} />
            </DialogTabsContent>
          </DialogTabs>
        ) : (
          <StartupForm
            startup={startup}
            statuses={statuses}
            onSubmit={handleFormSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StartupDialog;
