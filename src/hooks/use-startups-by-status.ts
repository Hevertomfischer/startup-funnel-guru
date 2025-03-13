
import { useState, useEffect } from 'react';
import { useStartupsByStatusQuery } from './use-supabase-query';

export const useStartupsByStatus = (statusId: string) => {
  const [startups, setStartups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  const query = useStartupsByStatusQuery(statusId);
  
  useEffect(() => {
    if (query.data) {
      setStartups(query.data);
      setIsLoading(false);
    }
    
    if (query.isError) {
      setIsError(true);
      setIsLoading(false);
    }
  }, [query.data, query.isError]);
  
  return {
    data: startups,
    isLoading,
    isError
  };
};
