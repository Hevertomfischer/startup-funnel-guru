
import { useStartupsByStatusQuery } from './use-supabase-query';

export const useStartupsByStatus = (statusId: string) => {
  // Use diretamente o hook do react-query, sem o useState adicional que estava causando problemas
  const query = useStartupsByStatusQuery(statusId);
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError
  };
};
