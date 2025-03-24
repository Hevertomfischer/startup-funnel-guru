import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Startup } from '@/types/startup';

interface BusinessInfoProps {
  startup: Startup;
}

export const BusinessInfo: React.FC<BusinessInfoProps> = ({ startup }) => {
  if (!startup.values['Setor'] && !startup.values['Modelo de Negócio'] && !startup.values['Mercado']) {
    return null;
  }
  
  return (
    <div className="mb-2">
      {startup.values['Setor'] && (
        <Badge variant="secondary" className="mr-1 text-xs">
          {startup.values['Setor']}
        </Badge>
      )}
      {startup.values['Modelo de Negócio'] && (
        <Badge variant="secondary" className="mr-1 text-xs">
          {startup.values['Modelo de Negócio']}
        </Badge>
      )}
      {startup.values['Mercado'] && (
        <Badge variant="secondary" className="text-xs">
          {startup.values['Mercado']}
        </Badge>
      )}
    </div>
  );
};
