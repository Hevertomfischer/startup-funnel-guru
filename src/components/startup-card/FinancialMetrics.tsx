import React from 'react';
import { DollarSign, Users } from 'lucide-react';
import { Startup } from '@/types/startup';

interface FinancialMetricsProps {
  startup: Startup;
  formatCurrency: (value?: number) => string;
}

export const FinancialMetrics: React.FC<FinancialMetricsProps> = ({ startup, formatCurrency }) => {
  const hasMRR = startup.values['MRR'] !== undefined;
  const hasAltMRR = startup.values['Receita Recorrente Mensal (MRR)'] !== undefined;
  const hasClients = startup.values['Quantidade de Clientes'] !== undefined;
  
  if (!hasMRR && !hasAltMRR && !hasClients) return null;
  
  return (
    <div className="space-y-1 mt-2">
      {hasMRR && (
        <div className="flex items-center gap-1 text-xs font-medium">
          <DollarSign className="h-3 w-3 text-primary" />
          MRR: {formatCurrency(startup.values['MRR'])}
        </div>
      )}
      
      {hasAltMRR && (
        <div className="flex items-center gap-1 text-xs font-medium">
          <DollarSign className="h-3 w-3 text-primary" />
          MRR: {formatCurrency(startup.values['Receita Recorrente Mensal (MRR)'])}
        </div>
      )}
      
      {hasClients && (
        <div className="flex items-center gap-1 text-xs">
          <Users className="h-3 w-3 text-primary" />
          Clientes: {startup.values['Quantidade de Clientes']}
        </div>
      )}
    </div>
  );
};
