
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ActionButtonsProps {
  onPrevious: () => void;
  onImport: () => void;
  selectedCount: number;
  isImporting?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onPrevious,
  onImport,
  selectedCount,
  isImporting = false
}) => {
  return (
    <div className="flex justify-between mt-6">
      <Button 
        variant="outline" 
        onClick={onPrevious}
        disabled={isImporting}
      >
        Voltar
      </Button>
      <Button 
        onClick={onImport} 
        disabled={selectedCount === 0 || isImporting}
      >
        {isImporting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            Importando...
          </>
        ) : (
          `Importar ${selectedCount} Startups`
        )}
      </Button>
    </div>
  );
};
