
import { useStartupsByStatusQuery } from './queries/startups';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export const useStartupsByStatus = (statusId: string) => {
  const { toast } = useToast();
  
  // Log para acompanhar o fluxo da aplicação
  console.log(`useStartupsByStatus hook inicializado para statusId ${statusId}`, {
    isPlaceholder: statusId.startsWith('placeholder-'),
  });
  
  // Use o hook de query no nível superior com um statusId válido
  const query = useStartupsByStatusQuery(statusId);
  
  // Adicionar logging mais detalhado para solucionar problemas de conectividade com o Supabase
  useEffect(() => {
    console.log(`useStartupsByStatus hook para statusId ${statusId}:`, {
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
  }, [statusId, query.data, query.isLoading, query.isError, query.error, query.isFetching, query.isFetched, query.status]);
  
  // Se houver um erro e não for um ID de placeholder, mostrar toast
  useEffect(() => {
    if (query.error && !statusId.startsWith('placeholder-')) {
      console.error(`Erro ao buscar startups para status ${statusId}:`, query.error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as startups. Tentando novamente...",
        variant: "destructive",
      });
    }
  }, [query.error, statusId, toast]);
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
