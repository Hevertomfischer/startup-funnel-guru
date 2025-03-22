
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface KPITableProps {
  kpis: any[];
  onEdit: (kpi: any) => void;
  onDelete: (id: string) => void;
}

const KPITable: React.FC<KPITableProps> = ({ kpis, onEdit, onDelete }) => {
  const formatCurrency = (value: any) => {
    if (value === null || value === undefined) return '-';
    return `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };
  
  const formatNumber = (value: any) => {
    if (value === null || value === undefined) return '-';
    return Number(value).toLocaleString('pt-BR');
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM yyyy', { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <ScrollArea className="h-[400px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Período</TableHead>
            <TableHead>Receita</TableHead>
            <TableHead>EBITDA</TableHead>
            <TableHead>Burn Rate</TableHead>
            <TableHead>Caixa</TableHead>
            <TableHead>Clientes</TableHead>
            <TableHead>Equipe</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {kpis.map((kpi: any) => (
            <TableRow key={kpi.id}>
              <TableCell className="font-medium">{formatDate(kpi.period)}</TableCell>
              <TableCell>{formatCurrency(kpi.revenue)}</TableCell>
              <TableCell>{formatCurrency(kpi.ebitda)}</TableCell>
              <TableCell>{formatCurrency(kpi.burn_rate)}</TableCell>
              <TableCell>{formatCurrency(kpi.cash_balance)}</TableCell>
              <TableCell>{formatNumber(kpi.client_count)}</TableCell>
              <TableCell>{formatNumber(kpi.team_size)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="icon" onClick={() => onEdit(kpi)}>
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => onDelete(kpi.id)}>
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default KPITable;
