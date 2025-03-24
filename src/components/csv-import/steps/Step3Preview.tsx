
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CSVData, ColumnMapping, ImportResult } from '../CSVImportStepper';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { UseMutationResult } from '@tanstack/react-query';
import { Startup } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';

interface Step3PreviewProps {
  csvData: CSVData;
  columnMapping: ColumnMapping;
  onNext: () => void;
  onPrevious: () => void;
  onImport: (result: ImportResult) => void;
  setIsImporting: (importing: boolean) => void;
  createStartupMutation: UseMutationResult<Startup | null, Error, any, unknown>;
}

interface ValidationError {
  field: string;
  message: string;
}

interface StartupPreview {
  data: Record<string, any>;
  errors: ValidationError[];
  selected: boolean;
}

export const Step3Preview: React.FC<Step3PreviewProps> = ({
  csvData,
  columnMapping,
  onNext,
  onPrevious,
  onImport,
  setIsImporting,
  createStartupMutation
}) => {
  const [startupsPreview, setStartupsPreview] = useState<StartupPreview[]>([]);
  const [isProcessing, setIsProcessing] = useState(true);
  const [selectAll, setSelectAll] = useState(true);

  useEffect(() => {
    // Transform and validate the CSV data
    const transformedData = transformAndValidateData();
    setStartupsPreview(transformedData);
    setIsProcessing(false);
  }, [csvData, columnMapping]);

  const transformAndValidateData = () => {
    return csvData.records.map(record => {
      const startupData: Record<string, any> = {};
      const errors: ValidationError[] = [];
      
      // Map CSV values to startup fields
      Object.entries(columnMapping).forEach(([csvHeader, startupField]) => {
        if (!startupField) return; // Skip unmapped columns
        
        const headerIndex = csvData.headers.indexOf(csvHeader);
        if (headerIndex !== -1) {
          const value = record[headerIndex]?.trim() || '';
          startupData[startupField] = value;
          
          // Validate the field
          if (startupField === 'name' && !value) {
            errors.push({
              field: 'name',
              message: 'Nome da startup é obrigatório'
            });
          }
          
          // Validate numeric fields
          if (['mrr', 'client_count', 'tam', 'sam', 'som'].includes(startupField) && value) {
            if (isNaN(Number(value))) {
              errors.push({
                field: startupField,
                message: `${startupField} deve ser um número válido`
              });
            }
          }
          
          // Could add more validations for other fields like email, dates, etc.
        }
      });
      
      return {
        data: startupData,
        errors,
        selected: errors.length === 0 // Pre-select only valid records
      };
    });
  };

  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked);
    setStartupsPreview(prev => 
      prev.map(startup => ({
        ...startup,
        selected: checked
      }))
    );
  };

  const handleRowSelectionChange = (index: number, checked: boolean) => {
    setStartupsPreview(prev => {
      const newData = [...prev];
      newData[index].selected = checked;
      
      // Update selectAll state based on all rows
      const allSelected = newData.every(s => s.selected);
      const anySelected = newData.some(s => s.selected);
      
      setSelectAll(allSelected);
      
      return newData;
    });
  };

  const prepareStartupData = (data: Record<string, any>) => {
    // Create a proper startup object for API
    const startupData: any = {
      name: data.name || '', // Required field
      status_id: data.status_id || null,
      problem_solved: data.problem_solved || null,
      sector: data.sector || null,
      business_model: data.business_model || null,
      website: data.website || null,
      // Convert numeric fields
      mrr: data.mrr ? Number(data.mrr) : null,
      client_count: data.client_count ? Number(data.client_count) : null,
      tam: data.tam ? Number(data.tam) : null,
      sam: data.sam ? Number(data.sam) : null,
      som: data.som ? Number(data.som) : null,
      // Add other fields
      ceo_name: data.ceo_name || null,
      ceo_email: data.ceo_email || null,
      ceo_whatsapp: data.ceo_whatsapp || null,
      ceo_linkedin: data.ceo_linkedin || null,
      founding_date: data.founding_date || null,
      city: data.city || null,
      state: data.state || null,
      market: data.market || null,
      competitors: data.competitors || null,
      description: data.description || null,
      // Default values
      priority: 'medium'
    };
    
    return startupData;
  };

  const handleImport = async () => {
    // Get selected startups
    const selectedStartups = startupsPreview
      .filter(startup => startup.selected)
      .map(startup => startup.data);
    
    if (selectedStartups.length === 0) {
      return;
    }
    
    setIsImporting(true);
    
    // Import results
    const results: ImportResult = {
      success: 0,
      failed: 0,
      errors: [],
      successfulStartups: []
    };
    
    // Import startups one by one
    for (let i = 0; i < selectedStartups.length; i++) {
      try {
        const startupData = prepareStartupData(selectedStartups[i]);
        const result = await createStartupMutation.mutateAsync(startupData);
        
        if (result) {
          results.success++;
          results.successfulStartups.push(result);
        } else {
          results.failed++;
          results.errors.push({
            row: i + 1,
            error: 'Falha ao criar startup'
          });
        }
      } catch (error: any) {
        results.failed++;
        results.errors.push({
          row: i + 1,
          error: error.message || 'Erro desconhecido'
        });
      }
    }
    
    // Call onImport with results
    onImport(results);
  };

  const selectedCount = startupsPreview.filter(s => s.selected).length;
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium">Pré-visualização da Importação</h3>
        <p className="text-muted-foreground">
          Revise os dados antes de importar. {selectedCount} de {startupsPreview.length} startups 
          serão importadas.
        </p>
      </div>
      
      {isProcessing ? (
        <div className="text-center py-8">Processando dados...</div>
      ) : (
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
                      {startup.errors.length > 0 ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          <span>{startup.errors.length} erros</span>
                        </Badge>
                      ) : (
                        <Badge variant="success" className="flex items-center gap-1 bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3" />
                          <span>Válido</span>
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={onPrevious}>Voltar</Button>
            <Button 
              onClick={handleImport} 
              disabled={selectedCount === 0}
            >
              Importar {selectedCount} Startups
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
