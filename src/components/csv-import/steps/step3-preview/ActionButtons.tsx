
import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  onPrevious: () => void;
  onImport: () => void;
  selectedCount: number;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onPrevious,
  onImport,
  selectedCount
}) => {
  return (
    <div className="flex justify-between mt-6">
      <Button variant="outline" onClick={onPrevious}>Voltar</Button>
      <Button 
        onClick={onImport} 
        disabled={selectedCount === 0}
      >
        Importar {selectedCount} Startups
      </Button>
    </div>
  );
};
