
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
      const formatted = startupsData.map(startup => ({
        id: startup.id,
        createdAt: startup.created_at ? startup.created_at : new Date().toISOString(),
        updatedAt: startup.updated_at ? startup.updated_at : new Date().toISOString(),
        statusId: startup.status_id || '',
        values: {
          Startup: startup.name,
          'Problema que Resolve': startup.problem_solved,
          Setor: startup.sector,
          'Modelo de Negócio': startup.business_model,
          'Site da Startup': startup.website,
          MRR: startup.mrr,
          'Quantidade de Clientes': startup.client_count,
          // Add these aliases for backward compatibility
          name: startup.name,
          Description: startup.description,
          Website: startup.website,
          'Problema Resolvido': startup.problem_solved
        },
        labels: [],
        priority: startup.priority as 'low' | 'medium' | 'high' || 'medium',
        assignedTo: startup.assigned_to,
        dueDate: startup.due_date || undefined,
        timeTracking: startup.time_tracking || 0,
        attachments: []
      }));
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
