
import React, { Suspense, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import BoardView from '@/components/board/BoardView';
import { updateAllNullStatusToDeclined } from '@/services/scripts/update-null-status-startups';
import { useToast } from '@/hooks/use-toast';

const Board = () => {
  const { toast } = useToast();
  
  // Automatically run the fix on page load
  useEffect(() => {
    const fixNullStatuses = async () => {
      try {
        console.log('Automatically fixing null status startups...');
        const result = await updateAllNullStatusToDeclined();
        console.log('Fix result:', result);
        
        if (result.updated > 0) {
          toast({
            title: "Startups atualizadas",
            description: `${result.updated} startups sem status foram atualizadas.`,
          });
        }
      } catch (error) {
        console.error('Failed to automatically fix null statuses:', error);
        toast({
          title: "Erro ao atualizar startups",
          description: "Não foi possível atualizar as startups sem status.",
          variant: "destructive",
        });
      }
    };
    
    fixNullStatuses();
  }, [toast]);
  
  return (
    <Suspense fallback={
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading board...</span>
      </div>
    }>
      <BoardView />
    </Suspense>
  );
};

export default Board;
