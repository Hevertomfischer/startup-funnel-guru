
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CSVData, ColumnMapping } from '../CSVImportStepper';
import { AlertCircle, HelpCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

// Define the startup field options
const startupFields = [
  { value: 'name', label: 'Nome da Startup', required: true, description: 'Nome da empresa' },
  { value: 'status_id', label: 'Status', required: false, description: 'Status atual da startup no pipeline' },
  { value: 'problem_solved', label: 'Problema Resolvido', required: false, description: 'Que problema a startup resolve' },
  { value: 'sector', label: 'Setor', required: false, description: 'Setor de atuação da startup' },
  { value: 'business_model', label: 'Modelo de Negócio', required: false, description: 'Modelo de negócio da startup (SaaS, Marketplace, etc)' },
  { value: 'website', label: 'Site', required: false, description: 'Website da startup' },
  { value: 'mrr', label: 'MRR', required: false, description: 'Receita recorrente mensal' },
  { value: 'client_count', label: 'Quantidade de Clientes', required: false, description: 'Número de clientes ativos' },
  { value: 'ceo_name', label: 'Nome do CEO', required: false, description: 'Nome do CEO ou fundador principal' },
  { value: 'ceo_email', label: 'Email do CEO', required: false, description: 'Email de contato do CEO' },
  { value: 'ceo_whatsapp', label: 'Whatsapp do CEO', required: false, description: 'Número de telefone do CEO' },
  { value: 'ceo_linkedin', label: 'LinkedIn do CEO', required: false, description: 'Perfil do LinkedIn do CEO' },
  { value: 'founding_date', label: 'Data de Fundação', required: false, description: 'Data de fundação da startup' },
  { value: 'city', label: 'Cidade', required: false, description: 'Cidade onde a startup está sediada' },
  { value: 'state', label: 'Estado', required: false, description: 'Estado onde a startup está sediada' },
  { value: 'market', label: 'Mercado', required: false, description: 'Mercado de atuação da startup' },
  { value: 'competitors', label: 'Concorrentes', required: false, description: 'Principais concorrentes' },
  { value: 'tam', label: 'TAM', required: false, description: 'Total Addressable Market (em R$)' },
  { value: 'sam', label: 'SAM', required: false, description: 'Serviceable Available Market (em R$)' },
  { value: 'som', label: 'SOM', required: false, description: 'Serviceable Obtainable Market (em R$)' },
  { value: 'description', label: 'Descrição', required: false, description: 'Descrição geral da startup' },
];

interface Step2ColumnMappingProps {
  csvData: CSVData;
  columnMapping: ColumnMapping;
  setColumnMapping: React.Dispatch<React.SetStateAction<ColumnMapping>>;
  onNext: () => void;
  onPrevious: () => void;
}

export const Step2ColumnMapping: React.FC<Step2ColumnMappingProps> = ({
  csvData,
  columnMapping,
  setColumnMapping,
  onNext,
  onPrevious
}) => {
  const [error, setError] = useState<string | null>(null);
  const [autoMappedCount, setAutoMappedCount] = useState(0);

  // Auto-map columns on first render
  useEffect(() => {
    // Skip if mapping already exists
    if (Object.keys(columnMapping).length > 0) return;

    const initialMapping: ColumnMapping = {};
    let mappedCount = 0;

    csvData.headers.forEach(header => {
      // Try to find matching startup field by comparing lowercase, trimmed versions
      const normalizedHeader = header.toLowerCase().trim();
      
      // Try to map CSV headers to startup fields
      const matchedField = startupFields.find(field => {
        const fieldName = field.label.toLowerCase().trim();
        const fieldValue = field.value.toLowerCase().trim();
        
        return normalizedHeader === fieldName || 
               normalizedHeader === fieldValue ||
               normalizedHeader.includes(fieldName) ||
               fieldName.includes(normalizedHeader);
      });
      
      if (matchedField) {
        initialMapping[header] = matchedField.value;
        mappedCount++;
      } else {
        initialMapping[header] = null;
      }
    });
    
    setColumnMapping(initialMapping);
    setAutoMappedCount(mappedCount);
  }, [csvData.headers, setColumnMapping]);

  const handleMappingChange = (csvHeader: string, startupField: string | null) => {
    setColumnMapping(prev => ({
      ...prev,
      [csvHeader]: startupField
    }));
  };

  const validateMapping = () => {
    // Check if required fields are mapped
    const requiredFields = startupFields.filter(field => field.required);
    const mappedFields = Object.values(columnMapping).filter(Boolean) as string[];
    
    const missingRequiredFields = requiredFields.filter(
      field => !mappedFields.includes(field.value)
    );
    
    if (missingRequiredFields.length > 0) {
      const missingFieldNames = missingRequiredFields.map(f => f.label).join(', ');
      setError(`Campos obrigatórios não mapeados: ${missingFieldNames}`);
      return false;
    }
    
    // Check for duplicate mappings
    const fieldCounts: Record<string, number> = {};
    Object.values(columnMapping).forEach(field => {
      if (field) {
        fieldCounts[field] = (fieldCounts[field] || 0) + 1;
      }
    });
    
    const duplicateFields = Object.entries(fieldCounts)
      .filter(([_, count]) => count > 1)
      .map(([field]) => startupFields.find(f => f.value === field)?.label || field);
    
    if (duplicateFields.length > 0) {
      setError(`Mapeamento duplicado para os campos: ${duplicateFields.join(', ')}`);
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (validateMapping()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium">Mapeamento de Colunas</h3>
        <p className="text-muted-foreground">
          Associe as colunas do seu arquivo CSV aos campos correspondentes do sistema.
          {autoMappedCount > 0 && (
            <span className="block mt-1 text-sm">
              {autoMappedCount} de {csvData.headers.length} colunas foram mapeadas automaticamente.
            </span>
          )}
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro no mapeamento</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="overflow-auto max-h-[400px] pr-2">
        <table className="w-full border-collapse">
          <thead className="bg-muted sticky top-0">
            <tr>
              <th className="text-left py-2 px-4">Coluna do CSV</th>
              <th className="text-left py-2 px-4">Campo da Startup</th>
              <th className="text-left py-2 px-4 w-16">Amostra</th>
            </tr>
          </thead>
          <tbody>
            {csvData.headers.map((header, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4">{header}</td>
                <td className="py-2 px-4">
                  <div className="flex items-center gap-2">
                    <Select
                      value={columnMapping[header] || ""}
                      onValueChange={(value) => handleMappingChange(header, value || null)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o campo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Ignorar esta coluna</SelectItem>
                        {startupFields.map((field) => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label} 
                            {field.required && <span className="text-destructive ml-1">*</span>}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {columnMapping[header] && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            {startupFields.find(f => f.value === columnMapping[header])?.description}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </td>
                <td className="py-2 px-4">
                  {csvData.records[0] && (
                    <Badge variant="outline" className="truncate max-w-[100px]">
                      {csvData.records[0][csvData.headers.indexOf(header)]}
                    </Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onPrevious}>Voltar</Button>
        <Button onClick={handleNext}>Continuar</Button>
      </div>
    </div>
  );
};
