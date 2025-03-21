
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
        console.log('Fetching portfolio startups...');
        
        // Fetch statuses that could represent invested startups
        const { data: statusData, error: statusError } = await supabase
          .from('statuses')
          .select('id, name')
          .or('name.ilike.%investida%,name.ilike.%invested%')
          .order('position');

        if (statusError) {
          console.error('Error fetching invested status:', statusError);
          throw statusError;
        }

        if (!statusData || statusData.length === 0) {
          console.warn('No invested status found. You may need to create a status named "Investida"');
          return [];
        }

        // Log the found statuses
        console.log('Found invested statuses:', statusData);
        const investedStatusIds = statusData.map(status => status.id);
        
        // Now fetch all startups with these statuses
        const { data, error } = await supabase
          .from('startups')
          .select(`
            *,
            status:statuses(id, name, color),
            labels:startups_labels(label_id),
            kpis:startup_kpis(*)
          `)
          .in('status_id', investedStatusIds)
          .order('name');

        if (error) {
          console.error('Error fetching startups by invested status:', error);
          throw error;
        }

        console.log(`Found ${data?.length || 0} invested startups`);
        return data || [];
      } catch (error: any) {
        console.error('Error in usePortfolioStartups hook:', error);
        toast.error('Falha ao carregar portfólio de startups investidas');
        return [];
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
