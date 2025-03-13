
import { useStartupsByStatusQuery } from './use-supabase-query';

export const useStartupsByStatus = (statusId: string) => {
  const query = useStartupsByStatusQuery(statusId);
  
  return query;
};
