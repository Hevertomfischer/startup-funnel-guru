
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateAllNullStatusToDeclined } from '@/services/scripts/update-null-status-startups';

const FixNullStatusButton = () => {
  const [isFixing, setIsFixing] = useState(false);
  const { toast } = useToast();

  const handleFix = async () => {
    try {
      setIsFixing(true);
      const result = await updateAllNullStatusToDeclined();
      
      if (result && result.updated > 0) {
        toast({
          title: "Startups atualizadas",
          description: `${result.updated} startups sem status foram atualizadas.`,
        });
      } else {
        toast({
          title: "Nenhuma atualização necessária",
          description: "Não foram encontradas startups sem status.",
        });
      }
    } catch (error) {
      console.error('Error fixing null statuses:', error);
      toast({
        title: "Erro ao corrigir statuses",
        description: "Ocorreu um erro ao tentar corrigir startups sem status.",
        variant: "destructive",
      });
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="secondary"
      className="flex items-center gap-1"
      onClick={handleFix}
      disabled={isFixing}
    >
      {isFixing ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
      ) : (
        <AlertCircle className="h-3.5 w-3.5 mr-1" />
      )}
      {isFixing ? "Corrigindo status..." : "Corrigir startups sem status"}
    </Button>
  );
};

export default FixNullStatusButton;
