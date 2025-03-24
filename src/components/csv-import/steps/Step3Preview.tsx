
import React, { useState, useEffect } from 'react';
import { CSVData, ColumnMapping, ImportResult } from '../CSVImportStepper';
import { UseMutationResult } from '@tanstack/react-query';
import { Startup } from '@/integrations/supabase/client';
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
    }
  }, [startupsPreview]);

  const handleSelectAll = (checked: boolean) => {
    const updatedStartups = handleSelectAllChange(checked);
    setStartupsPreview(updatedStartups);
  };

  const handleRowSelection = (index: number, checked: boolean) => {
    const updatedStartups = handleRowSelectionChange(startupsPreview, index, checked);
    setStartupsPreview(updatedStartups);
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
          />
        </>
      )}
    </div>
  );
};
