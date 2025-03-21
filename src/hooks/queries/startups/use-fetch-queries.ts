
import { useQuery } from '@tanstack/react-query';
import { 
  getStartups, 
  getStartupsByStatus,
  getStartup,
} from '@/services';

// Basic startup fetch queries
export const useStartupsQuery = () => {
  return useQuery({
    queryKey: ['startups'],
    queryFn: getStartups
  });
};

export const useStartupsByStatusQuery = (statusId: string) => {
  // Check if this is a placeholder ID (for conditional rendering)
  const isPlaceholder = statusId.startsWith('placeholder-');
  
  return useQuery({
    queryKey: ['startups', 'status', statusId],
    queryFn: () => getStartupsByStatus(statusId),
    enabled: !!statusId && !isPlaceholder, // Don't run query for placeholder IDs
    staleTime: isPlaceholder ? Infinity : 5000, // 5 seconds for real queries, Infinity for placeholders
    gcTime: isPlaceholder ? 0 : 60000, // 1 minute for real queries, 0 for placeholders
    refetchInterval: isPlaceholder ? false : 10000 // Auto refresh every 10 seconds for real status
  });
};

export const useStartupQuery = (id?: string) => {
  return useQuery({
    queryKey: ['startup', id],
    queryFn: () => getStartup(id!),
    enabled: !!id
  });
};
