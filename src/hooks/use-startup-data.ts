
import { useState, useEffect } from 'react';
import { Startup } from '@/types';
import { useStartupsQuery, useStatusesQuery } from '@/hooks/use-supabase-query';

export const useStartupData = () => {
  // Fetch startups and statuses from Supabase
  const { data: startupsData, isLoading: isLoadingStartups, isError: isErrorStartups } = useStartupsQuery();
  const { data: statusesData, isLoading: isLoadingStatuses } = useStatusesQuery();

  // State to hold the formatted startups data
  const [formattedStartups, setFormattedStartups] = useState<Startup[]>([]);

  // Format Supabase startups data to match the Startup type
  useEffect(() => {
    if (startupsData && Array.isArray(startupsData)) {
      const formatted = startupsData.map(startup => {
        // Find pitch deck in attachments if available
        const pitchDeck = startup.attachments?.find(
          (attachment: any) => attachment.name.toLowerCase().includes('pitch') || 
          attachment.name.toLowerCase().includes('deck')
        );

        return {
          id: startup.id,
          createdAt: startup.created_at || new Date().toISOString(),
          updatedAt: startup.updated_at || new Date().toISOString(),
          statusId: startup.status_id || '',
          values: {
            Startup: startup.name,
            'Problema que Resolve': startup.problem_solved,
            Setor: startup.sector,
            'Modelo de Negócio': startup.business_model,
            'Site da Startup': startup.website,
            MRR: startup.mrr,
            'Quantidade de Clientes': startup.client_count,
            
            // New fields
            'Nome do CEO': startup.ceo_name,
            'E-mail do CEO': startup.ceo_email,
            'Whatsapp do CEO': startup.ceo_whatsapp,
            'Linkedin CEO': startup.ceo_linkedin,
            'Data da Fundação': startup.founding_date,
            'Cidade': startup.city,
            'Estado': startup.state,
            'Link do Google Drive': startup.google_drive_link,
            'Category': startup.category,
            'Mercado': startup.market,
            'Como Resolve o Problema': startup.problem_solution,
            'Diferenciais da Startup': startup.differentials,
            'Principais Concorrentes': startup.competitors,
            'Pontos Positivos': startup.positive_points,
            'Pontos de Atenção': startup.attention_points,
            'Como a SCAngels pode agregar valor na Startup': startup.scangels_value_add,
            'Motivo Não Investimento': startup.no_investment_reason,
            'Receita Acumulada no Ano corrente': startup.accumulated_revenue_current_year,
            'Receita Total do último Ano': startup.total_revenue_last_year,
            'Receita total do penúltimo Ano': startup.total_revenue_previous_year,
            'Quantidade de Sócios': startup.partner_count,
            'TAM': startup.tam,
            'SAM': startup.sam,
            'SOM': startup.som,
            'Origem Lead': startup.origin_lead,
            'Quem Indicou': startup.referred_by,
            'Observações': startup.observations,
            
            // Add these aliases for backward compatibility
            name: startup.name,
            Description: startup.description,
            Website: startup.website,
            'Problema Resolvido': startup.problem_solved
          },
          labels: [],
          priority: startup.priority as 'low' | 'medium' | 'high' || 'medium',
          assignedTo: startup.assigned_to,
          dueDate: startup.due_date,
          timeTracking: startup.time_tracking || 0,
          attachments: [],
          pitchDeck: pitchDeck ? {
            name: pitchDeck.name || 'Pitch Deck',
            url: pitchDeck.url || '',
            size: pitchDeck.size,
            type: pitchDeck.type
          } : undefined
        };
      });
      setFormattedStartups(formatted);
    }
  }, [startupsData]);

  return {
    formattedStartups,
    statusesData,
    isLoadingStartups,
    isLoadingStatuses,
    isErrorStartups,
  };
};
