
import React, { useState, useEffect } from 'react';
import { CSVData, ColumnMapping, ImportResult } from '../CSVImportStepper';
import { UseMutationResult } from '@tanstack/react-query';
import { Startup } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  StartupPreviewTable, 
  ActionButtons, 
  PreviewHeader,
  useDataTransformer,
  useSelectionState
} from './step3-preview';

interface Step3PreviewProps {
  csvData: CSVData;
  columnMapping: ColumnMapping;
  onNext: () => void;
  onPrevious: () => void;
  onImport: (result: ImportResult) => void;
  setIsImporting: (importing: boolean) => void;
  createStartupMutation: UseMutationResult<Startup | null, Error, any, unknown>;
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
  const [isProcessing, setIsProcessing] = useState(true);
  const [importInProgress, setImportInProgress] = useState(false);
  const { 
    startupsPreview, 
    setStartupsPreview, 
    prepareStartupData 
  } = useDataTransformer(csvData, columnMapping);
  
  const { 
    selectAll, 
    selectedCount, 
    handleSelectAllChange, 
    handleRowSelectionChange 
  } = useSelectionState(startupsPreview);

  useEffect(() => {
    // Set processing state to false after data is transformed
    if (startupsPreview.length > 0) {
      setIsProcessing(false);
    } else if (csvData.records.length > 0 && startupsPreview.length === 0) {
      toast.error('Não foi possível processar os dados. Verifique o formato do CSV.');
      setIsProcessing(false);
    }
  }, [startupsPreview, csvData.records.length]);

  const handleSelectAll = (checked: boolean) => {
    const updatedStartups = handleSelectAllChange(checked);
    setStartupsPreview(updatedStartups);
  };

  const handleRowSelection = (index: number, checked: boolean) => {
    const updatedStartups = handleRowSelectionChange(startupsPreview, index, checked);
    setStartupsPreview(updatedStartups);
  };

  const handleImport = async () => {
    try {
      // Get selected startups
      const selectedStartups = startupsPreview
        .filter(startup => startup.selected)
        .map(startup => startup.data);
      
      if (selectedStartups.length === 0) {
        toast.warning('Selecione pelo menos uma startup para importar');
        return;
      }
      
      // Prevent double submission
      if (importInProgress) {
        console.log('Import already in progress, ignoring request');
        return;
      }
      
      setImportInProgress(true);
      setIsImporting(true);
      
      // Import results
      const results: ImportResult = {
        success: 0,
        failed: 0,
        errors: [],
        successfulStartups: []
      };
      
      console.log(`Importing ${selectedStartups.length} startups...`);
      
      // Import startups one by one
      for (let i = 0; i < selectedStartups.length; i++) {
        try {
          const startupName = selectedStartups[i].name || `Row ${i + 1}`;
          console.log(`Processing startup ${i + 1}/${selectedStartups.length}: ${startupName}`);
          
          const startupData = prepareStartupData(selectedStartups[i]);
          const result = await createStartupMutation.mutateAsync(startupData);
          
          if (result) {
            console.log(`Successfully imported: ${startupName}`);
            results.success++;
            results.successfulStartups.push(result);
          } else {
            console.error(`Failed to create startup: ${startupName}`);
            results.failed++;
            results.errors.push({
              row: i + 1,
              error: 'Falha ao criar startup',
              startup: startupName
            });
          }
        } catch (error: any) {
          const errorMessage = error.message || 'Erro desconhecido';
          console.error(`Error importing startup at row ${i + 1}:`, error);
          
          results.failed++;
          results.errors.push({
            row: i + 1,
            error: errorMessage,
            startup: selectedStartups[i].name || `Row ${i + 1}`
          });
        }
      }
      
      // Call onImport with results
      onImport(results);
    } catch (error: any) {
      console.error('Unexpected error during import process:', error);
      toast.error('Erro durante o processo de importação');
    } finally {
      setImportInProgress(false);
      setIsImporting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <PreviewHeader 
        selectedCount={selectedCount} 
        totalCount={startupsPreview.length} 
      />
      
      {isProcessing ? (
        <div className="text-center py-8">Processando dados...</div>
      ) : (
        <>
          <StartupPreviewTable 
            startupsPreview={startupsPreview}
            selectAll={selectAll}
            handleSelectAllChange={handleSelectAll}
            handleRowSelectionChange={handleRowSelection}
          />
          
          <ActionButtons 
            onPrevious={onPrevious}
            onImport={handleImport}
            selectedCount={selectedCount}
            isImporting={importInProgress}
          />
        </>
      )}
    </div>
  );
};
