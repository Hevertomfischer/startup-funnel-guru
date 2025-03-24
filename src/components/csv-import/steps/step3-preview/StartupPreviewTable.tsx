
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { StartupPreview } from './types';

interface StartupPreviewTableProps {
  startupsPreview: StartupPreview[];
  selectAll: boolean;
  handleSelectAllChange: (checked: boolean) => void;
  handleRowSelectionChange: (index: number, checked: boolean) => void;
}

export const StartupPreviewTable: React.FC<StartupPreviewTableProps> = ({
  startupsPreview,
  selectAll,
  handleSelectAllChange,
  handleRowSelectionChange
}) => {
  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <Checkbox 
          id="select-all" 
          checked={selectAll} 
          onCheckedChange={handleSelectAllChange}
        />
        <label htmlFor="select-all" className="text-sm">
          Selecionar todas ({startupsPreview.length})
        </label>
      </div>
      
      <div className="overflow-auto max-h-[400px] border rounded-md">
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10">
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Setor</TableHead>
              <TableHead>MRR</TableHead>
              <TableHead className="text-right">Validação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {startupsPreview.map((startup, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox 
                    checked={startup.selected} 
                    disabled={startup.errors.length > 0}
                    onCheckedChange={(checked) => 
                      handleRowSelectionChange(index, !!checked)
                    }
                  />
                </TableCell>
                <TableCell>{startup.data.name || <span className="text-muted-foreground">Sem nome</span>}</TableCell>
                <TableCell>{startup.data.status_id || '-'}</TableCell>
                <TableCell>{startup.data.sector || '-'}</TableCell>
                <TableCell>{startup.data.mrr || '-'}</TableCell>
                <TableCell className="text-right">
                  <ValidationBadge errors={startup.errors} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

const ValidationBadge: React.FC<{ errors: { field: string; message: string }[] }> = ({ errors }) => {
  if (errors.length > 0) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        <span>{errors.length} erros</span>
      </Badge>
    );
  }
  
  return (
    <Badge variant="success" className="flex items-center gap-1 bg-green-100 text-green-800">
      <CheckCircle className="h-3 w-3" />
      <span>Válido</span>
    </Badge>
  );
};
