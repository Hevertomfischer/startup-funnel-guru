
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface StartupChangesHistoryProps {
  history: any[];
}

const formatFieldName = (fieldName: string): string => {
  const fieldMap: Record<string, string> = {
    'name': 'Nome',
    'description': 'Descrição',
    'problem_solved': 'Problema Resolvido',
    'sector': 'Setor',
    'business_model': 'Modelo de Negócio',
    'website': 'Website',
    'priority': 'Prioridade',
    'status_id': 'Status',
    'mrr': 'MRR',
    'client_count': 'Quantidade de Clientes',
    'assigned_to': 'Atribuído a',
    'ceo_name': 'Nome do CEO',
    'ceo_email': 'E-mail do CEO',
    'ceo_whatsapp': 'WhatsApp do CEO',
    'ceo_linkedin': 'LinkedIn do CEO',
    'founding_date': 'Data de Fundação',
    'city': 'Cidade',
    'state': 'Estado',
    'google_drive_link': 'Link do Google Drive',
    'category': 'Categoria',
    'market': 'Mercado',
    'problem_solution': 'Como Resolve o Problema',
    'differentials': 'Diferenciais',
    'competitors': 'Concorrentes',
    'positive_points': 'Pontos Positivos',
    'attention_points': 'Pontos de Atenção',
    'scangels_value_add': 'Valor Agregado SCAngels',
    'no_investment_reason': 'Motivo de Não Investimento',
    'accumulated_revenue_current_year': 'Receita Acumulada Ano Corrente',
    'total_revenue_last_year': 'Receita Total Último Ano',
    'total_revenue_previous_year': 'Receita Total Penúltimo Ano',
    'partner_count': 'Quantidade de Sócios',
    'tam': 'TAM',
    'sam': 'SAM',
    'som': 'SOM',
    'origin_lead': 'Origem do Lead',
    'referred_by': 'Indicado por',
    'observations': 'Observações'
  };

  return fieldMap[fieldName] || fieldName;
};

const formatValue = (value: string | null): string => {
  if (value === null || value === undefined) return 'N/A';
  return value;
};

const StartupChangesHistory: React.FC<StartupChangesHistoryProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma alteração registrada para esta startup
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Data</TableHead>
            <TableHead>Campo</TableHead>
            <TableHead>Valor Anterior</TableHead>
            <TableHead>Novo Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map(record => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">
                {format(new Date(record.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{formatFieldName(record.field_name)}</Badge>
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {formatValue(record.old_value)}
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {formatValue(record.new_value)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StartupChangesHistory;
