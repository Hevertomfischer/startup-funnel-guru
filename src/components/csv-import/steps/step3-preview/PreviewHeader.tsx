
import React from 'react';

interface PreviewHeaderProps {
  selectedCount: number;
  totalCount: number;
}

export const PreviewHeader: React.FC<PreviewHeaderProps> = ({
  selectedCount,
  totalCount
}) => {
  return (
    <div className="text-center">
      <h3 className="text-lg font-medium">Pré-visualização da Importação</h3>
      <p className="text-muted-foreground">
        Revise os dados antes de importar. {selectedCount} de {totalCount} startups 
        serão importadas.
      </p>
    </div>
  );
};
