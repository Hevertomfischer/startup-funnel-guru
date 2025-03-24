
import React from 'react';
import { HeaderSectionProps } from './types';

export const HeaderSection: React.FC<HeaderSectionProps> = ({ 
  autoMappedCount, 
  totalHeaders 
}) => {
  return (
    <div className="text-center">
      <h3 className="text-lg font-medium">Mapeamento de Colunas</h3>
      <p className="text-muted-foreground">
        Associe as colunas do seu arquivo CSV aos campos correspondentes do sistema.
        {autoMappedCount > 0 && (
          <span className="block mt-1 text-sm">
            {autoMappedCount} de {totalHeaders} colunas foram mapeadas automaticamente.
          </span>
        )}
      </p>
    </div>
  );
};
