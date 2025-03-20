
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

/**
 * Shows a toast notification if there are no boards yet
 */
export const useEmptyBoardNotice = (
  isLoading: boolean,
  columnsLength: number,
  statusesLength: number,
) => {
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isLoading && columnsLength === 0 && statusesLength === 0) {
      console.log("No statuses available. Suggesting to add a column.");
      toast({
        title: "Board vazio",
        description: "Adicione uma coluna para começar a organizar suas startups.",
        duration: 5000,
      });
    }
  }, [isLoading, columnsLength, statusesLength, toast]);
};
