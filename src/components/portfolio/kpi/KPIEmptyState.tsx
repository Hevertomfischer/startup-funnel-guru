
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface KPIEmptyStateProps {
  onAddClick: () => void;
}

const KPIEmptyState: React.FC<KPIEmptyStateProps> = ({ onAddClick }) => {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <p>Nenhum KPI registrado para esta startup</p>
      <Button variant="outline" className="mt-4" onClick={onAddClick}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Adicionar Primeiro KPI
      </Button>
    </div>
  );
};

export default KPIEmptyState;
