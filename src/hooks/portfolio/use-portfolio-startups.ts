
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Startup } from '@/integrations/supabase/client';

/**
 * Custom hook to fetch all invested startups in the portfolio
 */
export const usePortfolioStartups = () => {
  return useQuery({
    queryKey: ['startups', 'portfolio'],
    queryFn: async (): Promise<Startup[]> => {
      try {
        // Fetch startups that have the "Investida" status
        // First, get the status ID for "Investida"
        const { data: statusData, error: statusError } = await supabase
          .from('statuses')
          .select('id')
          .ilike('name', '%investida%')
          .single();

        if (statusError) {
          console.error('Error fetching invested status:', statusError);
          return [];
        }

        const investedStatusId = statusData?.id;
        
        if (!investedStatusId) {
          console.warn('No invested status found. You may need to create a status named "Investida"');
          return [];
        }

        // Now fetch all startups with this status
        const { data, error } = await supabase
          .from('startups')
          .select(`
            *,
            status:statuses(id, name, color),
            labels:startups_labels(label_id),
            kpis:startup_kpis(*)
          `)
          .eq('status_id', investedStatusId)
          .order('name');

        if (error) {
          throw error;
        }

        return data || [];
      } catch (error: any) {
        console.error('Error fetching portfolio startups:', error);
        toast.error('Falha ao carregar portfólio de startups investidas');
        return [];
      }
    },
  });
};
