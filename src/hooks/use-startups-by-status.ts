
import { useStartupsByStatusQuery } from './queries/startups';
import { useToast } from '@/hooks/use-toast';

export const useStartupsByStatus = (statusId: string) => {
  const { toast } = useToast();
  
  // Use the query hook at the top level with a valid statusId
  const query = useStartupsByStatusQuery(statusId);
  
  // Add more detailed logging to troubleshoot Supabase connectivity
  console.log(`useStartupsByStatus hook for statusId ${statusId}:`, {
    dataLength: query.data ? query.data.length : 0,
    hasData: Boolean(query.data),
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ? `${query.error}` : null,
    isFetching: query.isFetching,
    isFetched: query.isFetched,
    isPlaceholder: statusId.startsWith('placeholder-'),
    status: query.status,
    statusIds: query.data ? query.data.map(s => s.id) : [],
  });
  
  // If there's an error and it's not a placeholder ID, show toast
  if (query.error && !statusId.startsWith('placeholder-')) {
    console.error(`Error fetching startups for status ${statusId}:`, query.error);
    toast({
      title: "Erro ao carregar dados",
      description: "Não foi possível carregar as startups. Tente recarregar a página.",
      variant: "destructive",
    });
  }
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
